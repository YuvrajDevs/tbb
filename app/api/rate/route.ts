import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * POST /api/rate { caseId, stars 1-5, comment?, mode, players, verdict, minutes }
 * Stores a rating in Supabase (table `ratings`: insert-only for the public key, never readable by it).
 */
export async function POST(req: Request) {
  if (!URL || !KEY) return NextResponse.json({ error: "ratings are not set up" }, { status: 503 });
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const stars = Math.round(Number(b.stars));
  if (!(stars >= 1 && stars <= 5)) return NextResponse.json({ error: "stars must be 1 to 5" }, { status: 400 });
  const int = (v: unknown, lo: number, hi: number) => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) && n >= lo && n <= hi ? n : null;
  };
  const row = {
    case_id: String(b.caseId ?? "").slice(0, 10) || "unknown",
    stars,
    comment: typeof b.comment === "string" && b.comment.trim() ? b.comment.trim().slice(0, 1000) : null,
    mode: b.mode === "party" ? "party" : "solo",
    players: int(b.players, 1, 6),
    verdict: typeof b.verdict === "string" ? b.verdict.slice(0, 80) : null,
    minutes: int(b.minutes, 0, 10000),
  };
  const r = await fetch(`${URL}/rest/v1/ratings`, {
    method: "POST",
    headers: { apikey: KEY, "content-type": "application/json", prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!r.ok) return NextResponse.json({ error: "could not save" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
