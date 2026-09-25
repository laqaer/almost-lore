"use client";

import { useState } from "react";

type Props = { claimId?: string; storySlug?: string };

/** Files a public correction report (a GitHub issue). Deliberately collects no email. */
export function CorrectionForm({ claimId, storySlug }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "invalid" | "closed" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/correction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimId,
          storySlug,
          message: form.get("message"),
          source: form.get("source"),
          credit: form.get("credit"),
          company: form.get("company"),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (json.ok) setState("ok");
      else if (json.error === "missing-fields") setState("invalid");
      else if (json.error === "unconfigured") setState("closed");
      else setState("error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <p className="form-done" role="status">
        Filed. The corrections desk checks every report against the sources, usually within a day. Upheld corrections are
        logged on this page.
      </p>
    );
  }

  return (
    <form className="correction-form" onSubmit={onSubmit}>
      <label>
        <span className="mono-s">What&apos;s wrong? (required)</span>
        <textarea name="message" required minLength={10} maxLength={2000} rows={5} />
      </label>
      <label>
        <span className="mono-s">A source that shows it (link or citation)</span>
        <input name="source" type="text" maxLength={500} />
      </label>
      <label>
        <span className="mono-s">Credit me as (optional, shown if upheld)</span>
        <input name="credit" type="text" maxLength={60} autoComplete="off" />
      </label>
      <input className="hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p className="fine">Reports are filed publicly. Don&apos;t include your email or anything private.</p>
      <button className="btn" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Filing…" : "File the report"}
      </button>
      <p className="signup-note" role="status" aria-live="polite">
        {state === "invalid" && "Tell us what's wrong in at least a sentence."}
        {state === "closed" && "The online form isn't connected yet. Email the address below instead."}
        {state === "error" && "The mail room jammed. Try again in a minute."}
      </p>
    </form>
  );
}
