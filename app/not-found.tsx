import Link from "next/link";

export default function NotFound() {
  return (
    <div className="folio">
      <h1 className="folio-title">That page is not in the folio</h1>
      <p className="dek">The essay is missing. The hub still has the public-record stories.</p>
      <p className="mt-6 text-base">
        <Link className="text-teal underline underline-offset-3 hover:text-rust" href="/">
          Back to Almost Lore
        </Link>
      </p>
    </div>
  );
}
