// צילום מצב SEO של האתר החי, כדי לעקוב אחרי שיפור לאורך זמן.
// כל הרצה מוסיפה שורה עם תאריך היום לקובצי ה-CSV שב-seo/metrics ומעדכנת את seo/REPORT.md.
//
//   npm run seo:snapshot                    מדידה מלאה (כ-6 דקות: כולל Lighthouse, דורש Chrome מותקן)
//   npm run seo:snapshot -- --no-lighthouse בדיקות טכניות בלבד (כמה שניות)
//
// מה נמדד אוטומטית: (1) בריאות טכנית של כל עמוד במפת האתר, (2) התנהגות השרת (הפניות, 404, ספאם),
// (3) ציוני Lighthouse בנייד לשלושה עמודי מפתח, (4) נתוני Google Search Console, אם הוגדר מפתח.
// נתוני תנועה ובינה מלאכותית מגיעים מ-Vercel Analytics ומבדיקה ידנית, ונרשמים ב-seo/metrics/manual.csv.
import { spawnSync } from 'node:child_process'
import { createSign } from 'node:crypto'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const SITE = 'https://www.galilagroup.com'
const root = path.resolve(import.meta.dirname, '..')
const dir = path.join(root, 'seo', 'metrics')
const today = new Date().toISOString().slice(0, 10)
const withLighthouse = !process.argv.includes('--no-lighthouse')

// גרסה קבועה של Lighthouse ומספר הרצות קבוע, כדי שהציונים יהיו בני השוואה בין חודשים.
// הציון הוא החציון של ההרצות (הרצה בודדת יכולה לזוז בכמה נקודות).
const LIGHTHOUSE_VERSION = '12'
const LIGHTHOUSE_RUNS = 3
// עמודי המפתח למדידת מהירות (כתובות באנגלית בלבד – הן עוברות דרך שורת הפקודה)
const LIGHTHOUSE_PAGES = [
  { page: 'home', url: `${SITE}/` },
  { page: 'blog', url: `${SITE}/autism-blog-parents/` },
  { page: 'post', url: `${SITE}/pda-profile-autism-guide/` },
]

await mkdir(dir, { recursive: true })

// ---------- CSV: שורה אחת לכל מפתח (תאריך / תאריך+עמוד); הרצה חוזרת באותו יום מחליפה את השורה
async function readRows(file) {
  const full = path.join(dir, file)
  if (!existsSync(full)) return []
  const [head, ...lines] = (await readFile(full, 'utf8')).replace(/^﻿/, '').trim().split(/\r?\n/)
  const keys = head.split(',')
  return lines.filter(Boolean).map((line) => Object.fromEntries(line.split(',').map((value, i) => [keys[i], value])))
}
async function upsertRows(file, header, rows, keyFields) {
  const key = (row) => keyFields.map((k) => row[k]).join('|')
  const fresh = new Set(rows.map(key))
  const all = [...(await readRows(file)).filter((row) => !fresh.has(key(row))), ...rows]
  all.sort((a, b) => key(a).localeCompare(key(b)))
  // BOM בתחילת הקובץ כדי ש-Excel יציג עברית נכון; פסיקים בתוך ערכים מוחלפים כדי לא לשבור עמודות
  const cell = (value) => String(value ?? '').replace(/,/g, ';')
  await writeFile(path.join(dir, file), '﻿' + [header.join(','), ...all.map((row) => header.map((k) => cell(row[k])).join(','))].join('\n') + '\n')
  return all
}

// ---------- 1. בריאות טכנית של כל עמוד במפת האתר
const decodeEntities = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x27;/g, "'")
const pagePath = (url) => decodeURIComponent(new URL(url).pathname)

