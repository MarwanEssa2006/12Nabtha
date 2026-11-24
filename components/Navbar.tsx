'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export interface NavbarProps {
  page?: 'home' | 'digital-card';
}

export function Navbar({ page = 'home' }: NavbarProps) {
  const { t, isRtl, toggleLang } = useLanguage();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const isHome = page === 'home';
  const isSolid = !isHome || solid;
  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`nav${isSolid ? ' solid' : ''}${menuOpen ? ' open' : ''}`} id="top">
      <div className="nav-in">
        <Link className="brand" href={isHome ? '#top' : '/'} aria-label={t('brand.name')}>
          <img
            className="brand-w"
            src="/assets/brand/logo-mark-white.png"
            alt={t('brand.name')}
            width={96}
            height={41}
          />
          <img
            className="brand-g"
            src="/assets/brand/logo-mark-green.png"
            alt=""
            width={96}
            height={41}
          />
        </Link>
        <nav className="nav-links" id="navLinks" aria-label={t('nav.mainLabel')}>
          <Link href={sectionHref('#pieces')} onClick={closeMenu}>
            {t('nav.shop')}
          </Link>
          <Link href={sectionHref('#make')} onClick={closeMenu}>
            {t('nav.make')}
          </Link>
          <Link href={sectionHref('#story')} onClick={closeMenu}>
            {t('nav.story')}
          </Link>
          <Link href={sectionHref('#process')} onClick={closeMenu}>
            {t('nav.process')}
          </Link>
          <Link href={sectionHref('#impact')} onClick={closeMenu}>
            {t('nav.impact')}
          </Link>
          <Link
            href="/digital-card"
            aria-current={page === 'digital-card' ? 'page' : undefined}
            onClick={closeMenu}
          >
            {t('nav.card')}
          </Link>
          <Link href={sectionHref('#order')} className="only-m" onClick={closeMenu}>
            {t('nav.order')}
          </Link>
        </nav>
        <div className="nav-act">
          <button
            className="lang"
            id="langBtn"
            type="button"
            aria-label={t('lang.label')}
            onClick={toggleLang}
          >
            <span lang={isRtl ? 'en' : 'ar'}>{t('lang.switch')}</span>
          </button>
          <Link className="btn btn-thread nav-order" href={sectionHref('#order')}>
            {t('nav.order')}
          </Link>
          <button
            ref={menuBtnRef}
            className="menu-btn"
            id="menuBtn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="navLinks"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="bars" aria-hidden="true" />
            <span className="sr">{t(menuOpen ? 'nav.close' : 'nav.menu')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
