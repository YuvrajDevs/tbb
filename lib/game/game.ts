"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CaseFile } from "../types";
import { emptyPrivate, MAX_PLAYERS, newShared, reduce, sortedPlayers, type Action, type Private, type Shared } from "./state";
import { openTransport, transportKind, type Msg, type Transport } from "./transport";

export interface Game {
  c: CaseFile;
  s: Shared;
  me: string;
  isHost: boolean;
  party: boolean;
  online: string[];
  /** true while the room has no reachable host; the room is paused */
  hostAway: boolean;
  /** when the pause started, to freeze timers on screen */
  pausedAt: number | null;
  connected: boolean;
  /** host clock minus this device's clock, so timers agree across phones */
  skew: number;
  act(a: Action): void;
  priv: Private;
  setPriv(fn: (p: Private) => Private): void;
  room?: { code: string; transport: "supabase" | "relay" | "local" };
}

/* ---------- storage helpers (never throw) ---------- */
const read = <T,>(store: "local" | "session", key: string): T | null => {
  try {
    const raw = (store === "local" ? localStorage : sessionStorage).getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};
const write = (store: "local" | "session", key: string, v: unknown) => {
  try {
    (store === "local" ? localStorage : sessionStorage).setItem(key, JSON.stringify(v));
  } catch {}
};
export const remove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {}
};

const SOLO_VERSION = 2;
export const soloKey = (caseId: string) => `blackwood:solo:v${SOLO_VERSION}:${caseId}`;
export const soloPrivKey = (caseId: string) => `blackwood:solo:v${SOLO_VERSION}:${caseId}:private`;

export function soloStatus(caseId: string): "New" | "In progress" | "Solved" {
  const s = read<Shared>("local", soloKey(caseId));
  if (!s) return "New";
  return s.finishedAt ? "Solved" : "In progress";
}
export function clearSolo(caseId: string) {
  remove(soloKey(caseId));
  remove(soloPrivKey(caseId));
}

function usePrivate(key: string | null) {
  const [priv, setPrivState] = useState<Private>(emptyPrivate);
  useEffect(() => {
    if (!key) return;
    setPrivState({ ...emptyPrivate(), ...(read<Private>("local", key) ?? {}) });
  }, [key]);
  const setPriv = useCallback(
    (fn: (p: Private) => Private) =>
      setPrivState((prev) => {
        const next = fn(prev);
        if (key) write("local", key, next);
        return next;
      }),
    [key]
  );
  return { priv, setPriv };
}

/* =========================== SOLO =========================== */

export function useSoloGame(c: CaseFile): Game | null {
  const [s, setS] = useState<Shared | null>(null);
  const { priv, setPriv } = usePrivate(soloPrivKey(c.id));

  useEffect(() => {
    const saved = read<Shared>("local", soloKey(c.id));
    const st = saved && saved.caseId === c.id ? saved : newShared(c, "solo", "Detective", true);
    write("local", soloKey(c.id), st);
    setS(st);
  }, [c]);

  const act = useCallback(
    (a: Action) =>
      setS((prev) => {
        if (!prev) return prev;
        const next = reduce(c, prev, a, "solo", { now: Date.now(), online: ["solo"] });
        if (next !== prev) write("local", soloKey(c.id), next);
        return next;
      }),
    [c]
  );

  if (!s) return null;
  return { c, s, me: "solo", isHost: true, party: false, online: ["solo"], hostAway: false, pausedAt: null, connected: true, skew: 0, act, priv, setPriv };
}

/* =========================== ROOM =========================== */

const HB_MS = 2500;
const AWAY_MS = 9000;
const BYE_GRACE_MS = 4000;
const TAKEOVER_MS = 3000;
const TAKEOVER_V_JUMP = 1000;
const RETRY_MS = 1500;

export const roomIdKey = (code: string) => `blackwood:room:${code}:id`;
const roomStateKey = (code: string) => `blackwood:room:${code}:state`;
const roomCreatorKey = (code: string) => `blackwood:room:${code}:creator`;
export const roomNameKey = (code: string) => `blackwood:room:${code}:name`;
export const roomPrivKey = (code: string, id: string) => `blackwood:room:${code}:${id}:private`;
export const NAME_KEY = "blackwood:name";

