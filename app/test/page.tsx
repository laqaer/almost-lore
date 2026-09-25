import { QuizRunner } from "@/components/game/quiz-runner";
import { getSet, publicClaim } from "@/lib/game/content";
import { pageMetadata } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "The Gullibility Test — which history myths fool you?",
  description:
    "Fifteen history claims. Some happened, some almost did, some are stories everybody repeats. Stamp each one and find out which kind fools you.",
  path: "/test",
});

export default function TestPage() {
  const claims = getSet("gullibility").map(publicClaim);
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <hr className="rule-double" />
          <div className="page-kicker">
            <span className="mono-s">
              {claims.length} claims · about four minutes · no sign-up
            </span>
          </div>
          <h1 className="wood page-title">
            The <span className="mis" data-t="Gullibility">Gullibility</span> Test
          </h1>
          <p className="page-dek">
            Some of these happened. Some almost did. Some are stories everybody repeats. Stamp each one and we&apos;ll tell you
            which kind gets past you.
          </p>
        </div>
      </header>
      <QuizRunner claims={claims} kind="gullibility" title="The Gullibility Test" shareUrl={`${siteUrl()}/test`} />
    </>
  );
}
