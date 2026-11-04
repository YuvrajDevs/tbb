// Minimal room relay: server-sent events down, POST up. No dependencies.
// Used by the end-to-end tests to run every player on a separate "device" over a bad network,
// and usable for LAN play. Point the app at it with NEXT_PUBLIC_ROOM_RELAY=http://host:8787
//
//   PORT=8787 RELAY_LATENCY=120 RELAY_JITTER=120 RELAY_DROP=0.05 node scripts/relay.mjs
//
// POST /config {"latency":..,"jitter":..,"drop":..} changes the network at runtime.
import http from "node:http";

const cfg = {
  latency: Number(process.env.RELAY_LATENCY ?? 0),
  jitter: Number(process.env.RELAY_JITTER ?? 0),
  drop: Number(process.env.RELAY_DROP ?? 0),
};
const subs = new Map(); // channel -> Set<res>
let delivered = 0;
let dropped = 0;

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "GET,POST,OPTIONS" };

http
  .createServer((req, res) => {
    const [, kind, ch] = decodeURI(req.url ?? "").split("/");
    if (req.method === "OPTIONS") return res.writeHead(204, cors).end();
    if (req.method === "GET" && kind === "sub" && ch) {
      res.writeHead(200, { ...cors, "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
      res.write(": hi\n\n");
      if (!subs.has(ch)) subs.set(ch, new Set());
      subs.get(ch).add(res);
      const ping = setInterval(() => res.write(": ping\n\n"), 15000);
      req.on("close", () => {
        clearInterval(ping);
        subs.get(ch)?.delete(res);
      });
      return;
    }
    if (req.method === "POST" && (kind === "pub" || kind === "config")) {
      let body = "";
      req.on("data", (d) => (body += d));
      req.on("end", () => {
        res.writeHead(204, cors).end();
        if (kind === "config") return Object.assign(cfg, JSON.parse(body || "{}"));
        for (const r of subs.get(ch) ?? []) {
          // each recipient gets its own delay and its own chance of loss, like a real network
          if (Math.random() < cfg.drop) {
            dropped++;
            continue;
          }
          const wait = cfg.latency + Math.random() * cfg.jitter;
          setTimeout(() => {
            delivered++;
            r.write(`data: ${body}\n\n`);
          }, wait);
        }
      });
      return;
    }
    if (kind === "stats") return res.writeHead(200, { ...cors, "Content-Type": "application/json" }).end(JSON.stringify({ ...cfg, delivered, dropped }));
    res.writeHead(404, cors).end();
  })
  .listen(Number(process.env.PORT ?? 8787), () => console.log(`relay on :${process.env.PORT ?? 8787}`, cfg));
