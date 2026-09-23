/**
 * Simply Unpack → Google Sheets webhook.
 * Paste this into Extensions → Apps Script of your Google Sheet, then Deploy → New deployment → Web app.
 * Each form type gets its own tab (profile, survey, payment, approval, rating, reschedule, cancel, support, login).
 * New columns are added automatically when the app sends a new field.
 */

// Optional: get an email for every new survey booking. Leave '' to disable.
const NOTIFY_EMAIL = '';

// Optional: must match VITE_SHEETS_TOKEN in the app. Leave '' to accept all requests.
// Note: this value is visible in the web app bundle, so treat it as light spam protection, not security.
const SHARED_TOKEN = '';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (SHARED_TOKEN && body.token !== SHARED_TOKEN) return json_({ ok: false, error: 'unauthorized' });

    const type = String(body.type || 'event').replace(/[^\w-]/g, '').slice(0, 40) || 'event';
    const row = Object.assign(
      { received_at: new Date(), sent_at: body.at || '', type: type },
      flatten_(body.user || {}, 'user_'),
      flatten_(body.payload || {}, '')
    );

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(type) || ss.insertSheet(type);
    const lastCol = sheet.getLastColumn();
    const headers = lastCol ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].filter(String) : [];
    Object.keys(row).forEach(function (k) { if (headers.indexOf(k) === -1) headers.push(k); });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.appendRow(headers.map(function (h) { return row[h] === undefined ? '' : row[h]; }));

    if (type === 'survey' && NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'New Simply Unpack survey booking',
        Object.keys(row).map(function (k) { return k + ': ' + row[k]; }).join('\n'));
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: 'simplyunpack-sheets' });
}

function flatten_(obj, prefix, out) {
  out = out || {};
  Object.keys(obj).forEach(function (k) {
    const v = obj[k];
    const key = prefix + k;
    if (Array.isArray(v)) out[key] = v.join(', ');
    else if (v && typeof v === 'object') flatten_(v, key + '_', out);
    else out[key] = v;
  });
  return out;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
