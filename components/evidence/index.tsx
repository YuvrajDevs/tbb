"use client";

import type { ReactElement } from "react";
import type { EvidenceFile } from "@/lib/types";
import * as R1 from "./round1";
import * as R2 from "./round2";
import * as R3 from "./round3";
import * as R4 from "./round4";

const registry: Record<string, (f: EvidenceFile) => ReactElement> = {
  "r1-memo": () => <R1.Memo />,
  "r1-inquest": () => <R1.Inquest />,
  "r1-scene": () => <R1.ScenePhoto />,
  "r1-plan": () => <R1.FloorPlan />,
  "r1-watch": () => <R1.WatchExport />,
  "r1-sunita": () => <R1.SunitaStatement />,
  "r1-deathnote": () => <R1.DeathNote />,
  "r2-meera": () => <R2.MeeraStatement />,
  "r2-arjun": () => <R2.ArjunStatement />,
  "r2-kapoor": () => <R2.KapoorStatement />,
  "r2-kabir": () => <R2.KabirStatement />,
  "r2-cctvlog": () => <R2.CctvLog />,
  "r2-cctvstill": () => <R2.CctvStill />,
  "r2-chat": () => <R2.ChatPrintout />,
  "r2-calls": () => <R2.CallLog />,
  "r3-pm": () => <R3.PostMortem />,
  "r3-tag": () => <R3.EvidenceTag />,
  "r3-pharmacy": () => <R3.DispensaryRegister />,
  "r3-receipt": () => <R3.BarReceipt />,
  "r3-voicemail": (f) => <R3.Voicemail transcript={f.transcript} />,
  "r3-diary": () => <R3.DiaryPage />,
  "r4-bank": () => <R4.BankStatement />,
  "r4-mehta": () => <R4.MehtaLetter />,
  "r4-llp": () => <R4.LlpMaster />,
  "r4-email": () => <R4.KabirEmail />,
  "r4-will": () => <R4.WillExtract />,
  "r4-meera2": () => <R4.MeeraSupplementary />,
};

export function Evidence({ file }: { file: EvidenceFile }) {
  const render = registry[file.id];
  return render ? render(file) : <div>Missing exhibit</div>;
}
