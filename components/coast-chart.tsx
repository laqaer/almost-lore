/**
 * Decorative chart plate for the home hero. No place names: the coast and
 * route are an unlabeled engraving, not a map of a real shore.
 */
export function CoastChart() {
  return (
    <div className="coast-chart mb-6" aria-hidden="true">
      <svg focusable="false" height={168} viewBox="0 0 480 168" width={480}>
        <rect className="chart-frame" height={167} width={479} x={0.5} y={0.5} />
        <path
          className="chart-land"
          d="M0 168 L0 94 C26 86 44 108 78 104 C112 100 124 72 156 66 C188 60 204 86 236 92 C268 98 280 70 310 62 C340 54 356 46 388 50 C420 54 448 68 480 64 L480 168 Z"
        />
        <g className="chart-graticule">
          <path d="M80 8 V160 M160 8 V160 M240 8 V160 M320 8 V160 M400 8 V160" />
          <path d="M8 42 H472 M8 84 H472 M8 126 H472" />
        </g>
        <path
          className="chart-draw chart-shoal"
          d="M0 72 C30 64 52 84 86 78 C120 72 136 50 168 46 C200 42 220 64 252 68 C284 72 300 50 332 44 C364 38 392 34 424 40 C452 46 468 52 480 48"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
        <path
          className="chart-draw chart-coast"
          d="M0 94 C26 86 44 108 78 104 C112 100 124 72 156 66 C188 60 204 86 236 92 C268 98 280 70 310 62 C340 54 356 46 388 50 C420 54 448 68 480 64"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
        <path
          className="chart-draw chart-creek"
          d="M118 152 C138 138 152 142 170 128 C188 114 198 120 216 108"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
        <path
          className="chart-draw chart-draw-isle chart-isle"
          d="M188 36 C188 30 206 30 208 36 C206 42 190 42 188 36 Z"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
        <path
          className="chart-draw chart-draw-isle chart-isle"
          d="M348 34 C348 27 370 27 372 35 C368 43 350 42 348 34 Z"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
        <path
          className="chart-draw chart-draw-route chart-route"
          d="M16 24 C58 32 88 16 130 22 C172 28 196 14 238 20 C280 26 308 14 348 20 C388 26 414 16 458 18"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
        <circle className="chart-mark" cx={16} cy={24} r={2.2} />
        <circle className="chart-mark" cx={458} cy={18} r={2.2} />
        <g className="chart-compass" transform="translate(432 128)">
          <circle r={13} />
          <path d="M0 -13 V13 M-13 0 H13" />
          <path d="M0 -13 L3.1 -4.6 L0 -6.4 L-3.1 -4.6 Z" fill="currentColor" stroke="none" />
          <circle className="chart-mark" r={1.7} stroke="none" />
        </g>
        <path className="chart-scale" d="M24 150 H72 M24 147 V153 M48 147 V153 M72 147 V153" />
        <rect className="chart-border" height={167} width={479} x={0.5} y={0.5} />
      </svg>
    </div>
  );
}
