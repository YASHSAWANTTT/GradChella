"use client";

import { inviteConfig } from "@/lib/invite-config";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Embedded Google Form (`viewform?embedded=true`). */
export function GoogleFormEmbed({ className }: Props) {
  return (
    <iframe
      src={inviteConfig.rsvpEmbedUrl}
      title="RSVP — graduation celebration"
      className={cn(
        "h-[min(90vh,1400px)] w-full rounded-xl border-0 bg-white/80",
        className,
      )}
      loading="lazy"
    />
  );
}
