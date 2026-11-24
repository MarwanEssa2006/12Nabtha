'use client';

import React, { useRef } from 'react';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { useLanguage } from '@/context/LanguageContext';
import { NABTA_DATA } from '@/lib/data';

interface FeaturedSectionProps {
  onOpenProduct: (slug: string) => void;
}

export function FeaturedSection({ onOpenProduct }: FeaturedSectionProps) {
  const { t, L, isRtl } = useLanguage();
  const railRef = useRef<HTMLDivElement>(null);

  const featuredProducts = NABTA_DATA.products.filter((p) => p.featured);

  const railStep = (dir: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>('.card');
    if (!card) return;
    const w = card.getBoundingClientRect().width + 20;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.scrollBy({
      left: dir * w * (isRtl ? -1 : 1),
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      railStep(isRtl ? -1 : 1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      railStep(isRtl ? 1 : -1);
    }
  };

  return (
    <section className="band clear" id="pieces" aria-labelledby="pTitle">
      <div className="wrap">
        <div className="head head-light reveal">
          <h2 id="pTitle">{t('featured.title')}</h2>
          <p>{t('featured.text')}</p>
        </div>
        <div className="rail-wrap">
          <div
            className="rail"
            id="rail"
            tabIndex={0}
            ref={railRef}
            onKeyDown={handleKeyDown}
          >
            {featuredProducts.map((p) => (
              <button
                key={p.slug}
                className="card"
                type="button"
                aria-label={`${t('card.view')}: ${L(p.name)}`}
                onClick={() => onOpenProduct(p.slug)}
              >
                <div className="ph">
                  <ResponsiveImage
                    image={p.images[0]}
                    alt={L(p.name)}
                    sizes="(max-width: 600px) 74vw, 320px"
                  />
                </div>
                <div className="meta">
                  <h3>{L(p.name)}</h3>
                  <p>{L(p.summary)}</p>
                  <span className="price">{t('card.price')}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="rail-ctrl">
            <button
              className="round"
              id="railPrev"
              type="button"
              onClick={() => railStep(-1)}
            >
              <span className="sr">{t('featured.prev')}</span>
              <svg viewBox="0 0 24 24">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              className="round"
              id="railNext"
              type="button"
              onClick={() => railStep(1)}
            >
              <span className="sr">{t('featured.next')}</span>
              <svg viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
