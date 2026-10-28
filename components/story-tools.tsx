"use client";

import { useState } from "react";

export function StoryTools({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);

  async function copyLink() {
    setCopied(false);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setManualCopy(false);
    } catch {
      setManualCopy(true);
    }
  }

  return (
    <div className="story-tools">
      <button type="button" onClick={copyLink} className="share-button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 13 4-4M8 15l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 3 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" /></svg>Copy link</button>
      <span role="status" className="copy-status">{copied ? "Link copied" : ""}</span>
      {manualCopy ? <label className="manual-copy">Copy this story link<input readOnly value={url} onFocus={(event) => event.target.select()} /></label> : null}
    </div>
  );
}
