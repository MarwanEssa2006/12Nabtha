'use client';

import React from 'react';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { useLanguage } from '@/context/LanguageContext';
import { NABTA_DATA } from '@/lib/data';

export function StorySection() {
  const { t, L } = useLanguage();

  return (
    <section className="band clear story" id="story" aria-labelledby="sTitle">
      <div className="wrap story-grid">
        <figure className="frame tilt-a reveal">
          <ResponsiveImage
            id="storyImg"
            image={NABTA_DATA.storyPhoto.photo}
            alt={L(NABTA_DATA.storyPhoto.alt)}
            sizes="(max-width: 960px) 92vw, 640px"
            defaultWidth={1280}
          />
          <figcaption>{t('story.caption')}</figcaption>
        </figure>
        <div className="glass reveal">
          <p className="kicker kicker-light">{t('story.kicker')}</p>
          <h2 id="sTitle">{t('story.title')}</h2>
          <p>{t('story.p1')}</p>
          <p>{t('story.p2')}</p>
          <p className="pull">{t('story.p3')}</p>
        </div>
      </div>
    </section>
  );
}
