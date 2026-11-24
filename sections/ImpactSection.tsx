'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { NABTA_DATA } from '@/lib/data';

export function ImpactSection() {
  const { t, L, numFmt } = useLanguage();

  return (
    <section className="sheet paper" id="impact" aria-labelledby="iTitle">
      <div className="seam" aria-hidden="true" />
      <div className="wrap">
        <div className="head reveal">
          <h2 id="iTitle">{t('impact.title')}</h2>
          <p>{t('impact.text')}</p>
        </div>
        <div className="figures" id="figures">
          {NABTA_DATA.milestones.map((m) => (
            <article className="fig-card reveal" key={m.figure}>
              <span className="n">{numFmt(Number(m.figure))}</span>
              <span className="l">{L(m.label)}</span>
              <p>{L(m.text)}</p>
            </article>
          ))}
        </div>
        <div className="next reveal" id="nextBox">
          <svg
            className="sprout"
            viewBox="0 0 64 64"
            aria-hidden="true"
            fill="none"
            stroke="#D9A331"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="5 4"
          >
            <path d="M32 58V24" />
            <path d="M32 34c-10 0-16-6-17-15 10 0 16 6 17 15z" />
            <path d="M32 28c9 0 15-6 16-14-9 0-15 5-16 14z" />
            <path d="M14 58h36" strokeDasharray="0" />
          </svg>
          <div>
            <h3>{L(NABTA_DATA.next.title)}</h3>
            <p>{L(NABTA_DATA.next.text)}</p>
          </div>
        </div>
        <p className="partners reveal">
          <strong>{t('impact.partners')}</strong> <span id="partners">{L(NABTA_DATA.partners)}</span>
        </p>
      </div>
    </section>
  );
}
