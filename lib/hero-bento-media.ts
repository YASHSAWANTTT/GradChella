import { heroPhotoSequence } from "@/lib/hero-photo-sequence";

export interface HeroBentoMediaItem {
  id: number;
  type: "image" | "video";
  url: string;
  /** Legacy field; desktop gallery uses a uniform square grid and ignores this. */
  span: string;
}

export const heroBentoMedia: HeroBentoMediaItem[] = heroPhotoSequence.map(
  (url, i) => ({
    id: i + 1,
    type: "image" as const,
    url,
    span: "",
  }),
);
