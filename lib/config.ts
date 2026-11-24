import type { NabtaConfig } from '@/types/nabta';

/* ------------------------------------------------------------------
   12 Nabta — site configuration
   Edit this file to add contact details and turn on order delivery.
   Never put secret keys here: this file is public in the browser.
   ------------------------------------------------------------------ */
const DEFAULT_ORDERS_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwhf0wBqus-dB1_qHqMM7zp47lAIaOKDR9mbOr8TuQSp4UfdtKoSBYLuPt2L7N4YaMT_w/exec';
const ordersEndpoint = (
  process.env.NEXT_PUBLIC_ORDERS_ENDPOINT ?? DEFAULT_ORDERS_ENDPOINT
).trim();

export const NABTA_CONFIG: NabtaConfig = {
  // Default language when the visitor has not chosen one yet: 'ar' | 'en' | 'auto'
  defaultLanguage: 'ar',

  // Contact details. Leave a value empty ('') to hide it everywhere on the site.
  contact: {
    whatsapp: '',        // international format, digits only, e.g. '2010XXXXXXXX'
    phoneDisplay: '',    // how the number should be shown, e.g. '+20 10 XXXX XXXX'
    email: '',           // e.g. 'hello@12nabta.com'
    instagram: 'https://www.instagram.com/12nabta/',
    facebook: '',        // full URL
  },

  // Where order requests go. See docs/INTEGRATIONS.md.
  //  'none'      → nothing is sent. The visitor gets a ready message to copy or send on WhatsApp.
  //  'endpoint'  → the form is POSTed as JSON to `endpoint` (e.g. a Google Apps Script web app
  //                that writes to a Google Sheet, or Formspree). Only set this once it is tested.
  orders: {
    mode: ordersEndpoint ? 'endpoint' : 'none',
    endpoint: ordersEndpoint,
    maxUploadMB: 5,
  },
};
