// משחזר תמונות סטוק חסרות של כתבות הבלוג ממקורן (Pexels / Pixabay), לפי המזהה שבשם הקובץ המקורי.
// הרצה: node scripts/restore-stock-images.mjs        (רק מדפיס מה חסר)
//        node scripts/restore-stock-images.mjs --fetch (מוריד ומעדכן את src/content/images.json)
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const manifestFile = path.join(root, 'src', 'content', 'images.json')
const manifest = JSON.parse(await readFile(manifestFile, 'utf8'))
const posts = JSON.parse(await readFile(path.join(root, 'src', 'content', 'posts.json'), 'utf8'))
const missingDoc = await readFile(path.join(root, 'content-archive', 'MISSING-IMAGES.md'), 'utf8')
const doFetch = process.argv.includes('--fetch')

// התיקייה המקורית של כל קובץ חסר (שנה/חודש), מתוך טבלת התמונות החסרות
const dirOf = (key) => missingDoc.match(new RegExp(`\\| ${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\| public/images/([\\d/]+)/`))?.[1] ?? '2026/03'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

// כתובות התמונות ב-Pixabay לפי מזהה (נאספו מעמודי התמונות עצמם; Pixabay חוסם שליפה אוטומטית של העמודים)
const pixabayCdn = {
  1149148: '2016/01/19/15/05/computer-1149148',
  1434056: '2016/06/03/18/32/hug-1434056',
  1554745: '2016/07/29/16/17/animal-1554745',
  1633653: '2016/08/31/14/23/brothers-1633653',
  1635065: '2016/09/01/01/43/little-boy-1635065',
  2626753: '2017/08/10/19/25/girl-2626753',
  3184432: '2018/02/27/00/32/microscope-3184432',
  3997967: '2019/02/15/07/38/mother-3997967',
  4622229: '2019/11/12/23/01/violin-4622229',
  7391611: '2022/08/17/05/57/fist-7391611',
  8256139: '2023/09/16/07/10/ai-generated-8256139',
  8489753: '2024/01/05/16/17/ai-generated-8489753',
  9719573: '2025/07/17/13/57/care-9719573',
}

// תמונות מקוריות שלא ניתן לשחזר (צילומים פרטיים ותמונות שנוצרו ב-AI) – הוחלפו בתמונות
// חופשיות מ-Pexels שנבחרו לפי נושא הכתבה. המפתח הוא שם הקובץ המקורי, הערך הוא מזהה התמונה ב-Pexels.
const replacements = {
  'family_photo.jpg': 9885408, // הורים לילדים עם אוטיזם: חיבוק של אמא וילדה
  'WhatsApp-Image-2025-10-05-at-14.44.28.jpeg': 7301144, // אספרגר: ילד מרוכז במשחק בקוביות
  'ChatGPT-Image-May-11-2025-11_17_33-AM-1.png': 28490731, // תא לחץ: בלון חמצן עם מד לחץ
}

// מחזיר רשימת כתובות לניסיון, מהגדולה לקטנה
function sourceUrls(key) {
  const ext = key.split('.').pop()
  if (replacements[key]) return [`https://images.pexels.com/photos/${replacements[key]}/pexels-photo-${replacements[key]}.jpeg?auto=compress&cs=tinysrgb&w=1600`]
  const pexels = key.match(/^pexels-.*?-(\d{5,})(?:-\d)?\.\w+$/)
  if (pexels) return ['jpeg', 'png'].map((type) => `https://images.pexels.com/photos/${pexels[1]}/pexels-photo-${pexels[1]}.${type}?auto=compress&cs=tinysrgb&w=1600`)
  const pixabay = key.match(/-(\d{6,})_1920\.\w+$/)
  const base = pixabay && pixabayCdn[pixabay[1]]
  if (base) return [`https://cdn.pixabay.com/photo/${base}_1280.${ext}`, `https://cdn.pixabay.com/photo/${base}_640.${ext}`]
  return []
}

for (const post of posts) {
  const keys = [...new Set([post.ogImage, ...post.blocks.filter((b) => b.type === 'image').map((b) => b.image)])].filter(Boolean)
  const missing = keys.filter((k) => !manifest[k])
  console.log(`\n${post.slug}\n  card image: ${post.ogImage} ${manifest[post.ogImage] ? 'OK' : 'MISSING'}\n  missing: ${missing.join(', ') || '-'}`)
  if (!doFetch) continue
  for (const key of missing) {
    try {
      const urls = sourceUrls(key)
      if (!urls.length) {
        console.log(`  - ${key}: no known source`)
        continue
      }
      let res = null
      for (const url of urls) {
        res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://pixabay.com/' } })
        if (res.ok && (res.headers.get('content-type') || '').startsWith('image/')) break
      }
      if (!res.ok || !(res.headers.get('content-type') || '').startsWith('image/')) {
        console.log(`  - ${key}: download failed (${res.status})`)
        continue
      }
      // תמונה חלופית נשמרת בשם משלה, כדי שיהיה ברור שהיא אינה הקובץ המקורי
      const rel = replacements[key] ? `replacements/pexels-${replacements[key]}.jpg` : `${dirOf(key)}/${key}`
      const file = path.join(root, 'public', 'images', rel)
      await mkdir(path.dirname(file), { recursive: true })
      await writeFile(file, Buffer.from(await res.arrayBuffer()))
      manifest[key] = `/images/${rel}`
      console.log(`  + ${key}`)
    } catch (error) {
      console.log(`  - ${key}: ${error.message}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 800))
  }
}

if (doFetch) await writeFile(manifestFile, JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2) + '\n')
