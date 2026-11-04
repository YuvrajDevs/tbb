"use client";

import type { Action, Shared } from "./state";

export type Msg =
  | { t: "hb"; from: string; name: string; v?: number; nonce?: string; since?: number }
  | { t: "hello"; from: string }
  | { t: "bye"; from: string }
  | { t: "state"; from: string; state: Shared; at?: number }
  | { t: "intents"; from: string; list: { seq: number; action: Action }[] }
  | { t: "intent"; from: string; action: Action };

export interface Transport {
  kind: TransportKind;
  send(m: Msg): void;
  close(): void;
}

export type TransportKind = "supabase" | "relay" | "local";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RELAY = process.env.NEXT_PUBLIC_ROOM_RELAY;

export const transportKind: TransportKind = SUPABASE_URL && SUPABASE_KEY ? "supabase" : RELAY ? "relay" : "local";

export async function openTransport(code: string, onMsg: (m: Msg) => void, onStatus: (ok: boolean) => void): Promise<Transport> {
  const name = `bb-room-${code}`;

  if (transportKind === "supabase") {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(SUPABASE_URL!, SUPABASE_KEY!, { realtime: { params: { eventsPerSecond: 20 } } });
    const ch = sb.channel(name, { config: { broadcast: { self: false, ack: false } } });
    ch.on("broadcast", { event: "m" }, ({ payload }) => onMsg(payload as Msg));
    await new Promise<void>((resolve) => {
      let done = false;
      ch.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          onStatus(true);
          if (!done) {
            done = true;
            resolve();
          }
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          onStatus(false);
        }
      });
    });
    return {
      kind: "supabase",
      send: (m) => void ch.send({ type: "broadcast", event: "m", payload: m }),
      close: () => void sb.removeChannel(ch),
    };
  }

  if (transportKind === "relay") {
    // Self-hosted relay (scripts/relay.mjs): server-sent events down, POST up. Used for tests and LAN play.
    const base = RELAY!.replace(/\/$/, "");
    const es = new EventSource(`${base}/sub/${encodeURIComponent(name)}`);
    es.onmessage = (e) => {
      try {
        onMsg(JSON.parse(e.data) as Msg);
      } catch {}
    };
    es.onerror = () => onStatus(false);
    await new Promise<void>((resolve) => {
      es.onopen = () => {
        onStatus(true);
        resolve();
      };
    });
    return {
      kind: "relay",
      send: (m) =>
        void fetch(`${base}/pub/${encodeURIComponent(name)}`, { method: "POST", body: JSON.stringify(m), keepalive: true }).catch(() => {}),
      close: () => es.close(),
    };
  }

  // Same-device fallback: tabs of one browser.
  const bc = new BroadcastChannel(name);
  bc.onmessage = (e) => onMsg(e.data as Msg);
  onStatus(true);
  return { kind: "local", send: (m) => bc.postMessage(m), close: () => bc.close() };
}
