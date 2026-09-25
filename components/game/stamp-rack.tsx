"use client";

import { Glyph } from "@/components/icons";
import { VERDICT_DEF, VERDICT_KEY, VERDICT_LABEL } from "@/lib/game/scoring";
import { VERDICTS, type Verdict } from "@/lib/game/types";

export function StampButtons({ onStamp, pressed }: { onStamp: (v: Verdict) => void; pressed?: Verdict | null }) {
  return (
    <div className="stamps" role="group" aria-label="Stamp this claim">
      {VERDICTS.map((v) => (
        <button
          key={v}
          type="button"
          className={`stamp v-${v}`}
          data-pressed={pressed === v || undefined}
          onClick={() => onStamp(v)}
          aria-keyshortcuts={`${VERDICT_KEY[v]} ${VERDICTS.indexOf(v) + 1}`}
        >
          <span className="s-top">
            <Glyph v={v} />
            <span className="s-key" aria-hidden="true">
              {VERDICT_KEY[v]}
            </span>
          </span>
          <span className="s-word">{VERDICT_LABEL[v]}</span>
          <span className="s-def">{VERDICT_DEF[v]}</span>
        </button>
      ))}
    </div>
  );
}

/** H/A/L or 1/2/3 to stamp; Enter or → to continue. Ignores typing in form fields. */
export function useStampKeys(opts: { enabled: boolean; onStamp: (v: Verdict) => void; onNext?: () => void; canNext?: boolean }) {
  return function handler(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
    const key = event.key.toLowerCase();
    const map: Record<string, Verdict> = { h: "happened", "1": "happened", a: "almost", "2": "almost", l: "lore", "3": "lore" };
    if (opts.enabled && map[key]) {
      event.preventDefault();
      opts.onStamp(map[key]);
    } else if (opts.canNext && opts.onNext && (key === "enter" || key === "arrowright")) {
      if (target && ["BUTTON", "A"].includes(target.tagName) && key === "enter") return;
      event.preventDefault();
      opts.onNext();
    }
  };
}