function analyze(url, status, html) {
  const pick = (re) => (html.match(re) || [])[1] ?? ''
  const title = decodeEntities(pick(/<title>([\s\S]*?)<\/title>/))
  const description = decodeEntities(pick(/<meta name="description" content="([^"]*)"/))
  const canonical = pick(/<link rel="canonical" href="([^"]*)"/)
  const h1 = (html.match(/<h1[\s>]/g) || []).length
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    try {
      return [].concat(JSON.parse(m[1])['@type'])
    } catch {
      return ['INVALID']
    }
  })
  const images = html.match(/<img\b[^>]*>/g) || []
  const imagesNoAlt = images.filter((tag) => !/\balt=/.test(tag)).length
  const body = html.slice(Math.max(0, html.indexOf('<div id="root">')))
  const words = body.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  const internalLinks = (body.match(/<a\b[^>]*href="\/[^"#][^"]*"/g) || []).length

  const issues = []
  if (status !== 200) issues.push(`סטטוס ${status}`)
  if (!title) issues.push('אין כותרת עמוד (title)')
  else if (title.length > 65) issues.push(`כותרת עמוד ארוכה: ${title.length} תווים (מומלץ עד 60)`)
  if (!description) issues.push('אין תיאור (meta description)')
  else if (description.length > 165) issues.push(`תיאור ארוך: ${description.length} תווים (מומלץ עד 160)`)
  else if (description.length < 50) issues.push(`תיאור קצר: ${description.length} תווים`)
  if (canonical !== url) issues.push('כתובת canonical לא תואמת לכתובת העמוד')
  if (h1 !== 1) issues.push(`${h1} כותרות H1 (צריכה להיות אחת)`)
  if (!jsonLd.length) issues.push('אין נתונים מובנים (schema.org)')
  if (jsonLd.includes('INVALID')) issues.push('נתונים מובנים לא תקינים')
  if (imagesNoAlt) issues.push(`${imagesNoAlt} תמונות בלי מאפיין alt`)
  if (words < 200) issues.push(`מעט טקסט: ${words} מילים`)
  return { path: pagePath(url), status, titleLength: title.length, descriptionLength: description.length, h1, jsonLd, words, internalLinks, htmlKB: Math.round(html.length / 1024), issues }
}

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text()
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const pages = []
for (const url of urls) {
  const res = await fetch(url)
  pages.push(analyze(url, res.status, await res.text()))
}

// ---------- 2. התנהגות השרת
const probe = async (url) => {
  try {
    const res = await fetch(url, { redirect: 'manual' })
    return { status: res.status, location: res.headers.get('location') ?? '', robots: res.headers.get('x-robots-tag') ?? '' }
  } catch (error) {
    return { status: `ERR ${error.message}`, location: '', robots: '' }
  }
}
const apex = await probe('https://galilagroup.com/')
const plainHttp = await probe('http://www.galilagroup.com/')
const unknown = await probe(`${SITE}/seo-check-this-page-does-not-exist/`)
const oldUrl = await probe(SITE + encodeURI('/בלוג/'))
const spam = await probe(`${SITE}/playing-games/1-casino-in-uk.html`)
const files = Object.fromEntries(await Promise.all(['robots.txt', 'sitemap.xml', 'llms.txt'].map(async (f) => [f, (await probe(`${SITE}/${f}`)).status])))

const withIssues = pages.filter((p) => p.issues.length)
const healthRow = {
  date: today,
  pages_in_sitemap: pages.length,
  pages_without_issues: pages.length - withIssues.length,
  issues_total: pages.reduce((sum, p) => sum + p.issues.length, 0),
  pages_with_structured_data: pages.filter((p) => p.jsonLd.length).length,
  avg_words: Math.round(pages.reduce((sum, p) => sum + p.words, 0) / pages.length),
  unknown_url_status: unknown.status, // רצוי 404; 200 נקרא "404 רך" ומבלבל את גוגל
  old_url_status: oldUrl.status, // רצוי 301/308 (הפניה אמיתית מהשרת); 200 = הפניה רק בדפדפן
  spam_url_status: spam.status,
  spam_url_noindex: spam.robots.includes('noindex') ? 'yes' : 'no',
  apex_redirect: apex.status,
  http_redirect: plainHttp.status,
  robots_txt: files['robots.txt'],
  sitemap_xml: files['sitemap.xml'],
  llms_txt: files['llms.txt'],
}
const healthHeader = Object.keys(healthRow)
const healthHistory = await upsertRows('site-health.csv', healthHeader, [healthRow], ['date'])

await writeFile(
  path.join(dir, 'issues-latest.md'),
  [
    `# בעיות טכניות פתוחות – ${today}`,
    '',
    `נבדקו ${pages.length} עמודים ממפת האתר. ${withIssues.length ? `ב-${withIssues.length} מהם נמצאו בעיות:` : 'לא נמצאו בעיות.'}`,
    '',
    ...withIssues.flatMap((p) => [`## ${p.path}`, '', ...p.issues.map((issue) => `- ${issue}`), '']),
    '## שרת',
    '',
    `- כתובת שלא קיימת מחזירה סטטוס ${unknown.status} (רצוי 404)`,
    `- כתובת ישנה (/בלוג/) מחזירה סטטוס ${oldUrl.status} (רצוי 301 או 308)`,
    `- עמוד ספאם ישן מחזיר סטטוס ${spam.status}, noindex: ${healthRow.spam_url_noindex}`,
    '',
  ].join('\n'),
)

// ---------- 3. Lighthouse (נייד)
function lighthouse(url) {
  const out = path.join(os.tmpdir(), `galila-lighthouse-${Date.now()}.json`)
  const command = `npx --yes lighthouse@${LIGHTHOUSE_VERSION} ${url} --output=json --output-path="${out}" --quiet --chrome-flags="--headless=new" --only-categories=performance,seo,accessibility,best-practices`
  spawnSync(command, { shell: true, stdio: 'ignore', timeout: 240000 })
  if (!existsSync(out)) return null
  const report = JSON.parse(readFileSync(out, 'utf8'))
  rmSync(out)
  const score = (id) => Math.round((report.categories[id]?.score ?? 0) * 100)
  const audit = (id) => report.audits[id]?.numericValue ?? 0
  return {
    performance: score('performance'),
    seo: score('seo'),
    accessibility: score('accessibility'),
    best_practices: score('best-practices'),
    lcp_s: (audit('largest-contentful-paint') / 1000).toFixed(1),
    fcp_s: (audit('first-contentful-paint') / 1000).toFixed(1),
    cls: audit('cumulative-layout-shift').toFixed(3),
    tbt_ms: Math.round(audit('total-blocking-time')),
    page_weight_kb: Math.round(audit('total-byte-weight') / 1024),
    lighthouse_version: report.lighthouseVersion,
  }
}

const lighthouseHeader = ['date', 'page', 'performance', 'seo', 'accessibility', 'best_practices', 'lcp_s', 'fcp_s', 'cls', 'tbt_ms', 'page_weight_kb', 'runs', 'lighthouse_version']
let lighthouseHistory = await readRows('lighthouse.csv')
if (withLighthouse) {
  const rows = []
  for (const { page, url } of LIGHTHOUSE_PAGES) {
    const runs = []
    for (let i = 0; i < LIGHTHOUSE_RUNS; i++) {
      const result = lighthouse(url)
      if (result) runs.push(result)
      console.log(`lighthouse ${page} ${i + 1}/${LIGHTHOUSE_RUNS}: ${result ? result.performance : 'failed'}`)
    }
    if (!runs.length) continue
    runs.sort((a, b) => a.performance - b.performance)
    rows.push({ date: today, page, ...runs[Math.floor(runs.length / 2)], runs: runs.length })
  }
  if (rows.length) lighthouseHistory = await upsertRows('lighthouse.csv', lighthouseHeader, rows, ['date', 'page'])
  else console.log('Lighthouse לא רץ (נדרש Chrome מותקן). הבדיקות הטכניות נשמרו.')
}

// ---------- 4. Google Search Console (אופציונלי, אוטומטי)
// רץ רק אם קיים קובץ מפתח של חשבון שירות ב-seo/secrets/gsc-service-account.json (התיקייה לא נכנסת ל-Git),
// ואם כתובת המייל של חשבון השירות נוספה כמשתמש בנכס sc-domain:galilagroup.com ב-Search Console.
// בלי הקובץ, את אותם מספרים אפשר להעתיק ידנית מ-Search Console לקובץ search-console.csv.
const GSC_PROPERTY = 'sc-domain:galilagroup.com'
const gscKeyFile = path.join(root, 'seo', 'secrets', 'gsc-service-account.json')
const gscHeader = ['date', 'clicks_28d', 'impressions_28d', 'ctr_percent', 'avg_position', 'queries_in_top10', 'pages_indexed', 'pages_checked', 'spam_impressions_28d', 'spam_clicks_28d']

async function googleToken(key) {
  const now = Math.floor(Date.now() / 1000)
  const part = (object) => Buffer.from(JSON.stringify(object)).toString('base64url')
  const claims = { iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }
  const unsigned = `${part({ alg: 'RS256', typ: 'JWT' })}.${part(claims)}`
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url')
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` }),
  })
  const json = await res.json()
  if (!json.access_token) throw new Error(`Google sign-in failed: ${JSON.stringify(json)}`)
  return json.access_token
}

async function searchConsole() {
  const token = await googleToken(JSON.parse(await readFile(gscKeyFile, 'utf8')))
  const post = async (url, body) => {
    const res = await fetch(url, { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) })
    const json = await res.json()
    if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json.error?.message ?? json)}`)
    return json
  }
  // הנתונים ב-Search Console מתעדכנים באיחור של יומיים-שלושה, ולכן החלון מסתיים לפני 3 ימים
  const day = (offset) => new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10)
  const range = { startDate: day(30), endDate: day(3) }
  const analytics = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_PROPERTY)}/searchAnalytics/query`
  const spamFilter = { dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'contains', expression: '/playing-games/' }] }] }

  const total = (await post(analytics, range)).rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 }
  const spamTotal = (await post(analytics, { ...range, ...spamFilter })).rows?.[0] ?? { clicks: 0, impressions: 0 }
  const queries = (await post(analytics, { ...range, dimensions: ['query'], rowLimit: 250 })).rows ?? []

  // כמה מעמודי מפת האתר נמצאים באינדקס של גוגל
  let indexed = 0
  for (const url of urls) {
    const result = await post('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', { inspectionUrl: url, siteUrl: GSC_PROPERTY, languageCode: 'he' })
    if (result.inspectionResult?.indexStatusResult?.verdict === 'PASS') indexed++
  }

  await writeFile(
    path.join(dir, 'gsc-queries-latest.md'),
    [
      `# שאילתות החיפוש המובילות – ${range.startDate} עד ${range.endDate}`,
      '',
      '| שאילתה | קליקים | חשיפות | מיקום ממוצע |',
      '| --- | --- | --- | --- |',
      ...queries.slice(0, 50).map((row) => `| ${row.keys[0].replace(/\|/g, ' ')} | ${row.clicks} | ${row.impressions} | ${row.position.toFixed(1)} |`),
      '',
    ].join('\n'),
  )
  return {
    date: today,
    clicks_28d: total.clicks,
    impressions_28d: total.impressions,
    ctr_percent: (total.ctr * 100).toFixed(1),
    avg_position: total.position.toFixed(1),
    queries_in_top10: queries.filter((row) => row.position <= 10).length,
    pages_indexed: indexed,
    pages_checked: urls.length,
    spam_impressions_28d: spamTotal.impressions,
    spam_clicks_28d: spamTotal.clicks,
  }
}

