// שומר באתר עצמו את תמונת הפתיחה של סרטון ההיכרות שבראש עמוד הבית, בשני גדלים (נייד ומחשב).
// תמונה מקומית נטענת מהר יותר מתמונה של יוטיוב, והיא מה שגוגל מודד כ"תוכן המרכזי" של העמוד (LCP).
// להריץ שוב אם מחליפים את הסרטון: node scripts/banner-thumbnail.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const id = (await readFile(path.join(root, 'src', 'config', 'site.ts'), 'utf8')).match(/introVideo = \{ id: '([\w-]+)'/)[1]
const res = await fetch(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)
if (!res.ok) throw new Error(`thumbnail download failed: ${res.status}`)
const input = Buffer.from(await res.arrayBuffer())
const dir = path.join(root, 'public', 'images', 'banner')
await mkdir(dir, { recursive: true })
for (const width of [640, 1280]) {
  const output = await sharp(input).resize({ width }).jpeg({ quality: 72, mozjpeg: true }).toBuffer()
  await writeFile(path.join(dir, `intro-video-${width}.jpg`), output)
  console.log(`intro-video-${width}.jpg ${Math.round(output.length / 1024)}KB`)
}
