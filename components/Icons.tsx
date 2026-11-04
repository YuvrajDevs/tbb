import type { FileType } from "@/lib/types";

export type FolderState = "closed" | "open" | "locked" | "new";

export function FolderIcon({ state, size = 96, label }: { state: FolderState; size?: number; label?: string }) {
  const w = size;
  const h = size * 0.78;
  const fill = "#c9a66b";
  const back = "#b38f55";
  const stroke = "#6b4a2b";
  const dim = state === "locked";
  return (
    <svg width={w} height={h} viewBox="0 0 100 78" aria-hidden style={{ opacity: dim ? 0.55 : 1, overflow: "visible" }}>
      {/* back panel with tab */}
      <path d="M2 10 Q2 6 6 6 H34 Q37 6 39 9 L42 13 H94 Q98 13 98 17 V72 Q98 76 94 76 H6 Q2 76 2 72 Z" fill={back} stroke={stroke} strokeWidth="1.2" />
      {label && (
        <text x="8" y="12.2" fontSize="5" fontFamily="Courier Prime, monospace" fill="#3e2a18" letterSpacing=".5">
          {label}
        </text>
      )}
      {state === "open" ? (
        <>
          {/* papers */}
          <rect x="10" y="15" width="74" height="50" fill="#f1e9d8" stroke="#7a6a55" strokeWidth=".8" transform="rotate(-3 47 40)" />
          <rect x="14" y="13" width="72" height="50" fill="#e8dcc3" stroke="#7a6a55" strokeWidth=".8" transform="rotate(2 50 38)" />
          <line x1="22" y1="24" x2="70" y2="25.5" stroke="#7a6a55" strokeWidth=".7" />
          <line x1="22" y1="29" x2="64" y2="30.3" stroke="#7a6a55" strokeWidth=".7" />
          <line x1="22" y1="34" x2="68" y2="35.3" stroke="#7a6a55" strokeWidth=".7" />
          {/* tilted front flap */}
          <path d="M8 34 H100 Q102 34 101 37 L95 73 Q94 76 90 76 H6 Q2 76 2.5 72 L5 37 Q5.5 34 8 34 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
        </>
      ) : (
        <path d="M2 22 Q2 19 5 19 H95 Q98 19 98 22 V72 Q98 76 94 76 H6 Q2 76 2 72 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
      )}
      {state === "locked" && (
        <g transform="translate(74 50)">
          <rect x="0" y="9" width="20" height="16" rx="2" fill="#1b1611" stroke="#ece3d0" strokeWidth="1.2" />
          <path d="M4 9 V5 Q4 0 10 0 Q16 0 16 5 V9" fill="none" stroke="#ece3d0" strokeWidth="2" />
          <circle cx="10" cy="16" r="2" fill="#ece3d0" />
        </g>
      )}
      {state === "new" && (
        <g transform="translate(66 22)">
          <rect x="0" y="0" width="28" height="11" fill="#f1e9d8" stroke="#6e2f1c" strokeWidth="1" />
          <text x="14" y="8.4" fontSize="7.4" textAnchor="middle" fontFamily="Courier Prime, monospace" fontWeight="700" fill="#6e2f1c" letterSpacing=".8">
            NEW
          </text>
        </g>
      )}
    </svg>
  );
}

