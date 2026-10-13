// מקטין את התמונות שב-public/images כדי שהאתר ייטען מהר: מגביל את הרוחב/גובה ודוחס מחדש.
// שם הקובץ והסוג נשארים, כך ש-src/content/images.json לא משתנה. קובץ מוחלף רק אם התוצאה קטנה יותר.
// הרצה: node scripts/optimize-images.mjs   (אפשר להריץ שוב אחרי שמוסיפים תמונות)
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

let before = 0
let after = 0
const files = (await readdir(dir, { recursive: true, withFileTypes: true })).filter((d) => d.isFile() && /\.(png|jpe?g)$/i.test(d.name))
for (const d of files) {
  const file = path.join(d.parentPath, d.name)
  const result = await optimize(file, maxFor(d.name))
  if (!result) continue
  before += result[0]
  after += result[1]
  console.log(`${String(Math.round(result[0] / 1024)).padStart(5)} KB -> ${String(Math.round(result[1] / 1024)).padStart(4)} KB  ${path.relative(dir, file)}`)
}

// סמל האתר (favicon) נוצר מהלוגו בגודל קטן
const logo = path.join(dir, '2024', '12', 'גלילה-600-pix.png')
const favicon = await sharp(await readFile(logo)).resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ palette: true, compressionLevel: 9 }).toBuffer()
await writeFile(path.join(root, 'public', 'favicon.png'), favicon)

console.log(`\nimages: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB; favicon: ${Math.round(favicon.length / 1024)} KB`)
