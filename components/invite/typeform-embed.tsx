"use client";

import Script from "next/script";
import { inviteConfig } from "@/lib/invite-config";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Loads Typeform’s embed script once and renders the live form mount point. */
export function TypeformEmbed({ className }: Props) {
  const id = inviteConfig.typeformLiveId;

  return (
    <>
      <div
        data-tf-live={id}
        className={cn("w-full min-h-[520px] rounded-xl bg-[#FFFBF0]/40", className)}
      />
      <Script
        src="https://embed.typeform.com/next/embed.js"
        strategy="lazyOnload"
      />
    </>
  );
}
