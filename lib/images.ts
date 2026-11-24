import type { ImageSpec } from '@/types/nabta';

const IMG_PATH = '/assets/img/';

export function imgSrc(im: ImageSpec, width?: number): string {
  const chosenWidth = width ?? im.widths[1] ?? im.widths[0];
  return `${IMG_PATH}${im.base}-${chosenWidth}.webp`;
}

export function imgSrcSet(im: ImageSpec): string {
  return im.widths.map((w) => `${IMG_PATH}${im.base}-${w}.webp ${w}w`).join(', ');
}
