"use client";

import type { Action, Shared } from "./state";

export type Msg =
  | { t: "hb"; from: string; name: string }
  | { t: "hello"; from: string }
  | { t: "bye"; from: string }
  | { t: "state"; from: string; state: Shared; at?: number }
  | { t: "intent"; from: string; action: Action };

export interface Transport {
  kind: "supabase" | "local";
  send(m: Msg): void;
  close(): void;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const transportKind: "supabase" | "local" = SUPABASE_URL && SUPABASE_KEY ? "supabase" : "local";

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
      close: () => {
        void sb.removeChannel(ch);
      },
    };
  }
  // Same-device fallback: tabs of one browser. Used when Supabase keys are not set.
  const bc = new BroadcastChannel(name);
  bc.onmessage = (e) => onMsg(e.data as Msg);
  onStatus(true);
  return { kind: "local", send: (m) => bc.postMessage(m), close: () => bc.close() };
}
