/**
 * גלילה – רשימת הנרשמים ל"חומרים להורדה"
 *
 * הקוד הזה רץ בחשבון הגוגל של גלילה, מחובר לגיליון Google Sheets:
 * כל הורה שמשאיר פרטים בעמוד https://www.galilagroup.com/חומרים-להורדה/ נוסף אוטומטית כשורה בלשונית "נרשמים".
 * לא נשלחים מיילים.
 *
 * התקנה (פעם אחת):
 *  1. בגיליון: תוספים (Extensions) ← Apps Script. מוחקים את מה שכתוב שם, ומדביקים את כל הקובץ הזה.
 *  2. שומרים, בוחרים בפונקציה setup למעלה ולוחצים "הפעלה" (Run). מאשרים את ההרשאות.
 *  3. פריסה (Deploy) ← פריסה חדשה (New deployment) ← סוג: אפליקציית אינטרנט (Web app).
 *     הפעלה בתור (Execute as): אני (Me). למי יש גישה (Who has access): כל אחד (Anyone).
 *  4. מעתיקים את כתובת ה-Web app (מתחילה ב-https://script.google.com/macros/s/...)
 *     ושמים אותה ב-leadsEndpoint שבקובץ src/config/site.ts.
 * אחרי שינוי בקוד: פריסה ← ניהול פריסות ← עריכה ← גרסה חדשה (הכתובת נשארת אותה כתובת).
 */

const SHEET_NAME = 'נרשמים'
const HEADERS = ['תאריך', 'גיל הילד/ה', 'מאובחן/ת על הרצף', 'מייל', 'טלפון', 'עיר', 'אישור דיוור', 'נוסח האישור', 'עמוד']

// מקבל את הפרטים מהטופס באתר
function doPost(e) {
  const p = (e && e.parameter) || {}
  // בלי מייל או בלי אישור דיוור לא שומרים כלום
  if (!p.email || p.consent !== 'yes') return json({ ok: false })
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    getSheet().appendRow([
      new Date(),
      clean(p.age),
      clean(p.diagnosed),
      clean(p.email),
      clean(p.phone),
      clean(p.city),
      'כן',
      clean(p.consentText),
      clean(p.page),
    ])
  } finally {
    lock.releaseLock()
  }
  return json({ ok: true })
}

// הרצה ראשונה: יוצר את הלשונית "נרשמים" עם הכותרות (אפשר להריץ שוב בלי נזק)
function setup() {
  getSheet()
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

// מגביל אורך, ומונע מטקסט שמתחיל ב-= להפוך לנוסחה בגיליון (טלפון שמתחיל ב-+ נשמר כטקסט)
function clean(value) {
  const v = String(value || '').trim().slice(0, 300)
  return /^[=+\-@]/.test(v) ? "'" + v : v
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
