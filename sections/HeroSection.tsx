'use client';

import React from 'react';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { useLanguage } from '@/context/LanguageContext';
import { HERO_PRODUCT_SLUGS, PRODUCTS_BY_SLUG } from '@/lib/data';

export function HeroSection() {
  const { t, L } = useLanguage();
  const picks = HERO_PRODUCT_SLUGS.map((s) => PRODUCTS_BY_SLUG[s]).filter(Boolean);

  return (
    <section className="hero" aria-labelledby="heroTitle">
      <div className="hero-grid">
        <div className="hero-panel reveal">
          <p className="kicker">
            <span className="dot" />
            <span>{t('hero.kicker')}</span>
          </p>
          <h1 id="heroTitle">{t('hero.title')}</h1>
          <p className="lead">{t('hero.text')}</p>
          <div className="row">
            <a className="btn btn-green" href="#pieces">
              {t('hero.cta')}
            </a>
            <a className="btn btn-line" href="#order">
              {t('hero.cta2')}
            </a>
          </div>
          <p className="hero-note">{t('hero.note')}</p>
        </div>
        <div className="patches" id="heroPatches" aria-hidden="true">
          {picks.map((p, i) => (
            <div className="patch" key={p.slug}>
              <span className="pin" />
              <ResponsiveImage
                image={p.images[0]}
                alt={L(p.name)}
                sizes="(max-width: 960px) 50vw, 25vw"
                eager={i === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
