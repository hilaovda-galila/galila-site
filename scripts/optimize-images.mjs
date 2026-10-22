// מקטין את התמונות שב-public/images כדי שהאתר ייטען מהר: מגביל את הרוחב/גובה ודוחס מחדש.
// שם הקובץ והסוג נשארים, כך ש-src/content/images.json לא משתנה. קובץ מוחלף רק אם התוצאה קטנה יותר.
// בנוסף נוצרות לכל תמונה גרסאות ברוחב 640 ו-1024 (קובץ בשם <שם>-640w.jpg), ונכתב
// src/content/image-meta.json עם המידות – כך הטלפון מוריד רק את הגודל שהוא צריך (ראו Img.tsx).
// הרצה: node scripts/optimize-images.mjs   (חובה להריץ שוב אחרי שמוסיפים תמונות)
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const dir = path.join(root, 'public', 'images')

// הגודל המרבי בפיקסלים לצלע הארוכה; הלוגו מוצג קטן ולכן מספיק לו פחות
const MAX = 1600
const maxFor = (name) => (name.includes('600-pix') || name.includes('לוגו') ? 900 : MAX)

async function optimize(file, max) {
  const input = await readFile(file)
  // תמונה שכבר הוקטנה ונדחסה לא נדחסת שוב (כל דחיסה חוזרת מורידה מעט מהאיכות)
  const { width = 0, height = 0 } = await sharp(input).metadata()
  if (Math.max(width, height) <= max && input.length / (width * height) < 0.3) return null
  const image = sharp(input, { failOn: 'none' }).rotate().resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
  const ext = path.extname(file).toLowerCase()
  const output =
    ext === '.png'
      ? await image.png({ palette: true, quality: 85, compressionLevel: 9 }).toBuffer()
      : await image.jpeg({ quality: 78, mozjpeg: true }).toBuffer()
  if (output.length >= input.length * 0.95) return null
  await writeFile(file, output)
  return [input.length, output.length]
}

const VARIANT_WIDTHS = [640, 1024]
const isVariant = (name) => /-\d+w\.\w+$/.test(name)

let before = 0
let after = 0
// תמונות הבאנר כבר נשמרות בגדלים מוכנים (scripts/banner-thumbnail.mjs)
const files = (await readdir(dir, { recursive: true, withFileTypes: true })).filter(
  (d) => d.isFile() && /\.(png|jpe?g)$/i.test(d.name) && !isVariant(d.name) && !d.parentPath.includes(`${path.sep}banner`),
)
for (const d of files) {
  const file = path.join(d.parentPath, d.name)
  const result = await optimize(file, maxFor(d.name))
  if (!result) continue
  before += result[0]
  after += result[1]
  console.log(`${String(Math.round(result[0] / 1024)).padStart(5)} KB -> ${String(Math.round(result[1] / 1024)).padStart(4)} KB  ${path.relative(dir, file)}`)
}

// גרסאות מוקטנות ומידות של כל תמונה
const meta = {}
for (const d of files) {
  const file = path.join(d.parentPath, d.name)
  const input = await readFile(file)
  const { width, height } = await sharp(input).metadata()
  const ext = path.extname(d.name)
  const variants = []
  for (const w of VARIANT_WIDTHS) {
    // גרסה קטנה נוצרת רק אם המקור רחב ממנה בצורה משמעותית
    if (width < w * 1.15) continue
    const resized = sharp(input).resize({ width: w })
    const output = ext.toLowerCase() === '.png' ? await resized.png({ palette: true, quality: 85, compressionLevel: 9 }).toBuffer() : await resized.jpeg({ quality: 76, mozjpeg: true }).toBuffer()
    await writeFile(path.join(d.parentPath, `${path.basename(d.name, ext)}-${w}w${ext}`), output)
    variants.push(w)
  }
  const publicPath = '/images/' + path.relative(dir, file).split(path.sep).join('/')
  meta[publicPath] = { w: width, h: height, variants }
}
await writeFile(path.join(root, 'src', 'content', 'image-meta.json'), JSON.stringify(Object.fromEntries(Object.entries(meta).sort()), null, 2) + '\n')
console.log(`variants: ${Object.values(meta).reduce((n, m) => n + m.variants.length, 0)} files for ${files.length} images`)

// סמל האתר (favicon) נוצר מהלוגו בגודל קטן
const logo = path.join(dir, '2024', '12', 'גלילה-600-pix.png')
const favicon = await sharp(await readFile(logo)).resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ palette: true, compressionLevel: 9 }).toBuffer()
await writeFile(path.join(root, 'public', 'favicon.png'), favicon)

console.log(`\nimages: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB; favicon: ${Math.round(favicon.length / 1024)} KB`)
