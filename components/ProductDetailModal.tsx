'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { TechniqueTags } from '@/components/TechniqueTags';
import { useLanguage } from '@/context/LanguageContext';
import { NABTA_DATA } from '@/lib/data';
import { imgSrc } from '@/lib/images';
import type { Product } from '@/types/nabta';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: (restoreFocusAndScroll: boolean) => void;
  onOrderProduct: (slug: string) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onOrderProduct,
}: ProductDetailModalProps) {
  const { t, L, numFmt, isRtl } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef(true);
  const [slide, setSlide] = useState(0);

  const madeInPhoto = useMemo(() => {
    if (!product?.madeIn) return null;
    const allPhotos = [...NABTA_DATA.process, ...NABTA_DATA.gallery].map((x) => x.photo);
    return allPhotos.find((x) => x.base === product.madeIn) ?? null;
  }, [product]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    if (product) {
      restoreRef.current = true;
      setSlide(0);
      if (slidesRef.current) {
        slidesRef.current.scrollLeft = 0;
      }
      if (!dlg.open) {
        dlg.showModal();
      }
      closeBtnRef.current?.focus();
    } else if (dlg.open) {
      dlg.close();
    }
  }, [product]);

  const handleNativeClose = useCallback(() => {
    const shouldRestore = restoreRef.current;
    restoreRef.current = true;
    onClose(shouldRestore);
  }, [onClose]);

  const requestClose = useCallback(() => {
    const dlg = dialogRef.current;
    if (dlg?.open) {
      dlg.close();
    }
  }, []);

  const goSlide = useCallback((index: number) => {
    const box = slidesRef.current;
    if (!box) return;
    const count = box.children.length;
    if (!count) return;
    const next = ((index % count) + count) % count;
    setSlide(next);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    box.children[next]?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, []);

  const handleSlidesScroll = () => {
    const box = slidesRef.current;
    if (!box || !box.clientWidth) return;
    const idx = Math.round(Math.abs(box.scrollLeft) / box.clientWidth);
    if (idx !== slide) {
      setSlide(idx);
    }
  };

  const handleSlidesKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      goSlide(slide + (isRtl ? -1 : 1));
    }
    if (e.key === 'ArrowLeft') {
      goSlide(slide + (isRtl ? 1 : -1));
    }
  };

  const handleOrderClick = () => {
    if (!product) return;
    const slug = product.slug;
    restoreRef.current = false;
    requestClose();
    onOrderProduct(slug);
  };

  const catName = product
    ? L(NABTA_DATA.categories.find((c) => c.id === product.category)?.name)
    : '';

  return (
    <dialog
      ref={dialogRef}
      className="detail"
      id="detail"
      aria-labelledby="dName"
      onClose={handleNativeClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) requestClose();
      }}
    >
      <div className="d-in">
        <button
          ref={closeBtnRef}
          className="round d-close"
          id="dClose"
          type="button"
          onClick={requestClose}
        >
          <span className="sr">{t('detail.close')}</span>
          <svg viewBox="0 0 24 24">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="d-media">
          <div
            ref={slidesRef}
            className="d-slides"
            id="dSlides"
            tabIndex={0}
            onScroll={handleSlidesScroll}
            onKeyDown={handleSlidesKeyDown}
          >
            {product?.images.map((im, i) => (
              <ResponsiveImage
                key={im.base}
                image={im}
                alt={`${L(product.name)} — ${t('detail.photo', {
                  i: numFmt(i + 1),
                  n: numFmt(product.images.length),
                })}`}
                sizes="(max-width: 960px) 100vw, 560px"
                eager={i === 0}
              />
            ))}
          </div>

          <div className="d-ctrl" id="dCtrl">
            {product && product.images.length > 1 && (
              <>
                <button
                  className="round"
                  type="button"
                  onClick={() => goSlide(slide - 1)}
                >
                  <span className="sr">{t('detail.prev')}</span>
                  <svg viewBox="0 0 24 24">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                {product.images.map((im, i) => (
                  <button
                    key={im.base}
                    className="pip"
                    type="button"
                    aria-label={t('detail.photo', {
                      i: numFmt(i + 1),
                      n: numFmt(product.images.length),
                    })}
                    aria-current={i === slide}
                    onClick={() => goSlide(i)}
                  />
                ))}
                <button
                  className="round"
                  type="button"
                  onClick={() => goSlide(slide + 1)}
                >
                  <span className="sr">{t('detail.next')}</span>
                  <svg viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="d-text">
          <p className="kicker" id="dCat">
            {catName}
          </p>
          <h2 id="dName">{product ? L(product.name) : ''}</h2>
          <p className="lead" id="dSummary">
            {product ? L(product.summary) : ''}
          </p>
          <p id="dDetails">{product ? L(product.details) : ''}</p>
          <h3>{t('detail.techniques')}</h3>
          <TechniqueTags techniques={product?.techniques ?? []} id="dTags" />
          <h3>{t('detail.price')}</h3>
          <p>{t('detail.price.val')}</p>
          <div className="row">
            <button
              className="btn btn-green"
              id="dOrder"
              type="button"
              onClick={handleOrderClick}
            >
              {t('detail.order')}
            </button>
          </div>
          <figure className="d-made" id="dMade" hidden={!madeInPhoto}>
            {madeInPhoto && <img src={imgSrc(madeInPhoto, 640)} alt="" loading="lazy" />}
            <figcaption>{t('detail.made')}</figcaption>
          </figure>
        </div>
      </div>
    </dialog>
  );
}
