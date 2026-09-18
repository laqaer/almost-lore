import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-rust">404</p>
      <h1 className="mt-3 font-display text-4xl text-ink">That page is not in the folio</h1>
      <p className="mt-4 text-ink-soft">
        The essay is missing. The hub still has the public-record stories.
      </p>
      <p className="mt-6">
        <Link className="text-moss underline underline-offset-3 hover:text-rust" href="/">
          Back to Almost Lore
        </Link>
      </p>
    </div>
  );
}
