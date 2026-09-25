import type { Metadata } from "next";
import Link from "next/link";
import { Slab } from "@/components/icons";
import { pageMetadata } from "@/lib/metadata";
import { readingMinutes, stories, storyPath } from "@/lib/stories";

export const metadata: Metadata = pageMetadata({
  title: "Case Files — history's near-misses, told properly",
  description:
    "Longform on the near-misses, myths and true stories that sound made up: invented countries, poison legends, the subway that ran one block, the war over a Nile fort.",
  path: "/case-files",
});

export default function CaseFilesPage() {
  const list = [...stories].sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title));
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <hr className="rule-double" />
          <div className="page-kicker">
            <span className="mono-s">§ Longform, with footnotes</span>
          </div>
          <h1 className="wood page-title">
            Case{" "}
            <span className="mis" data-t="files">
              files
            </span>
          </h1>
          <p className="page-dek">
            Each file argues its own verdict — HAPPENED, ALMOST or LORE — from the public record, with the uncertainty left
            in. Where later writers turned a rumour into a round number, we say so.
          </p>
        </div>
      </header>
      <section className="wrap" style={{ paddingBottom: 96 }}>
        <ol className="index-list">
          {list.map((story, i) => (
            <li key={story.slug}>
              <Link className="index-row" href={storyPath(story.slug)}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="mono-s">
                    {story.yearLabel} · {readingMinutes(story)} min
                  </span>
                  <br />
                  <span className="t">{story.title}</span>
                  <p>{story.dek}</p>
                </span>
                <Slab v={story.verdict} />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
