import { heroPhotoSequence } from "@/lib/hero-photo-sequence";

export interface HeroBentoMediaItem {
  id: number;
  type: "image" | "video";
  url: string;
  span: string;
}

/** Bento spans from `sm` up; below that the gallery uses uniform tiles in the component. */
const SPANS = [
  "sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-3",
  "sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2",
  "sm:col-span-2 sm:row-span-2 md:col-span-1 md:row-span-3",
  "sm:col-span-1 sm:row-span-2 md:col-span-2 md:row-span-2",
  "sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-3",
] as const;

export const heroBentoMedia: HeroBentoMediaItem[] = heroPhotoSequence.map(
  (url, i) => ({
    id: i + 1,
    type: "image" as const,
    url,
    span: SPANS[i % SPANS.length]!,
  }),
);
