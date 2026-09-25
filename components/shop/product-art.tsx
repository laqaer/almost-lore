import { Glyph, Slab } from "@/components/icons";

/** Printed-matter mockups for the shop: pure CSS, so they stay sharp and on-palette. */

export function PartyStage() {
  return (
    <div className="stage party" aria-hidden="true">
      <div className="pcard c1">
        <span className="mono-s">Party Pack</span>
        <p>Happened, almost, or lore? Stamp it, flip it, argue about it.</p>
        <div className="foot mono-s">
          <span>Card front</span>
          <Glyph v="lore" />
        </div>
      </div>
      <div className="pcard c2">
        <span className="mono-s">The record</span>
        <p>Every card back carries the verdict and the story.</p>
        <div className="foot mono-s">
          <span>Card back</span>
          <Glyph v="happened" />
        </div>
      </div>
      <div className="pcard c3">
        <span className="mono-s">Stamp Off</span>
        <p>Everyone stamps at once. The record decides.</p>
        <div className="foot mono-s">
          <span>Rules</span>
          <Glyph v="almost" />
        </div>
        <div className="impression v-almost">Almost</div>
      </div>
      <div className="paddle">
        <div className="face">
          <Glyph v="lore" />
          Lore
        </div>
        <div className="stick" />
      </div>
    </div>
  );
}

export function ClassStage({ claim = "Stamp it before the bell: happened, almost, or lore?" }: { claim?: string }) {
  return (
    <div className="stage class" aria-hidden="true">
      <div className="screen">
        <span className="mono-s">
          <span>Bell-ringer</span>
          <span>Period 3</span>
        </span>
        <p>{claim}</p>
        <div className="opts">
          <Slab v="happened" />
          <Slab v="almost" />
          <Slab v="lore" />
        </div>
        <span className="timer">2:00</span>
      </div>
    </div>
  );
}

export function HalloweenStage() {
  return (
    <div className="stage party haunted" aria-hidden="true">
      <div className="pcard c1">
        <span className="mono-s">Haunted History</span>
        <p>Nobody was burned at Salem. Happened, almost, or lore?</p>
        <div className="foot mono-s">
          <span>Card front</span>
          <Glyph v="lore" />
        </div>
      </div>
      <div className="pcard c2">
        <span className="mono-s">Place card</span>
        <p>One claim at every seat. Argue between courses.</p>
        <div className="foot mono-s">
          <span>Seat 4</span>
          <Glyph v="almost" />
        </div>
      </div>
      <div className="pcard c3">
        <span className="mono-s">The record</span>
        <p>The truth is the scary part.</p>
        <div className="foot mono-s">
          <span>Card back</span>
          <Glyph v="happened" />
        </div>
        <div className="impression v-lore">Lore</div>
      </div>
    </div>
  );
}
