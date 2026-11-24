'use client';

import React, { useMemo, useState } from 'react';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { TechniqueTags } from '@/components/TechniqueTags';
import { useLanguage } from '@/context/LanguageContext';
import { NABTA_DATA } from '@/lib/data';
import type { CategoryId } from '@/types/nabta';

interface MakeSectionProps {
  onOpenProduct: (slug: string) => void;
  onPrefillOrder: (value: string) => void;
}

const SPOOL_COLOURS: Partial<Record<CategoryId, string>> = {
  totes: 'var(--mustard)',
  laptop: 'var(--denim)',
  makeup: '#E9A6A0',
  custom: 'var(--plum)',
};

export function MakeSection({ onOpenProduct, onPrefillOrder }: MakeSectionProps) {
  const { t, L, numFmt } = useLanguage();
  const [filter, setFilter] = useState<'all' | CategoryId>('all');

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of NABTA_DATA.categories) {
      map[c.id] = NABTA_DATA.products.filter((p) => p.category === c.id).length;
    }
    return map;
  }, []);

  const chips: Array<{ id: 'all' | CategoryId; name: string; n: number }> = [
    { id: 'all', name: t('make.all'), n: NABTA_DATA.products.length },
    ...NABTA_DATA.categories.map((c) => ({
      id: c.id,
      name: L(c.name),
      n: counts[c.id] ?? 0,
    })),
  ];

  const filteredProducts = NABTA_DATA.products.filter(
    (p) => filter === 'all' || p.category === filter
  );

  const emptyCategories = NABTA_DATA.categories.filter((c) => (counts[c.id] ?? 0) === 0);

  return (
    <section className="sheet canvas" id="make" aria-labelledby="mTitle">
      <div className="seam" aria-hidden="true" />
      <div className="wrap">
        <div className="head reveal">
          <h2 id="mTitle">{t('make.title')}</h2>
          <p>{t('make.text')}</p>
        </div>
        <div className="chips" id="chips" role="tablist" aria-labelledby="mTitle">
          {chips.map((c) => (
            <button
              key={c.id}
              className="chip"
              type="button"
              role="tab"
              data-filter={c.id}
              aria-selected={c.id === filter}
              onClick={() => setFilter(c.id)}
            >
              {c.name} <small>{numFmt(c.n)}</small>
            </button>
          ))}
        </div>
        <div className="grid" id="grid" aria-live="polite">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <button
                key={p.slug}
                className="tile"
                type="button"
                onClick={() => onOpenProduct(p.slug)}
              >
                <div className="ph">
                  <ResponsiveImage
                    image={p.images[0]}
                    alt={L(p.name)}
                    sizes="(max-width: 600px) 92vw, (max-width: 1100px) 45vw, 290px"
                  />
                </div>
                <div className="meta">
                  <h3>{L(p.name)}</h3>
                  <p>{L(p.summary)}</p>
                  <TechniqueTags techniques={p.techniques} />
                </div>
              </button>
            ))
          ) : (
            <p className="empty">
              {t('make.empty')}{' '}
              <a
                href="#order"
                onClick={() => onPrefillOrder(`cat:${filter}`)}
              >
                {t('make.ask')}
              </a>
            </p>
          )}
        </div>
        <div className="cats" id="cats">
          {emptyCategories.map((c) => (
            <article className="cat" key={c.id}>
              <span
                className="spool"
                style={{ '--c': SPOOL_COLOURS[c.id] || 'var(--mint)' } as React.CSSProperties}
              />
              <h3>{L(c.name)}</h3>
              <p>{L(c.blurb)}</p>
              {c.id !== 'custom' && <span className="soon">{t('make.soon')}</span>}
              <a
                href="#order"
                onClick={() => onPrefillOrder(`cat:${c.id}`)}
              >
                {t('make.ask')}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
