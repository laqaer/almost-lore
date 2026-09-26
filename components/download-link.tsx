"use client";

import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return () => {};
}

function sessionIdFromLocation(): string {
  const value = new URLSearchParams(window.location.search).get("session_id");
  return value ? value : "missing";
}

function emptySession(): string {
  return "pending";
}

export function DownloadLink() {
  const sessionId = useSyncExternalStore(subscribe, sessionIdFromLocation, emptySession);

  if (sessionId === "pending") {
    return <p>Preparing the download link.</p>;
  }

  if (sessionId === "missing" || !sessionId.startsWith("cs_")) {
    return (
      <p>
        No checkout session came back with this page. If you closed Stripe before paying, you
        were not charged.
      </p>
    );
  }

  const href = `/api/download?session_id=${encodeURIComponent(sessionId)}`;
  return (
    <p>
      <a href={href}>Download the working file</a>. The link checks the payment again before
      the file is sent. A refunded or unpaid session does not get the file.
    </p>
  );
}