if (!existsSync(path.join(dir, 'search-console.csv'))) await upsertRows('search-console.csv', gscHeader, [], ['date'])
if (existsSync(gscKeyFile)) {
  try {
    await upsertRows('search-console.csv', gscHeader, [await searchConsole()], ['date'])
    console.log('Search Console: נתונים נשמרו')
  } catch (error) {
    console.log(`Search Console: המשיכה נכשלה – ${error.message}`)
  }
} else console.log('Search Console: אין קובץ מפתח, מדלגים (אפשר להזין את המספרים ידנית ב-search-console.csv)')
const gscHistory = await readRows('search-console.csv')

// ---------- נתונים ידניים: הקובץ נוצר פעם אחת, והשורות מתווספות בבדיקה החודשית
const manualHeader = ['date', 'visitors_30d', 'ai_referral_visits_30d', 'ai_answers_mentioning_galila', 'leads_from_site_30d', 'notes']
if (!existsSync(path.join(dir, 'manual.csv'))) await upsertRows('manual.csv', manualHeader, [], ['date'])
const manualHistory = await readRows('manual.csv')

// ---------- דוח מסכם: טבלאות לאורך זמן
const table = (columns, rows) =>
  rows.length
    ? [`| ${columns.map((c) => c[1]).join(' | ')} |`, `| ${columns.map(() => '---').join(' | ')} |`, ...rows.map((row) => `| ${columns.map((c) => row[c[0]] || '–').join(' | ')} |`)].join('\n')
    : '_עדיין אין נתונים._'
