/**
 * Public URLs in `public/`, ordered: devu_indi → yash_indi → couple, then repeat for the next index.
 * Yash shots alternate when there are fewer than devu/couple rounds.
 */
const DEVU_INDI = [
  "/devu_indi.JPG",
  "/devu_indi1.png",
  "/devu_indi2.png",
  "/devu_indi3.png",
] as const;

const YASH_INDI = ["/yash_indi.JPG", "/yash_indi1.JPG"] as const;

const COUPLE = [
  "/couple1.JPG",
  "/couple2.JPG",
  "/couple3.JPG",
  "/couple4.JPG",
] as const;

function buildHeroPhotoSequence(): string[] {
  const rounds = Math.max(DEVU_INDI.length, COUPLE.length);
  const out: string[] = [];
  for (let i = 0; i < rounds; i++) {
    if (i < DEVU_INDI.length) out.push(DEVU_INDI[i]!);
    out.push(YASH_INDI[i % YASH_INDI.length]!);
    if (i < COUPLE.length) out.push(COUPLE[i]!);
  }
  return out;
}

export const heroPhotoSequence = buildHeroPhotoSequence();
