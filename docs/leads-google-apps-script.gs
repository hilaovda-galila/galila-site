/**
 * גלילה – רשימת הנרשמים ל"חומרים להורדה"
 *
 * הקוד הזה רץ בחשבון הגוגל של גלילה, מחובר לגיליון Google Sheets:
 *  1. כל הורה שמשאיר פרטים בעמוד https://www.galilagroup.com/חומרים-להורדה/ נוסף כשורה בגיליון.
 *  2. ב-1 לכל חודש, ב-8 בבוקר, נשלח מייל עם הנרשמים החדשים מהחודש שעבר,
 *     ובצירוף קובץ CSV עם כל הרשימה.
 *
 * התקנה (פעם אחת):
 *  1. יוצרים גיליון חדש ב-Google Sheets, למשל בשם "גלילה – נרשמים לחומרים".
 *  2. בגיליון: תוספים (Extensions) ← Apps Script. מוחקים את מה שכתוב שם, ומדביקים את כל הקובץ הזה.
 *  3. שומרים, בוחרים בפונקציה setup למעלה ולוחצים "הפעלה" (Run). מאשרים את ההרשאות.
 *  4. פריסה (Deploy) ← פריסה חדשה (New deployment) ← סוג: אפליקציית אינטרנט (Web app).
 *     הפעלה בתור (Execute as): אני (Me). למי יש גישה (Who has access): כל אחד (Anyone).
 *  5. מעתיקים את כתובת ה-Web app (מתחילה ב-https://script.google.com/macros/s/...)
 *     ושמים אותה ב-leadsEndpoint שבקובץ src/config/site.ts.
 */

// לאן נשלח הדוח החודשי
const REPORT_EMAIL = 'hilaovda0@gmail.com'
const SHEET_NAME = 'נרשמים'
const HEADERS = ['תאריך', 'שם', 'מייל', 'טלפון', 'אישור דיוור', 'נוסח האישור', 'עמוד']

// מקבל את הפרטים מהטופס באתר
function doPost(e) {
  const p = (e && e.parameter) || {}
  // בלי מייל או בלי אישור דיוור לא שומרים כלום
  if (!p.email || p.consent !== 'yes') return json({ ok: false })
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    getSheet().appendRow([new Date(), clean(p.name), clean(p.email), clean(p.phone), 'כן', clean(p.consentText), clean(p.page)])
  } finally {
    lock.releaseLock()
  }
  return json({ ok: true })
}

// הדוח החודשי: הנרשמים מאז הדוח הקודם, ובצירוף כל הרשימה
function monthlyReport() {
  const sheet = getSheet()
  const rows = sheet.getDataRange().getValues().slice(1)
  const props = PropertiesService.getScriptProperties()
  const since = new Date(Number(props.getProperty('lastReport') || 0))
  const fresh = rows.filter((r) => r[0] instanceof Date && r[0] > since)
  const tz = 'Asia/Jerusalem'
  const fmt = (d) => Utilities.formatDate(d, tz, 'dd/MM/yyyy')

  const table = fresh.length
    ? '<table border="1" cellpadding="6" style="border-collapse:collapse">' +
      '<tr><th>תאריך</th><th>שם</th><th>מייל</th><th>טלפון</th></tr>' +
      fresh.map((r) => `<tr><td>${fmt(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('') +
      '</table>'
    : '<p>החודש לא נוספו נרשמים חדשים.</p>'

  const csv = [HEADERS].concat(rows.map((r) => [r[0] instanceof Date ? fmt(r[0]) : r[0]].concat(r.slice(1))))
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\r\n')
  // BOM כדי שאקסל יציג עברית נכון
  const attachment = Utilities.newBlob('﻿' + csv, 'text/csv', `גלילה-נרשמים-${Utilities.formatDate(new Date(), tz, 'yyyy-MM')}.csv`)

  MailApp.sendEmail({
    to: REPORT_EMAIL,
    subject: `גלילה – נרשמים לחומרים להורדה: ${fresh.length} חדשים החודש (${rows.length} בסך הכול)`,
    htmlBody:
      `<div dir="rtl" style="font-family:Arial,sans-serif">` +
      `<p>שלום,</p><p>אלה ההורים שהשאירו פרטים באתר והורידו חומרים מאז הדוח הקודם (${fresh.length}):</p>${table}` +
      `<p>בקובץ המצורף: כל הרשימה (${rows.length} נרשמים). הרשימה המלאה והמתעדכנת נמצאת תמיד גם בגיליון: ` +
      `<a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}">פתיחת הגיליון</a></p>` +
      `<p>מי שמבקש להסיר את עצמו: מוחקים את השורה שלו מהגיליון.</p></div>`,
    attachments: [attachment],
  })
  props.setProperty('lastReport', String(Date.now()))
}

// הרצה ראשונה: יוצר את הלשונית ואת התזמון החודשי (אפשר להריץ שוב בלי נזק)
function setup() {
  getSheet()
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'monthlyReport')
    .forEach((t) => ScriptApp.deleteTrigger(t))
  ScriptApp.newTrigger('monthlyReport').timeBased().onMonthDay(1).atHour(8).inTimezone('Asia/Jerusalem').create()
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow(HEADERS)
    sheet.setFrozenRows(1)
    sheet.setRightToLeft(true)
  }
  return sheet
}

// מגביל אורך, ומונע מטקסט שמתחיל ב-= להפוך לנוסחה בגיליון
function clean(value) {
  const v = String(value || '').trim().slice(0, 300)
  return /^[=+\-@]/.test(v) ? "'" + v : v
}

function esc(value) {
  return String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
