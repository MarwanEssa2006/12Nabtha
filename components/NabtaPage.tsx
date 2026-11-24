'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackgroundStage } from '@/components/BackgroundStage';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { useLanguage } from '@/context/LanguageContext';
import { useReveal } from '@/hooks/useReveal';
import { PRODUCTS_BY_SLUG } from '@/lib/data';
import { FeaturedSection } from '@/sections/FeaturedSection';
import { GallerySection } from '@/sections/GallerySection';
import { HeroSection } from '@/sections/HeroSection';
import { ImpactSection } from '@/sections/ImpactSection';
import { MakeSection } from '@/sections/MakeSection';
import { OrderSection, type PrefillRequest } from '@/sections/OrderSection';
import { ProcessSection } from '@/sections/ProcessSection';
import { StorySection } from '@/sections/StorySection';

export function NabtaPage() {
  const { t } = useLanguage();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [prefillRequest, setPrefillRequest] = useState<PrefillRequest | null>(null);

  const lastFocusRef = useRef<HTMLElement | null>(null);
  const keepScrollRef = useRef<number>(0);

  useReveal([]);

  useEffect(() => {
    document.title = t('meta.title');
    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = t('meta.description');
    }
  }, [t]);

  const openDetail = useCallback((slug: string, fromHash = false) => {
    if (!PRODUCTS_BY_SLUG[slug]) return;
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    keepScrollRef.current = window.scrollY;
    setOpenSlug(slug);
    if (!fromHash) {
      try {
        window.history.replaceState(null, '', `#p-${slug}`);
      } catch {
        // ignore history errors
      }
    }
  }, []);

  const handleCloseDetail = useCallback((restoreFocusAndScroll: boolean) => {
    setOpenSlug(null);
    if (window.location.hash.startsWith('#p-')) {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch {
        // ignore history errors
      }
    }
    if (restoreFocusAndScroll) {
      window.scrollTo({ top: keepScrollRef.current, behavior: 'auto' });
      lastFocusRef.current?.focus?.({ preventScroll: true });
    }
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const h = window.location.hash;
      if (h.startsWith('#p-')) {
        openDetail(h.slice(3), true);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [openDetail]);

  const handlePrefillOrder = useCallback((value: string, scrollAndFocus = false) => {
    setPrefillRequest({ value, nonce: Date.now(), scrollAndFocus });
  }, []);

  const handleOrderFromDetail = useCallback(
    (slug: string) => {
      handlePrefillOrder(`p:${slug}`, true);
    },
    [handlePrefillOrder]
  );

  const activeProduct = openSlug ? (PRODUCTS_BY_SLUG[openSlug] ?? null) : null;

  return (
    <>
      <a className="skip" href="#main">
        {t('nav.skip')}
      </a>

      <BackgroundStage />
      <Navbar />

      <main id="main">
        <HeroSection />
        <FeaturedSection onOpenProduct={(slug) => openDetail(slug)} />
        <MakeSection
          onOpenProduct={(slug) => openDetail(slug)}
          onPrefillOrder={(val) => handlePrefillOrder(val, false)}
        />
        <StorySection />
        <ProcessSection />
        <ImpactSection />
        <GallerySection />
        <OrderSection prefillRequest={prefillRequest} />
      </main>

      <Footer />

      <ProductDetailModal
        product={activeProduct}
        onClose={handleCloseDetail}
        onOrderProduct={handleOrderFromDetail}
      />
    </>
  );
}
