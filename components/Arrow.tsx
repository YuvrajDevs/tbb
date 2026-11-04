/** Drawn arrows for buttons and links: centred on the text and a little heavier than a typed "←". */
const path = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const ArrowLeft = (
  <svg className="arrow" width="15" height="15" viewBox="0 0 16 16" aria-hidden>
    <path d="M13 8H3.5M7.5 3.5 3 8l4.5 4.5" {...path} />
  </svg>
);

export const ArrowRight = (
  <svg className="arrow" width="15" height="15" viewBox="0 0 16 16" aria-hidden>
    <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" {...path} />
  </svg>
);
