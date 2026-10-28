"use client";

import { useState } from "react";
import { collections } from "@/lib/stories/collections";
import { StoryCard, type StoryPreview } from "@/components/story-card";

export function StoryArchive({ stories }: { stories: StoryPreview[] }) {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("All stories");
  const filtered = stories.filter((story) =>
    (collection === "All stories" || story.collection === collection) &&
    `${story.title} ${story.dek} ${story.yearLabel} ${story.collection}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section id="stories" className="story-archive" aria-label="Story archive">
      <div className="section-heading">
        <div><p className="kicker">Follow your curiosity</p><h2>The story collection<span className="heading-dot">.</span></h2></div>
        <p>Extraordinary events.<br /> The records to back them up.</p>
      </div>
      <div className="archive-controls">
        <div className="filter-tabs" aria-label="Filter stories">
          {["All stories", ...collections].map((label) => (
            <button key={label} type="button" aria-pressed={collection === label} onClick={() => setCollection(label)}>{label}</button>
          ))}
        </div>
        <label className="archive-search"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><span className="sr-only">Search stories</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find something curious…" /></label>
      </div>
      <p className="results-count" role="status">{filtered.length} {filtered.length === 1 ? "story" : "stories"}{collection !== "All stories" ? ` in ${collection.toLowerCase()}` : " to get lost in"}</p>
      {filtered.length ? <div className="archive-grid">{filtered.map((story) => <StoryCard key={story.slug} story={story} />)}</div> : (
        <div className="archive-empty"><h3>No stories found. Yet.</h3><p>Try a place, a year, or a different collection.</p><button type="button" className="text-link" onClick={() => { setQuery(""); setCollection("All stories"); }}>Reset filters <span aria-hidden="true">↗</span></button></div>
      )}
    </section>
  );
}
