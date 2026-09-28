import { AdUnit } from "@/components/ad-unit";
import { adsRunnableConfig } from "@/lib/ads";

type AdSlotProps = {
  /** Override the default unit slot id. */
  slot?: string;
  className?: string;
};

/**
 * Placement wrapper. Server component: reads config at build time and passes it
 * to the client unit by prop. Returns null, and so renders no label, no reserved
 * space, and no ad request, unless a consent platform is installed.
 */
export function AdSlot({ slot, className }: AdSlotProps) {
  const config = adsRunnableConfig();
  if (!config) return null;

  return (
    <aside className={className} aria-label="Advertisement">
      <p className="kicker">Advertisement</p>
      <div className="mt-2 min-h-[250px] bg-paper-deep">
        <AdUnit client={config.client} slot={slot ?? config.slot} />
      </div>
    </aside>
  );
}
