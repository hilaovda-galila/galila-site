// יוצר קובץ HTML מוכן לכל עמוד (טוב ל-SEO ולטעינה מהירה), וגם sitemap.xml.
// רץ אחרי vite build ו-vite build --ssr (ראו "build" ב-package.json).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const serverDir = path.join(root, 'dist-server')

const { render, pageList, site } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href)
const template = await readFile(path.join(dist, 'index.html'), 'utf8')

const escape = (s = '') => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const absolute = (p) => site.url + encodeURI(p)

// המעטפת הריקה משמשת כתובות שלא נוצר להן עמוד מראש (הפניות ישנות, 404)
await writeFile(path.join(dist, 'spa.html'), template)

for (const page of pageList) {
  const head = [
    `<title>${escape(page.title)}</title>`,
    `<meta name="description" content="${escape(page.description)}" />`,
    `<link rel="canonical" href="${absolute(page.path)}" />`,
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    `<meta property="og:url" content="${absolute(page.path)}" />`,
    page.image ? `<meta property="og:image" content="${site.url}${page.image}" />` : '',
  ]
    .filter(Boolean)
    .join('\n    ')

  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, head)
    .replace('<div id="root"></div>', `<div id="root">${render(page.path)}</div>`)

  const dir = path.join(dist, ...page.path.split('/').filter(Boolean))
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), html)
}

const urls = pageList.map((p) => `  <url><loc>${absolute(p.path)}</loc></url>`).join('\n')
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)

await rm(serverDir, { recursive: true, force: true })
console.log(`Prerendered ${pageList.length} pages`)
