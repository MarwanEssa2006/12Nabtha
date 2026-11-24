import React from 'react';
import { imgSrc, imgSrcSet } from '@/lib/images';
import type { ImageSpec } from '@/types/nabta';

interface ResponsiveImageProps {
  image: ImageSpec;
  alt: string;
  sizes: string;
  eager?: boolean;
  defaultWidth?: number;
  className?: string;
  id?: string;
}

export function ResponsiveImage({
  image,
  alt,
  sizes,
  eager = false,
  defaultWidth,
  className,
  id,
}: ResponsiveImageProps) {
  return (
    <img
      id={id}
      src={imgSrc(image, defaultWidth)}
      srcSet={imgSrcSet(image)}
      sizes={sizes}
      alt={alt}
      loading={eager ? undefined : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      className={className}
    />
  );
}