export function markRoomCreator(code: string) {
  write("session", roomCreatorKey(code), true);
}

function better(a: Shared, b: Shared | null) {
  if (!b) return true;
  if (a.v !== b.v) return a.v > b.v;
  if (a.hostId === b.hostId) return false;
  // equal versions from two would-be hosts: the earlier-joined host wins everywhere
  const ja = a.players[a.hostId]?.joinedAt ?? Infinity;
  const jb = b.players[b.hostId]?.joinedAt ?? Infinity;
  return ja < jb || (ja === jb && a.hostId < b.hostId);
}

export function newId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/** A device keeps its seat across closed tabs (localStorage); two tabs in one browser get different seats. */
function loadId(code: string) {
  const fromTab = read<string>("session", roomIdKey(code));
  if (fromTab) return fromTab;
  const id = read<string>("local", roomIdKey(code)) ?? newId();
  write("session", roomIdKey(code), id);
  write("local", roomIdKey(code), id);
  return id;
}

export type RoomStatus = "connecting" | "waiting" | "joining" | "full" | "removed" | "ready";

type Pending = { seq: number; action: Action };

export function useRoomGame(c: CaseFile, code: string, name: string | null): { game: Game | null; status: RoomStatus } {
  const [me, setMe] = useState<string>("");
  useEffect(() => {
    setMe(loadId(code));
  }, [code]);
  const [nonce] = useState(() => Math.random().toString(36).slice(2));
  const [loadedAt] = useState(() => Date.now());

  const [s, setS] = useState<Shared | null>(null);
  const sRef = useRef<Shared | null>(null);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<RoomStatus>("connecting");
  const [, setTick] = useState(0);
  const seen = useRef<Map<string, number>>(new Map());
  const byes = useRef<Map<string, number>>(new Map());
  const connectedAt = useRef<number>(0);
  const hostLostAt = useRef<number | null>(null);
  const skewRef = useRef(0);
  const tRef = useRef<Transport | null>(null);
  const queue = useRef<Pending[]>([]);
  const seqBase = useRef(Date.now() * 1000);
  const lastSync = useRef(0);
  const nameRef = useRef(name);
  nameRef.current = name;
  const { priv, setPriv } = usePrivate(me ? roomPrivKey(code, me) : null);

  const onlineIds = useCallback((): string[] => {
    const now = Date.now();
    const st = sRef.current;
    const ids = new Set<string>([me]);
    for (const id of st ? Object.keys(st.players) : []) {
      if (id === me) continue;
      const bye = byes.current.get(id);
      const last = seen.current.get(id);
      if (bye && (!last || last <= bye) && now - bye > BYE_GRACE_MS) continue;
      if (last !== undefined) {
        if (now - last < AWAY_MS) ids.add(id);
      } else if (now - connectedAt.current < AWAY_MS) {
        ids.add(id); // not heard yet; give them the benefit of the doubt right after we connect
      }
    }
    return [...ids];
  }, [me]);

  const sendState = useCallback(() => {
    if (sRef.current) tRef.current?.send({ t: "state", from: me, state: sRef.current, at: Date.now() });
  }, [me]);

  const adopt = useCallback(
    (next: Shared, broadcast: boolean) => {
      sRef.current = next;
      setS(next);
      write("local", roomStateKey(code), next);
      const acked = next.seq?.[me] ?? 0;
      if (queue.current.length) queue.current = queue.current.filter((q) => q.seq > acked);
      if (broadcast) sendState();
    },
    [code, me, sendState]
  );

  /** host only: apply a batch of one player's intents, in order, once each */
  const applyIntents = useCallback(
    (list: Pending[], actor: string) => {
      let cur = sRef.current;
      if (!cur || cur.hostId !== me) return;
      const start = cur;
      for (const { seq, action } of list) {
        if (seq <= (cur.seq?.[actor] ?? 0)) continue;
        const after = reduce(c, cur, action, actor, { now: Date.now(), online: onlineIds() });
        cur = { ...after, v: after === cur ? cur.v + 1 : after.v, seq: { ...(after.seq ?? {}), [actor]: seq } };
      }
      if (cur !== start) adopt(cur, true);
      else sendState(); // a retry of something already applied: re-send so they see the ack
    },
    [adopt, c, me, onlineIds, sendState]
  );

  const flush = useCallback(() => {
    if (queue.current.length) tRef.current?.send({ t: "intents", from: me, list: queue.current });
  }, [me]);

  const act = useCallback(
    (a: Action) => {
      const cur = sRef.current;
      if (!cur) return;
      if (cur.hostId === me) {
        const next = reduce(c, cur, a, me, { now: Date.now(), online: onlineIds() });
        if (next !== cur) adopt(next, true);
        return;
      }
      queue.current.push({ seq: ++seqBase.current, action: a });
      flush();
    },
    [adopt, c, flush, me, onlineIds]
  );

  /* connect */
  useEffect(() => {
    if (!me || !name) return;
    let closed = false;
    const cached = read<Shared>("local", roomStateKey(code));
    const creator = read<boolean>("session", roomCreatorKey(code));

    const onMsg = (m: Msg) => {
      if (closed) return;
      if (m.from === me) {
        // another tab of this browser is using our seat: the newer tab takes a fresh one
        if (m.t === "hb" && m.nonce && m.nonce !== nonce && (m.since ?? 0) < loadedAt) {
          const id = newId();
          write("session", roomIdKey(code), id);
          setS(null);
          sRef.current = null;
          queue.current = [];
          setMe(id);
        }
        return;
      }
      seen.current.set(m.from, Date.now());
      const cur = sRef.current;
      switch (m.t) {
        case "hb":
          byes.current.delete(m.from);
          // anti-entropy: whoever is behind gets caught up, at most once a second
          if (cur && m.v !== undefined && Date.now() - lastSync.current > 1000) {
            if (cur.hostId === me && m.v < cur.v) {
              lastSync.current = Date.now();
              sendState();
            } else if (m.from === cur.hostId && m.v > cur.v) {
              lastSync.current = Date.now();
              tRef.current?.send({ t: "hello", from: me });
            }
          }
          return;
        case "bye":
          byes.current.set(m.from, Date.now());
          seen.current.set(m.from, Date.now() - 1);
          return;
        case "hello":
          // the host answers; if the host is away, anyone with state does
          if (cur && (cur.hostId === me || !onlineIds().includes(cur.hostId))) sendState();
          return;
        case "state":
          if (m.state.caseId !== c.id) return;
          if (m.at && m.from === m.state.hostId) skewRef.current = m.at - Date.now();
          if (better(m.state, cur)) adopt(m.state, false);
          else if (queue.current.length && cur) queue.current = queue.current.filter((q) => q.seq > (cur.seq?.[me] ?? 0));
          return;
        case "intents":
          applyIntents(m.list, m.from);
          return;
        case "intent":
          applyIntents([{ seq: Number.MAX_SAFE_INTEGER - 1, action: m.action }], m.from);
          return;
      }
    };

    (async () => {
      const t = await openTransport(code, onMsg, (ok) => !closed && setConnected(ok));
      if (closed) return t.close();
      tRef.current = t;
      connectedAt.current = Date.now();
      t.send({ t: "hello", from: me });
      t.send({ t: "hb", from: me, name: nameRef.current ?? "", nonce, since: loadedAt });
      // give the room a moment to answer before deciding we are alone
      window.setTimeout(() => {
        if (closed || sRef.current) return;
        if (cached && cached.caseId === c.id) adopt(cached, true);
        else if (creator) adopt(newShared(c, me, nameRef.current ?? "Host", false), true);
        else setStatus("waiting");
      }, 1500);
    })();

    const hb = window.setInterval(
      () => tRef.current?.send({ t: "hb", from: me, name: nameRef.current ?? "", v: sRef.current?.v, nonce, since: loadedAt }),
      HB_MS
    );
    const retry = window.setInterval(() => {
      if (!sRef.current) tRef.current?.send({ t: "hello", from: me });
      else flush();
    }, RETRY_MS);
    const bye = () => tRef.current?.send({ t: "bye", from: me });
    const vis = () => {
      // phones freeze background tabs; on return, catch up immediately
      if (document.visibilityState === "visible") {
        tRef.current?.send({ t: "hello", from: me });
        tRef.current?.send({ t: "hb", from: me, name: nameRef.current ?? "", v: sRef.current?.v, nonce, since: loadedAt });
      }
    };
    window.addEventListener("pagehide", bye);
    document.addEventListener("visibilitychange", vis);
    return () => {
      closed = true;
      window.clearInterval(hb);
      window.clearInterval(retry);
      window.removeEventListener("pagehide", bye);
      document.removeEventListener("visibilitychange", vis);
      bye();
      tRef.current?.close();
      tRef.current = null;
    };
  }, [adopt, applyIntents, c, code, flush, me, name, nonce, loadedAt, onlineIds, sendState]);

  /* liveness: once a second, check the host and take over if needed */
  useEffect(() => {
    const iv = window.setInterval(() => {
      setTick((x) => x + 1);
      const cur = sRef.current;
      if (!cur) return;
      const online = onlineIds();
      if (cur.hostId === me || online.includes(cur.hostId)) {
        hostLostAt.current = null;
        return;
      }
      hostLostAt.current ??= Date.now();
      const candidates = sortedPlayers(cur, online).filter((id) => id !== cur.hostId);
      if (candidates[0] !== me) return;
      // show the pause to everyone for a moment before taking over
      if (Date.now() - hostLostAt.current < TAKEOVER_MS) return;
      const paused = Date.now() - hostLostAt.current + AWAY_MS; // approx. time since the host was last heard
      const r = cur.unlocked;
      // move the old host's timestamps onto this device's clock, then add the pause
      const k = skewRef.current;
      const roundStartedAt = Object.fromEntries(Object.entries(cur.roundStartedAt).map(([n, t]) => [n, t - k])) as Record<number, number>;
      if (cur.phase === "play" && !cur.solved[r] && roundStartedAt[r]) roundStartedAt[r] += paused;
      skewRef.current = 0;
      hostLostAt.current = null;
      // anything I had queued as a player, I now apply myself
      const mine = queue.current;
      queue.current = [];
      // Jump the version well ahead: the old host may not know it dropped and can keep making changes
      // offline (e.g. narration playing on). Those must never outrank the new host when it reconnects.
      let next: Shared = { ...cur, v: cur.v + TAKEOVER_V_JUMP, hostId: me, roundStartedAt, startedAt: cur.startedAt ? cur.startedAt - k : cur.startedAt };
      for (const q of mine) next = reduce(c, next, q.action, me, { now: Date.now(), online });
      adopt(next, true);
    }, 1000);
    return () => window.clearInterval(iv);
  }, [adopt, c, me, onlineIds]);

  /* make sure we are on the roster */
  const askedJoin = useRef<string>("");
  useEffect(() => {
    if (!s || !name || !me) return;
    if (s.players[me]) {
      setStatus("ready");
      return;
    }
    if (s.kicked?.includes(me)) {
      setStatus("removed");
      return;
    }
    if (Object.keys(s.players).length >= MAX_PLAYERS && !Object.entries(s.players).some(([id, p]) => p.name.toLowerCase() === name.toLowerCase() && !onlineIds().includes(id))) {
      setStatus("full");
      return;
    }
    setStatus("joining");
    if (askedJoin.current !== me) {
      askedJoin.current = me;
      act({ t: "join", name });
    }
  }, [s, me, name, act, onlineIds]);

  if (!s || !me) return { game: null, status };
  const online = onlineIds();
  const hostAway = s.hostId !== me && !online.includes(s.hostId);
  return {
    status,
    game: {
      c,
      s,
      me,
      isHost: s.hostId === me,
      party: true,
      online,
      hostAway,
      pausedAt: hostAway ? hostLostAt.current ?? Date.now() : null,
      connected,
      skew: s.hostId === me ? 0 : skewRef.current,
      act,
      priv,
      setPriv,
      room: { code, transport: transportKind },
    },
  };
}
