'use client';

import React from 'react';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { useLanguage } from '@/context/LanguageContext';
import { NABTA_DATA } from '@/lib/data';

export function ProcessSection() {
  const { t, L, numFmt } = useLanguage();

  return (
    <section className="sheet green" id="process" aria-labelledby="prTitle">
      <div className="wrap">
        <div className="head head-light reveal">
          <h2 id="prTitle">{t('process.title')}</h2>
          <p>{t('process.text')}</p>
        </div>
        <ol className="steps" id="steps">
          {NABTA_DATA.process.map((s, i) => (
            <li className="step reveal" key={s.photo.base}>
              <span className="num">{numFmt(i + 1)}</span>
              <ResponsiveImage
                image={s.photo}
                alt={L(s.title)}
                sizes="(max-width: 600px) 92vw, (max-width: 1080px) 45vw, 280px"
              />
              <h3>{L(s.title)}</h3>
              <p>{L(s.text)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
