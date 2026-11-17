import { AdSlot as AdSlotClient } from "@/components/ads";

interface AdSlotProps {
  slot?: string;
  format?: "auto" | "fluid" | "horizontal" | "rectangle";
  minHeight?: number;
  label?: boolean;
  className?: string;
}

/**
 * Server-side gate in front of the client ad slot.
 *
 * Until NEXT_PUBLIC_ADSENSE_CLIENT is set this renders nothing and — crucially
 * — never creates a client reference, so the ads chunk is not requested by the
 * browser at all. The client component alone would still have shipped its JS
 * just to return null on mount.
 *
 * Once a client ID exists, the real slot takes over and consent still gates
 * whether any ad actually loads.
 */
export function AdSlot(props: AdSlotProps) {
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT) return null;
  return <AdSlotClient {...props} />;
}
