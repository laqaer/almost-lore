"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import type { SignupSource } from "@/lib/newsletter";

type Props = {
  source: SignupSource;
  tags?: string[];
  cta?: string;
  placeholder?: string;
  done?: string;
  className?: string;
  /** Accessible label for the email field. */
  label?: string;
};

/** Email capture that posts to /api/subscribe; works as a plain form without JS too. */
export function NewsletterForm({
  source,
  tags = [],
  cta = "Subscribe",
  placeholder = "you@example.com",
  done = "You're on the list. First letter lands Sunday.",
  className = "",
  label = "Email address",
}: Props) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error" | "invalid" | "closed">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          company: form.get("company"),
          source,
          tags,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (json.ok) {
        setState("ok");
        track(tags.some((t) => t.startsWith("waitlist")) ? "waitlist_join" : "subscribe", { source });
      } else if (json.error === "invalid-email") setState("invalid");
      else if (json.error === "unconfigured") setState("closed");
      else setState("error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <p className={`form-done ${className}`} role="status">
        {done}
      </p>
    );
  }

  return (
    <form className={`signup ${className}`} action="/api/subscribe" method="post" onSubmit={onSubmit}>
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="tags" value={tags.join(",")} />
      <label className="sr-only" htmlFor={`email-${source}`}>
        {label}
      </label>
      <input
        id={`email-${source}`}
        className="signup-input"
        type="email"
        name="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder={placeholder}
      />
      <input className="hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="signup-button" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Filing…" : cta}
      </button>
      <p className="signup-note" role="status" aria-live="polite">
        {state === "invalid" && "That address doesn't look right."}
        {state === "error" && "The mail room jammed. Try again in a minute."}
        {state === "closed" && "Sign-ups open in a few days — check back soon."}
      </p>
    </form>
  );
}
