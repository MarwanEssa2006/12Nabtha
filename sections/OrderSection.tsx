'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { NABTA_CONFIG } from '@/lib/config';
import { NABTA_DATA, PRODUCTS_BY_SLUG } from '@/lib/data';

export interface PrefillRequest {
  value: string;
  nonce: number;
  scrollAndFocus?: boolean;
}

interface OrderSectionProps {
  prefillRequest: PrefillRequest | null;
}

type ReadyState = 'ready' | 'sent' | 'failed';

export function OrderSection({ prefillRequest }: OrderSectionProps) {
  const { lang, t, L } = useLanguage();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [product, setProduct] = useState('');
  const [qty, setQty] = useState('1');
  const [notes, setNotes] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [readyView, setReadyView] = useState<{ msg: string; state: ReadyState } | null>(null);
  const [copied, setCopied] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<HTMLSelectElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const readyRef = useRef<HTMLDivElement>(null);
  const readyMsgRef = useRef<HTMLTextAreaElement>(null);

  const validOptionValues = useMemo(() => {
    const vals = new Set<string>(['', 'custom']);
    for (const c of NABTA_DATA.categories) {
      vals.add(`cat:${c.id}`);
    }
    for (const p of NABTA_DATA.products) {
      vals.add(`p:${p.slug}`);
    }
    return vals;
  }, []);

  useEffect(() => {
    if (!prefillRequest) return;
    const nextVal = validOptionValues.has(prefillRequest.value)
      ? prefillRequest.value
      : 'custom';
    setProduct(nextVal);
    setReadyView(null);
    setInvalidFields((prev) => prev.filter((f) => f !== 'product'));

    if (prefillRequest.scrollAndFocus) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const orderEl = document.getElementById('order');
      orderEl?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      const timer = window.setTimeout(
        () => nameRef.current?.focus({ preventScroll: true }),
        reduce ? 0 : 600
      );
      return () => window.clearTimeout(timer);
    }
  }, [prefillRequest, validOptionValues]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (readyView) {
      readyRef.current?.focus();
    }
  }, [readyView]);

  const catName = useCallback(
    (id: string) => L(NABTA_DATA.categories.find((c) => c.id === id)?.name),
    [L]
  );

  const productLabel = useCallback(
    (v: string): string => {
      if (!v) return '';
      if (v === 'custom') return t('order.product.custom');
      const [k, id] = v.split(':');
      if (k === 'p' && PRODUCTS_BY_SLUG[id]) {
        const p = PRODUCTS_BY_SLUG[id];
        return `${L(p.name)} (${catName(p.category)})`;
      }
      return `${catName(id)} — ${t('order.product.custom')}`;
    },
    [L, catName, t]
  );

  const buildMessage = useCallback(
    (d: {
      name: string;
      contact: string;
      email: string;
      product: string;
      qty: number;
      notes: string;
    }) => {
      const lines = [
        t('order.msg.head'),
        '',
        `${t('order.name')}: ${d.name}`,
        `${t('order.contact')}: ${d.contact}`,
      ];
      if (d.email) {
        lines.push(`${t('order.email').replace(/\s*\(.*\)/, '')}: ${d.email}`);
      }
      lines.push(
        `${t('order.product')} ${productLabel(d.product)}`,
        `${t('order.qty')}: ${d.qty}`
      );
      if (d.notes) {
        lines.push('', `${t('order.notes')}:`, d.notes);
      }
      if (file) {
        lines.push('', t('order.msg.image', { name: file.name }));
      }
      return lines.join('\n');
    },
    [file, productLabel, t]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setErrorMsg('');
    if (!f) return;
    if (f.size > NABTA_CONFIG.orders.maxUploadMB * 1024 * 1024) {
      setErrorMsg(t('order.big', { mb: NABTA_CONFIG.orders.maxUploadMB }));
      e.target.value = '';
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedQty = Math.max(1, parseInt(qty, 10) || 1);
    const d = {
      name: name.trim(),
      contact: contact.trim(),
      email: email.trim(),
      product: product.trim(),
      qty: parsedQty,
      notes: notes.trim(),
    };

    const missing = (['name', 'contact', 'product'] as const).filter((k) => !d[k]);
    setInvalidFields(missing);

    if (missing.length > 0) {
      setErrorMsg(t('order.required'));
      if (missing[0] === 'name') nameRef.current?.focus();
      else if (missing[0] === 'contact') contactRef.current?.focus();
      else if (missing[0] === 'product') productRef.current?.focus();
      return;
    }

    const msg = buildMessage(d);
    setCopied(false);

    if (NABTA_CONFIG.orders.mode === 'endpoint' && NABTA_CONFIG.orders.endpoint) {
      setSubmitting(true);
      try {
        const payload: Record<string, unknown> = {
          ...d,
          image: undefined,
          productLabel: productLabel(d.product),
          language: lang,
          submittedAt: new Date().toISOString(),
          message: msg,
        };
        if (file) payload.imageName = file.name;
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { ok?: boolean };
        if (!json?.ok) throw new Error('Endpoint rejected');
        setReadyView({ msg, state: 'sent' });
        setName('');
        setContact('');
        setEmail('');
        setProduct('');
        setQty('1');
        setNotes('');
        handleRemoveFile();
      } catch {
        setReadyView({ msg, state: 'failed' });
      } finally {
        setSubmitting(false);
      }
    } else {
      setReadyView({ msg, state: 'ready' });
    }
  };

  const handleCopy = async () => {
    if (!readyView) return;
    try {
      await navigator.clipboard.writeText(readyView.msg);
      setCopied(true);
    } catch {
      readyMsgRef.current?.select();
    }
  };

  const handleEdit = () => {
    setReadyView(null);
    window.setTimeout(() => nameRef.current?.focus(), 0);
  };

  const c = NABTA_CONFIG.contact;
  const isSent = readyView?.state === 'sent';
  const readyContactText =
    !isSent && !c.whatsapp && !c.email && !c.instagram
      ? t('order.ready.noContact')
      : c.email && !isSent
        ? c.email
        : '';

  return (
    <section className="band clear order-band" id="order" aria-labelledby="oTitle">
      <div className="wrap">
        <div className="order-card reveal">
          <div className="order-intro">
            <h2 id="oTitle">{t('order.title')}</h2>
            <p>{t('order.text')}</p>
            <img
              className="order-logo"
              src="/assets/brand/logo-lockup-green.png"
              alt=""
              width={240}
              height={90}
              loading="lazy"
            />
          </div>

          <form id="orderForm" noValidate hidden={Boolean(readyView)} onSubmit={handleSubmit}>
            <div className="f2">
              <label className="fld">
                <span>{t('order.name')}</span>
                <input
                  ref={nameRef}
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  className={invalidFields.includes('name') ? 'invalid' : undefined}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (invalidFields.includes('name')) {
                      setInvalidFields((prev) => prev.filter((f) => f !== 'name'));
                    }
                  }}
                />
              </label>
              <label className="fld">
                <span>{t('order.contact')}</span>
                <input
                  ref={contactRef}
                  name="contact"
                  type="tel"
                  autoComplete="tel"
                  required
                  dir="ltr"
                  value={contact}
                  className={invalidFields.includes('contact') ? 'invalid' : undefined}
                  onChange={(e) => {
                    setContact(e.target.value);
                    if (invalidFields.includes('contact')) {
                      setInvalidFields((prev) => prev.filter((f) => f !== 'contact'));
                    }
                  }}
                />
              </label>
            </div>

            <label className="fld">
              <span>{t('order.email')}</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <div className="f2 f2-qty">
              <label className="fld">
                <span>{t('order.product')}</span>
                <select
                  ref={productRef}
                  name="product"
                  id="productSel"
                  required
                  value={product}
                  className={invalidFields.includes('product') ? 'invalid' : undefined}
                  onChange={(e) => {
                    setProduct(e.target.value);
                    if (invalidFields.includes('product')) {
                      setInvalidFields((prev) => prev.filter((f) => f !== 'product'));
                    }
                  }}
                >
                  <option value="">—</option>
                  {NABTA_DATA.categories.map((cat) => {
                    const items = NABTA_DATA.products.filter((p) => p.category === cat.id);
                    return (
                      <optgroup key={cat.id} label={L(cat.name)}>
                        {items.map((p) => (
                          <option key={p.slug} value={`p:${p.slug}`}>
                            {L(p.name)}
                          </option>
                        ))}
                        <option value={`cat:${cat.id}`}>
                          {L(cat.name)} — {t('order.product.custom')}
                        </option>
                      </optgroup>
                    );
                  })}
                  <option value="custom">{t('order.product.custom')}</option>
                </select>
              </label>
              <label className="fld">
                <span>{t('order.qty')}</span>
                <input
                  name="qty"
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </label>
            </div>

            <label className="fld">
              <span>{t('order.notes')}</span>
              <textarea
                name="notes"
                rows={4}
                placeholder={t('order.notes.ph')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>

            <div className="upload">
              <label className="up-btn">
                <input
                  ref={fileRef}
                  type="file"
                  name="image"
                  id="fileIn"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                />
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 16V4m0 0l-5 5m5-5l5 5M4 20h16" />
                </svg>
                <span>{t('order.upload')}</span>
              </label>
              <p className="hint" id="upHint">
                {t('order.upload.hint', { mb: NABTA_CONFIG.orders.maxUploadMB })}
              </p>
              <div className="up-prev" id="upPrev" hidden={!file}>
                {previewUrl && <img id="upImg" src={previewUrl} alt="" />}
                <span id="upName">{file?.name}</span>
                <button
                  type="button"
                  className="link"
                  id="upRemove"
                  onClick={handleRemoveFile}
                >
                  {t('order.upload.remove')}
                </button>
              </div>
            </div>

            <p className="err" id="formErr" role="alert" hidden={!errorMsg}>
              {errorMsg}
            </p>

            <button className="btn btn-green btn-wide" type="submit" disabled={submitting}>
              {submitting ? t('order.sending') : t('order.submit')}
            </button>
          </form>

          <div className="ready" id="ready" hidden={!readyView} tabIndex={-1} ref={readyRef}>
            <h3 id="readyTitle">
              {readyView
                ? isSent
                  ? t('order.sent.title')
                  : t('order.ready.title')
                : ''}
            </h3>
            <p id="readyText">
              {readyView
                ? isSent
                  ? t('order.sent.text')
                  : readyView.state === 'failed'
                    ? t('order.failed')
                    : t('order.ready.text')
                : ''}
            </p>
            <textarea
              ref={readyMsgRef}
              id="readyMsg"
              rows={9}
              readOnly
              dir="auto"
              hidden={Boolean(isSent)}
              value={readyView?.msg ?? ''}
            />
            <div className="row" id="readyActs">
              {readyView && !isSent && (
                <>
                  <button
                    className="btn btn-green"
                    type="button"
                    id="copyBtn"
                    onClick={handleCopy}
                  >
                    {copied ? t('order.copied') : t('order.copy')}
                  </button>
                  {c.whatsapp && (
                    <a
                      className="btn btn-line"
                      href={`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(readyView.msg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('order.whatsapp')}
                    </a>
                  )}
                  {c.email && (
                    <a
                      className="btn btn-line"
                      href={`mailto:${c.email}?subject=${encodeURIComponent(t('order.msg.head'))}&body=${encodeURIComponent(readyView.msg)}`}
                    >
                      {t('order.email.btn')}
                    </a>
                  )}
                  {c.instagram && (
                    <a
                      className="btn btn-line"
                      href={c.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('order.instagram.btn')}
                    </a>
                  )}
                </>
              )}
              {readyView && (
                <button className="link" type="button" id="editBtn" onClick={handleEdit}>
                  {t('order.edit')}
                </button>
              )}
            </div>
            <p className="hint" id="readyContact">
              {readyView ? readyContactText : ''}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
