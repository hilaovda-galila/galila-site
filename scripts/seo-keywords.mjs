// מחקר מילות מפתח מהשלמות אוטומטיות: אילו ביטויים גוגל, יוטיוב ובינג מציעים כשמתחילים להקליד
// ביטויים בנושא קבוצות חברתיות וכישורים חברתיים לילדים על הרצף. ההשלמות מסודרות לפי פופולריות,
// כך שביטוי שמופיע גבוה ובהרבה חיפושים הוא כנראה ביטוי שמחפשים יותר.
// זה לא נפח חיפוש מדויק (אותו רק Google Ads ו-Search Console נותנים), אלא סימן יחסי.
//
//   node scripts/seo-keywords.mjs   → seo/keywords/autocomplete-<תאריך>.csv
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const today = new Date().toISOString().slice(0, 10)
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

// ביטויי פתיחה. כל אחד נשלח כמו שהוא, ובגוגל גם עם כל אות בסופו ("קבוצה חברתית א", "קבוצה חברתית ב"...)
const SEEDS = [
  'קבוצה חברתית',
  'קבוצה חברתית לילדים',
  'קבוצות חברתיות לילדים',
  'קבוצה חברתית לילדים על הרצף',
  'קבוצה חברתית לילדים עם אוטיזם',
  'קבוצה חברתית לילדים על הספקטרום',
  'קבוצה חברתית טיפולית',
  'קבוצה חברתית חיפה',
  'קבוצה חברתית תל אביב',
  'קבוצה חברתית לילדים בחיפה',
  'קבוצה חברתית לילדים בתל אביב',
  'קבוצה חברתית קריות',
  'קבוצה חברתית רמת גן',
  'קבוצה חברתית גיל הגן',
  'קבוצת כישורים חברתיים',
  'קבוצת מיומנויות חברתיות',
  'כישורים חברתיים לילדים',
  'כישורים חברתיים לילדים על הרצף',
  'כישורים חברתיים אוטיזם',
  'מיומנויות חברתיות לילדים',
  'מיומנויות חברתיות אוטיזם',
  'קבוצות לילדים על הרצף',
  'ילדים על הרצף',
  'ילדים על הספקטרום',
  'אוטיזם בתפקוד גבוה',
  'אוטיזם ילדים',
  'אספרגר ילדים',
  'ASD ילדים',
  'טיפול קבוצתי לילדים',
  'טיפול רגשי קבוצתי',
  'טיפול באוטיזם חיפה',
  'טיפול באוטיזם תל אביב',
  'חוג לילדים על הרצף',
  'חוג חברתי לילדים',
  'הדרכת הורים אוטיזם',
  'ניתוח התנהגות ABA',
  'ילד בלי חברים',
  'ילד מתקשה חברתית',
  'קשיים חברתיים אצל ילדים',
  'איך לעזור לילד להכיר חברים',
  'קבוצה חברתית מכבי',
  'קבוצה חברתית כללית',
  'סל אוטיזם',
  'גן תקשורת',
]
const LETTERS = 'אבגדהוזחטיכלמנסעפצקרשת'.split('')
// ביטויים שמסמנים שהשלמה קשורה לנושא האתר
const RELEVANT = /רצף|אוטיז|אוטיסט|ספקטרום|asd|חברתי|כישורי|מיומנו|אספרגר|תקשורת|קבוצ|הדרכת הורים|aba|ניתוח התנהגות|חברים/i

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function getJson(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } })
      if (res.ok) return await res.json()
      if (res.status === 429) await sleep(5000 * (attempt + 1))
      else return null
    } catch {
      await sleep(2000)
    }
  }
  return null
}
const google = async (q, ds = '') =>
  (await getJson(`https://suggestqueries.google.com/complete/search?client=firefox&hl=he&gl=il&ie=UTF-8&oe=UTF-8${ds ? `&ds=${ds}` : ''}&q=${encodeURIComponent(q)}`))?.[1] ?? []
const bing = async (q) => (await getJson(`https://api.bing.com/osjson.aspx?market=he-IL&query=${encodeURIComponent(q)}`))?.[1] ?? []

const found = new Map()
function add(list, source, seed) {
  list.forEach((raw, i) => {
    const keyword = String(raw).trim().replace(/\s+/g, ' ')
    if (!keyword) return
    const entry = found.get(keyword) ?? { keyword, score: 0, occurrences: 0, sources: new Set(), seeds: new Set() }
    entry.score += Math.max(1, 10 - i) // השלמה ראשונה ברשימה שווה יותר
    entry.occurrences++
    entry.sources.add(source)
    entry.seeds.add(seed)
    found.set(keyword, entry)
  })
}

let requests = 0
for (const seed of SEEDS) {
  add(await google(seed), 'google', seed)
  add(await google(seed, 'yt'), 'youtube', seed)
  add(await bing(seed), 'bing', seed)
  requests += 3
  for (const letter of LETTERS) {
    add(await google(`${seed} ${letter}`), 'google', seed)
    requests++
    await sleep(120)
  }
  console.log(`${seed}: ${found.size} unique so far`)
}

const rows = [...found.values()]
  .map((e) => ({ ...e, relevant: RELEVANT.test(e.keyword), sources: [...e.sources].join('+'), seeds: e.seeds.size }))
  .sort((a, b) => b.score - a.score)
await mkdir(path.join(root, 'seo', 'keywords'), { recursive: true })
const cell = (v) => String(v).replace(/,/g, ' ')
await writeFile(
  path.join(root, 'seo', 'keywords', `autocomplete-${today}.csv`),
  '﻿' + ['keyword,score,occurrences,seed_phrases,sources,relevant', ...rows.map((r) => [cell(r.keyword), r.score, r.occurrences, r.seeds, r.sources, r.relevant ? 'yes' : 'no'].join(','))].join('\n') + '\n',
)
console.log(`\n${requests} requests, ${rows.length} unique suggestions, ${rows.filter((r) => r.relevant).length} relevant`)
