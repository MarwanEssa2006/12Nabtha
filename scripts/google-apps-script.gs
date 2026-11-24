// Google Apps Script Web App handler for 12 Nabta order submissions.
// Spreadsheet: 12 Nabta — Orders (ID: 1WnwWVRk39drQHWdB5813oht_vSYfNUJrkYdpGr76sAI)
// Paste into Extensions -> Apps Script inside the Google Sheet, then deploy as a Web App:
//   Execute as: Me
//   Who has access: Anyone
// Paste the resulting /exec URL into NEXT_PUBLIC_ORDERS_ENDPOINT in .env.local (or lib/config.ts).

const SPREADSHEET_ID = '1WnwWVRk39drQHWdB5813oht_vSYfNUJrkYdpGr76sAI';
const SHEET_NAME = 'Orders';
const HEADERS = [
  'submittedAt',
  'language',
  'name',
  'contact',
  'email',
  'product',
  'productLabel',
  'qty',
  'notes',
  'imageName',
  'message',
];

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, service: '12-nabta-orders', sheet: SHEET_NAME })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '{}';
    const d = JSON.parse(raw);

    const ss =
      SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SPREADSHEET_ID);
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
    }

    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }

    sh.appendRow([
      d.submittedAt || new Date().toISOString(),
      d.language || '',
      d.name || '',
      d.contact || '',
      d.email || '',
      d.product || '',
      d.productLabel || '',
      d.qty || 1,
      d.notes || '',
      d.imageName || '',
      d.message || '',
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
