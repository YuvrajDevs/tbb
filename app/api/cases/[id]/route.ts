import { NextResponse } from "next/server";
import { ask, check, hint, interviewIntro, skip, verdict, type Vote } from "@/lib/server/judge";

export const dynamic = "force-dynamic";

/**
 * POST /api/cases/<id>
 *   { op: "check", round, choice }     -> CheckResult
 *   { op: "skip", round }              -> CheckResult (answer shown)
 *   { op: "hint", round, level }       -> HintResult
 *   { op: "verdict", vote, tokens }    -> CaseResult, only with a token for every round
 *   { op: "ask", who, topic, tokens }  -> { text, known }: an interview answer ("p:<person>" or "e:<exhibit>")
 *   { op: "intro", who }               -> { text }: how an interview opens
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const round = Number(body.round);
  const str = (v: unknown) => (typeof v === "string" ? v.slice(0, 40) : "");
  let out: unknown = null;
  switch (body.op) {
    case "check":
      out = check(id, round, str(body.choice));
      break;
    case "skip":
      out = skip(id, round);
      break;
    case "hint":
      out = hint(id, round, Number(body.level));
      break;
    case "ask": {
      const r = ask(id, str(body.who), str(body.topic), (body.tokens ?? {}) as Record<string, unknown>);
      if (r === "locked") return NextResponse.json({ error: "that folder is still sealed" }, { status: 403 });
      out = r;
      break;
    }
    case "intro": {
      out = interviewIntro(id, str(body.who));
      break;
    }
    case "verdict": {
      const v = (body.vote ?? {}) as Record<string, unknown>;
      const d = (v.details && typeof v.details === "object" ? v.details : {}) as Record<string, unknown>;
      const details = Object.fromEntries(Object.entries(d).slice(0, 20).map(([k, x]) => [String(k).slice(0, 40), str(x)]));
      const vote: Vote = { suspect: str(v.suspect), method: str(v.method), motive: str(v.motive), details };
      const r = verdict(id, vote, (body.tokens ?? {}) as Record<string, unknown>);
      if (r === "locked") return NextResponse.json({ error: "answer every checkpoint first" }, { status: 403 });
      out = r;
      break;
    }
  }
  if (!out) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(out, { headers: { "cache-control": "no-store" } });
}