const lighthouseColumns = [
  ['date', 'תאריך'],
  ['performance', 'ביצועים'],
  ['seo', 'SEO'],
  ['accessibility', 'נגישות'],
  ['best_practices', 'שיטות עבודה'],
  ['lcp_s', 'LCP (שניות)'],
  ['fcp_s', 'FCP (שניות)'],
  ['cls', 'CLS'],
  ['tbt_ms', 'TBT (מ"ש)'],
  ['page_weight_kb', 'משקל (KB)'],
]
const pageNames = { home: 'עמוד הבית', blog: 'עמוד הבלוג', post: 'כתבה (פרופיל PDA)' }

await writeFile(
  path.join(root, 'seo', 'REPORT.md'),
  [
    '# דוח מעקב SEO – גלילה',
    '',
    `עודכן לאחרונה: ${today}. הקובץ נוצר אוטומטית על ידי \`npm run seo:snapshot\`; לא לערוך ידנית.`,
    'התוכנית עצמה נמצאת ב-[PLAN.md](PLAN.md), והבעיות הפתוחות ב-[metrics/issues-latest.md](metrics/issues-latest.md).',
    '',
    '## 1. גוגל (Search Console)',
    '',
    'כל שורה מסכמת 28 יום. "ספאם" הם עמודי ההימורים שנשארו בגוגל מהפריצה לאתר הישן; המספר אמור לרדת לאפס. הנתונים ב-`metrics/search-console.csv`.',
    '',
    table(
      [
        ['date', 'תאריך'],
        ['clicks_28d', 'קליקים'],
        ['impressions_28d', 'חשיפות'],
        ['ctr_percent', 'אחוז הקלקה'],
        ['avg_position', 'מיקום ממוצע'],
        ['queries_in_top10', 'שאילתות בעשירייה הראשונה'],
        ['pages_indexed', 'עמודים באינדקס'],
        ['pages_checked', 'מתוך'],
        ['spam_impressions_28d', 'חשיפות של ספאם'],
      ],
      gscHistory,
    ),
    '',
    '## 2. תנועה, בינה מלאכותית ופניות',
    '',
    'המקור: Vercel Analytics, בדיקת שאלות חודשית בעוזרי בינה מלאכותית, וספירת פניות. נרשם ידנית ב-`metrics/manual.csv`.',
    '',
    table(
      [
        ['date', 'תאריך'],
        ['visitors_30d', 'מבקרים (30 יום)'],
        ['ai_referral_visits_30d', 'כניסות מבינה מלאכותית'],
        ['ai_answers_mentioning_galila', 'תשובות AI שמזכירות את גלילה'],
        ['leads_from_site_30d', 'פניות מהאתר'],
        ['notes', 'הערות'],
      ],
      manualHistory,
    ),
    '',
    '## 3. מהירות ואיכות (Lighthouse, נייד)',
    '',
    `ציונים מ-0 עד 100, גבוה יותר טוב יותר. LCP הוא הזמן עד שהתוכן המרכזי מופיע (טוב: עד 2.5 שניות). כל ערך הוא חציון של ${LIGHTHOUSE_RUNS} הרצות מאותו מחשב; הפרש של 3–5 נקודות בין מדידות הוא רעש רגיל.`,
    '',
    ...Object.entries(pageNames).flatMap(([page, name]) => [`### ${name}`, '', table(lighthouseColumns, lighthouseHistory.filter((row) => row.page === page)), '']),
    '## 4. בריאות טכנית',
    '',
    table(
      [
        ['date', 'תאריך'],
        ['pages_in_sitemap', 'עמודים במפת האתר'],
        ['pages_without_issues', 'עמודים בלי בעיות'],
        ['issues_total', 'סה"כ בעיות'],
        ['pages_with_structured_data', 'עמודים עם נתונים מובנים'],
        ['avg_words', 'מילים בממוצע לעמוד'],
        ['unknown_url_status', 'סטטוס לכתובת שלא קיימת'],
        ['old_url_status', 'סטטוס לכתובת ישנה'],
        ['spam_url_noindex', 'ספאם מסומן noindex'],
      ],
      healthHistory,
    ),
    '',
  ].join('\n'),
)

console.log(`\n${today}: ${pages.length} pages, ${withIssues.length} with issues (${healthRow.issues_total} issues).`)
console.log(`unknown URL -> ${unknown.status}, old URL -> ${oldUrl.status}, spam -> ${spam.status} noindex=${healthRow.spam_url_noindex}, apex -> ${apex.status}`)
for (const row of lighthouseHistory.filter((r) => r.date === today)) console.log(`lighthouse ${row.page}: perf ${row.performance}, seo ${row.seo}, a11y ${row.accessibility}, LCP ${row.lcp_s}s, CLS ${row.cls}`)
