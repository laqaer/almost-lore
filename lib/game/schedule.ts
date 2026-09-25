/**
 * Docket calendar. Docket n goes live at local midnight on EPOCH + (n - 1) days,
 * like other daily games. The server only serves a docket once it is open somewhere
 * on Earth (UTC+14), and only publishes answers once it has closed everywhere (UTC-12).
 */

export const EPOCH = "2026-09-25";

const DAY_MS = 86_400_000;

function utcMidnight(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** yyyy-mm-dd for a Date in the viewer's local timezone. */
export function localIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** yyyy-mm-dd for an instant at a fixed UTC offset in hours. */
export function isoDateAtOffset(instant: number, offsetHours: number): string {
  return new Date(instant + offsetHours * 3_600_000).toISOString().slice(0, 10);
}

export function docketNumberFor(isoDate: string): number {
  return Math.round((utcMidnight(isoDate) - utcMidnight(EPOCH)) / DAY_MS) + 1;
}

export function docketDate(n: number): string {
  return new Date(utcMidnight(EPOCH) + (n - 1) * DAY_MS).toISOString().slice(0, 10);
}

/** Highest docket number that is open anywhere (earliest timezone, UTC+14). */
export function latestOpenDocket(now: number = Date.now()): number {
  return Math.max(1, docketNumberFor(isoDateAtOffset(now, 14)));
}

/** Highest docket number that has closed everywhere (latest timezone, UTC-12). 0 if none. */
export function latestClosedDocket(now: number = Date.now()): number {
  return Math.max(0, docketNumberFor(isoDateAtOffset(now, -12)) - 1);
}

/** The docket a viewer should play today, based on their local calendar date. */
export function todaysDocketNumber(now: Date = new Date()): number {
  return Math.max(1, docketNumberFor(localIsoDate(now)));
}

/** Milliseconds until the viewer's next local midnight. */
export function msUntilLocalMidnight(now: Date = new Date()): number {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

export function formatDocketDate(n: number): string {
  const iso = docketDate(n);
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
