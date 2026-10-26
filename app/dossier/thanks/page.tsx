import type { Metadata } from "next";
import Link from "next/link";
import { DownloadLink } from "@/components/download-link";
import { openGraphImage, twitterWithImage } from "@/lib/metadata";

const title = "Working file download";
const description = "Download the Poyais working file after a verified Almost Lore checkout.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: "/dossier/thanks" },
  openGraph: {
    ...openGraphImage,
    title,
    description,
    url: "/dossier/thanks",
  },
  twitter: {
    ...twitterWithImage,
    title,
    description,
  },
};

export default function DossierThanksPage() {
  return (
    <article className="folio">
      <h1 className="folio-title">
        Your download
      </h1>
      <div className="prose-page mt-8">
        <DownloadLink />
        <p>
          If the file does not match the <Link href="/dossier">dossier page</Link>, or the
          download fails after you were charged, use the <Link href="/support">support form</Link>{" "}
          within 14 days and say refund. Include the email you typed at checkout.
        </p>
      </div>
    </article>
  );
}
