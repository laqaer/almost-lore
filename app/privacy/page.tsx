import type { Metadata } from "next";
import { DocPage } from "@/components/doc-page";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "What Almost Lore collects (very little), why, and who processes it.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <DocPage kicker="The fine print" title="Privacy" updated={site.updated}>
      <p>
        Almost Lore ({site.domain}) is published by {site.publisher}. You can play every day without an
        account, and we would rather know less about you than more. This page lists everything we
        collect and every service that touches it.
      </p>

      <h2>On your device</h2>
      <p>
        Your streak, your stamps and your in-progress docket are saved in your browser&apos;s local
        storage so a refresh doesn&apos;t lose them. They never leave your device unless you share a
        result or a challenge link yourself. Clearing your browser data clears them.
      </p>

      <h2>What reaches our servers</h2>
      <ul>
        <li>
          <strong>Hosting logs.</strong> Our host (Vercel) records standard request data — IP address,
          browser, the page requested — to run the site and stop abuse.
        </li>
        <li>
          <strong>Anonymous game tallies</strong> (when enabled). When you finish a docket we may count,
          without any identifier, which cards were answered correctly, so we can show &ldquo;% of players
          who got this right&rdquo;.
        </li>
        <li>
          <strong>Analytics</strong> (when enabled). We may use Google Analytics 4 or Plausible to count
          visits and game events (started, finished, shared, subscribed). We don&apos;t send your email
          or name to analytics. Classroom/projector mode never loads analytics.
        </li>
      </ul>

      <h2>If you give us your email</h2>
      <p>
        Signing up for The Sunday Docket, a waitlist or a free sampler sends your email address to our
        newsletter provider, tagged with where you signed up. We use it to send what you asked for.
        Every email has an unsubscribe link. We never sell or rent the list.
      </p>

      <h2>If you buy something</h2>
      <p>
        Payments are handled by Stripe (or, for some products, the marketplace or checkout you bought
        through). We never see or store your card number. Stripe shares your email and order with us
        so we can deliver the download and help if something goes wrong.
      </p>

      <h2>If you report a correction</h2>
      <p>
        Corrections become public GitHub issues so the fix is visible. Don&apos;t include personal
        details you don&apos;t want public; we only ask for the correction, a source, and — if you
        want credit — a name to print.
      </p>

      <h2>Children and classrooms</h2>
      <p>
        The game has no accounts and no chat. Projector mode (<code>/class</code>) collects nothing
        and loads no analytics. We don&apos;t knowingly collect personal information from children
        under 13; newsletter signups are for adults.
      </p>

      <h2>Your choices</h2>
      <p>
        To see, correct or delete anything we hold about you (in practice: an email address or an
        order), write to <a href={`mailto:${site.email}`}>{site.email}</a>. If this page changes, the
        date above changes too.
      </p>
    </DocPage>
  );
}
