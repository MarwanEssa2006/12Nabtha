# Order integrations

By default (`orders.mode: 'none'`), orders are prepared as a message in the browser, and nothing is stored or sent.
To receive orders automatically in Google Sheets or via WhatsApp/email, configure one of the options below.
Never put secret keys in `lib/config.ts`, because that file runs in the browser.

## Option A — WhatsApp / email / social links (no server)

In `lib/config.ts`:

```ts
contact: {
  whatsapp: '2010XXXXXXXX',
  phoneDisplay: '+20 10 XXXX XXXX',
  email: 'orders@example.com',
  instagram: 'https://www.instagram.com/12nabta/',
  facebook: '',
}
```

The ready screen then shows "Send on WhatsApp", "Send by email", and "Message on Instagram" for whichever channels are set.

## Option B — Google Sheet via Google Apps Script (free, no keys in the site)

1. Open the 12 Nabta Google Sheet (`12 Nabta — Orders`, ID `1WnwWVRk39drQHWdB5813oht_vSYfNUJrkYdpGr76sAI`), which already has the `Orders` tab and header row (`submittedAt | language | name | contact | email | product | productLabel | qty | notes | imageName | message`).
2. Open **Extensions → Apps Script** and paste the code from `scripts/google-apps-script.gs`.
3. Choose **Deploy → New deployment → Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
   Copy the `/exec` URL.
4. Connect it to the website either in `.env.local`:

   ```env
   NEXT_PUBLIC_ORDERS_ENDPOINT=https://script.google.com/macros/s/XXXX/exec
   ```

   or directly in `lib/config.ts` (`ordersEndpoint`). When `NEXT_PUBLIC_ORDERS_ENDPOINT` is set, `orders.mode` switches to `'endpoint'` automatically.

The site sends the body as `text/plain` JSON on purpose: it avoids a CORS preflight, which Apps Script does not answer.
The deployment URL is not a secret, but anyone who has it can post to the sheet. Add a simple honeypot field or rate check in `doPost` if spam appears.

**Images:** Apps Script can receive a base64 image and save it to Drive. This is not wired yet, because large uploads through Apps Script are slow and limited.
Recommended approach: keep "send the image separately" for now, or upload to Drive/Cloudinary from a Next.js API route later.

## Option C — Form service (Formspree, Basin, etc.)

Set `NEXT_PUBLIC_ORDERS_ENDPOINT` (or `orders.endpoint` and `orders.mode: 'endpoint'` in `lib/config.ts`) to the form service's endpoint URL. Check that the service accepts JSON POST.

## Testing

After setting an endpoint, restart `npm run dev` (if using `.env.local`), submit a test order, and verify that the new row arrives in the `Orders` tab and the site shows "Request received".
If the endpoint fails, the visitor sees an error message and their order text, so they can still copy and send it manually.
