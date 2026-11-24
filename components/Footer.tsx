'use client';

import Link from 'next/link';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { NABTA_CONFIG } from '@/lib/config';

export interface FooterProps {
  page?: 'home' | 'digital-card';
}

export function Footer({ page = 'home' }: FooterProps) {
  const { t } = useLanguage();
  const c = NABTA_CONFIG.contact;
  const isHome = page === 'home';
  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`);

  const contactItems: React.ReactNode[] = [];
  if (c.whatsapp) {
    contactItems.push(
      <a key="wa" href={`https://wa.me/${c.whatsapp}`} dir="ltr">
        {t('contact.whatsapp')} {c.phoneDisplay || `+${c.whatsapp}`}
      </a>
    );
  } else if (c.phoneDisplay) {
    contactItems.push(
      <span key="phone" dir="ltr">
        {c.phoneDisplay}
      </span>
    );
  }
  if (c.email) {
    contactItems.push(
      <a key="email" href={`mailto:${c.email}`} dir="ltr">
        {c.email}
      </a>
    );
  }
  if (c.instagram) {
    contactItems.push(
      <a key="ig" href={c.instagram} target="_blank" rel="noopener noreferrer">
        {t('contact.instagram')}
      </a>
    );
  }
  if (c.facebook) {
    contactItems.push(
      <a key="fb" href={c.facebook} target="_blank" rel="noopener noreferrer">
        {t('contact.facebook')}
      </a>
    );
  }

  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div>
          <img
            src="/assets/brand/logo-lockup-white.png"
            alt="12 نبتة — 12 Nabta"
            width={220}
            height={83}
            loading="lazy"
          />
          <p>{t('footer.tag')}</p>
        </div>
        <nav aria-label={t('footer.navLabel')}>
          <Link href={sectionHref('#pieces')}>{t('nav.shop')}</Link>
          <Link href={sectionHref('#make')}>{t('nav.make')}</Link>
          <Link href={sectionHref('#story')}>{t('nav.story')}</Link>
          <Link href={sectionHref('#process')}>{t('nav.process')}</Link>
          <Link href={sectionHref('#impact')}>{t('nav.impact')}</Link>
          <Link href="/digital-card" aria-current={page === 'digital-card' ? 'page' : undefined}>
            {t('nav.card')}
          </Link>
          <Link href={sectionHref('#order')}>{t('nav.order')}</Link>
        </nav>
        <div>
          <h3>{t('footer.contact')}</h3>
          <ul className="contact" id="contactList">
            {contactItems.length > 0 ? (
              contactItems.map((item, idx) => <li key={idx}>{item}</li>)
            ) : (
              <li>{t('footer.nocontact')}</li>
            )}
          </ul>
        </div>
      </div>
      <div className="wrap foot-base">
        <span>{t('footer.made')}</span>
        <a href="#top">{t('footer.top')}</a>
      </div>
    </footer>
  );
}
