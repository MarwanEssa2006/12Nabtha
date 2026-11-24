'use client';

import React from 'react';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { useLanguage } from '@/context/LanguageContext';
import { NABTA_DATA } from '@/lib/data';

export function GallerySection() {
  const { t, L } = useLanguage();

  return (
    <section className="band clear" id="gallery" aria-labelledby="gTitle">
      <div className="wrap">
        <div className="head head-light reveal">
          <h2 id="gTitle">{t('gallery.title')}</h2>
          <p>{t('gallery.text')}</p>
        </div>
        <div className="mosaic" id="mosaic">
          {NABTA_DATA.gallery.map((g, idx) => (
            <figure
              key={`${g.photo.base}-${idx}`}
              className={`shot${g.wide ? ' wide' : ''} reveal`}
              tabIndex={0}
            >
              <ResponsiveImage
                image={g.photo}
                alt={L(g.alt)}
                sizes={g.wide ? '(max-width: 600px) 92vw, 620px' : '(max-width: 600px) 46vw, 300px'}
              />
              <figcaption>{L(g.alt)}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