export function FileIcon({ type, size = 28 }: { type: FileType; size?: number }) {
  const mark = (() => {
    switch (type) {
      case "photo":
        return <path d="M7 25 L12 18 L15 21.5 L18.5 16 L23 25 Z" fill="#4a3d2f" />;
      case "audio":
        return <path d="M6 21 Q8.5 15 11 21 T16 21 T21 21 T26 21" fill="none" stroke="#4a3d2f" strokeWidth="1.6" />;
      case "record":
        return (
          <g stroke="#4a3d2f" strokeWidth="1.1" fill="none">
            <rect x="7" y="13" width="16" height="13" />
            <line x1="7" y1="17.3" x2="23" y2="17.3" />
            <line x1="7" y1="21.6" x2="23" y2="21.6" />
            <line x1="12.3" y1="13" x2="12.3" y2="26" />
          </g>
        );
      case "map":
        return (
          <g stroke="#4a3d2f" strokeWidth="1.1" fill="none">
            <path d="M7 14 L12 12.5 L18 14.5 L23 13 V25 L18 26.5 L12 24.5 L7 26 Z" />
            <line x1="12" y1="12.5" x2="12" y2="24.5" />
            <line x1="18" y1="14.5" x2="18" y2="26.5" />
          </g>
        );
      case "chat":
        return (
          <g fill="none" stroke="#4a3d2f" strokeWidth="1.1">
            <rect x="7" y="13" width="11" height="6" rx="1.5" />
            <rect x="12" y="20.5" width="11" height="6" rx="1.5" />
          </g>
        );
      case "statement":
        return (
          <g stroke="#4a3d2f" strokeWidth="1.1">
            <line x1="8" y1="14" x2="22" y2="14" />
            <line x1="8" y1="18" x2="22" y2="18" />
            <line x1="8" y1="22" x2="16" y2="22" />
            <path d="M16 26 Q18 23 20 25 T24 24" fill="none" />
          </g>
        );
      default:
        return (
          <g stroke="#4a3d2f" strokeWidth="1.1">
            <line x1="8" y1="14" x2="22" y2="14" />
            <line x1="8" y1="18" x2="22" y2="18" />
            <line x1="8" y1="22" x2="22" y2="22" />
            <line x1="8" y1="26" x2="17" y2="26" />
          </g>
        );
    }
  })();
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 30 34" aria-hidden>
      <path d="M3 2 H20 L27 9 V32 H3 Z" fill="#f1e9d8" stroke="#6b4a2b" strokeWidth="1.2" />
      <path d="M20 2 V9 H27" fill="#dccdae" stroke="#6b4a2b" strokeWidth="1.2" />
      {mark}
    </svg>
  );
}

export const Glyph = {
  play: <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1.5 L12 7 L3 12.5Z" fill="currentColor" /></svg>,
  pause: <svg width="14" height="14" viewBox="0 0 14 14"><rect x="3" y="2" width="3" height="10" fill="currentColor" /><rect x="8" y="2" width="3" height="10" fill="currentColor" /></svg>,
  prev: <svg width="14" height="14" viewBox="0 0 14 14"><path d="M10 2 L4 7 L10 12" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>,
  next: <svg width="14" height="14" viewBox="0 0 14 14"><path d="M4 2 L10 7 L4 12" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>,
  replay: <svg width="15" height="15" viewBox="0 0 16 16"><path d="M3 8 A5 5 0 1 0 5 4" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M2.5 1.5 V5 H6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>,
  voiceOn: <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 6 H5 L9 2.5 V13.5 L5 10 H2Z" fill="currentColor" /><path d="M11 5 Q13 8 11 11 M12.5 3.5 Q15.5 8 12.5 12.5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>,
  voiceOff: <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 6 H5 L9 2.5 V13.5 L5 10 H2Z" fill="currentColor" /><path d="M11 6 L15 10 M15 6 L11 10" stroke="currentColor" strokeWidth="1.3" /></svg>,
  star: (on: boolean) => <svg width="15" height="15" viewBox="0 0 16 16"><path d="M8 1.5 L9.9 5.8 L14.5 6.2 L11 9.2 L12 13.8 L8 11.4 L4 13.8 L5 9.2 L1.5 6.2 L6.1 5.8Z" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" /></svg>,
  list: <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 4 H14 M2 8 H14 M2 12 H14" stroke="currentColor" strokeWidth="1.4" /></svg>,
  grid: <svg width="16" height="16" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="2" width="5" height="5" /><rect x="9" y="2" width="5" height="5" /><rect x="2" y="9" width="5" height="5" /><rect x="9" y="9" width="5" height="5" /></g></svg>,
  close: <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" strokeWidth="1.6" /></svg>,
  back: <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2 L4 7 L9 12" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>,
  zoomIn: <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 10.5 L14 14 M5 7 H9 M7 5 V9" stroke="currentColor" strokeWidth="1.4" /></svg>,
  zoomOut: <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 10.5 L14 14 M5 7 H9" stroke="currentColor" strokeWidth="1.4" /></svg>,
};
