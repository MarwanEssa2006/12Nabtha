import { NextResponse } from 'next/server';
import { NABTA_CONFIG } from '@/lib/config';

export async function POST(request: Request) {
  const endpoint = (
    process.env.ORDERS_ENDPOINT ??
    process.env.NEXT_PUBLIC_ORDERS_ENDPOINT ??
    NABTA_CONFIG.orders.endpoint
  ).trim();

  if (!endpoint) {
    return NextResponse.json(
      { ok: false, error: 'Orders endpoint is not configured.' },
      { status: 503 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const text = await upstream.text();
    const isAppsScript = endpoint.includes('script.google.com');

    if (upstream.status === 401 || upstream.url.includes('accounts.google.com')) {
      console.error(
        '[api/orders] Apps Script returned 401 / sign-in redirect. Set "Who has access" to "Anyone" in Deploy -> Manage deployments.'
      );
      return NextResponse.json(
        { ok: false, error: 'apps_script_unauthorized' },
        { status: 502 }
      );
    }

    if (!upstream.ok) {
      console.error('[api/orders] Upstream error:', upstream.status, text.slice(0, 300));
      return NextResponse.json(
        { ok: false, error: `Upstream HTTP ${upstream.status}` },
        { status: 502 }
      );
    }

    if (text || isAppsScript) {
      try {
        const json = JSON.parse(text) as { ok?: boolean; error?: string };
        if (!json || json.ok === false || (isAppsScript && json.ok !== true)) {
          console.error('[api/orders] Upstream rejected payload:', json);
          return NextResponse.json(
            { ok: false, error: json?.error || 'Upstream rejected payload' },
            { status: 502 }
          );
        }
      } catch {
        if (isAppsScript) {
          console.error('[api/orders] Non-JSON response from Apps Script:', text.slice(0, 300));
          return NextResponse.json(
            { ok: false, error: 'Non-JSON response from Apps Script' },
            { status: 502 }
          );
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/orders] Network error forwarding order:', err);
    return NextResponse.json({ ok: false, error: 'Upstream network error' }, { status: 502 });
  }
}
