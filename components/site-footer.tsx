import Link from "next/link";
import { editorialNote, fundingNote, site } from "@/lib/site";
import { stories, storyPath } from "@/lib/stories";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-rule bg-paper-deep/60">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-ink">{site.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">{site.description}</p>
          </div>
          <div>
            <h2 className="font-serif text-lg text-ink">Stories</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {stories.map((story) => (
                <li key={story.slug}>
                  <Link className="text-moss hover:text-rust" href={storyPath(story.slug)}>
                    {story.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-lg text-ink">Site</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-moss hover:text-rust" href="/about">
                  About &amp; standards
                </Link>
              </li>
              <li>
                <Link className="text-moss hover:text-rust" href="/now">
                  Now
                </Link>
              </li>
              <li>
                <Link className="text-moss hover:text-rust" href="/friends">
                  Friends
                </Link>
              </li>
              <li>
                <Link className="text-moss hover:text-rust" href="/privacy">
                  Privacy
                </Link>
              </li>
              <li>
                <a className="text-moss hover:text-rust" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 space-y-3 border-t border-rule pt-6 text-sm leading-6 text-ink-soft">
          <p>
            <strong className="text-ink">How this is funded. </strong>
            {fundingNote}
          </p>
          <p>
            <strong className="text-ink">How the stories are written. </strong>
            {editorialNote}
          </p>
          <p>© {new Date().getFullYear()} {site.publisher}.</p>
        </div>
      </div>
    </footer>
  );
}
