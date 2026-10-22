// יוצר קובץ HTML מוכן לכל עמוד (טוב ל-SEO ולטעינה מהירה), וגם sitemap.xml.
// רץ אחרי vite build ו-vite build --ssr (ראו "build" ב-package.json).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const serverDir = path.join(root, 'dist-server')

const { render, pageList, site, redirects } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href)
const template = await readFile(path.join(dist, 'index.html'), 'utf8')

const escape = (s = '') => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const absolute = (p) => site.url + encodeURI(p)

// כל הפניה מ-src/config/site.ts חייבת להופיע גם ב-vercel.json, שם היא הפניה אמיתית מהשרת (301)
const vercelConfig = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'))
const serverRedirects = new Set((vercelConfig.redirects ?? []).map((r) => decodeURI(r.source)))
const missing = Object.keys(redirects).filter((from) => !serverRedirects.has(from))
if (missing.length) {
  console.error(`vercel.json חסרות הפניות עבור: ${missing.join(', ')}`)
  process.exit(1)
}

// מעטפת ריקה לאחסון Apache (.htaccess); ב-Vercel כתובת שלא קיימת מקבלת את 404.html עם סטטוס 404
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
    `<meta name="twitter:card" content="${page.image ? 'summary_large_image' : 'summary'}" />`,
    page.private ? '<meta name="robots" content="noindex" />' : '',
    // נתונים מובנים: "<" מוחלף כדי שהטקסט לא יוכל לסגור את תגית הסקריפט
    ...(page.jsonLd ?? []).map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`),
  ]
    .filter(Boolean)
    .join('\n    ')

  // פונקציות החלפה, כדי שסימן $ בתוכן לא יפורש כהוראת החלפה
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, () => head)
    .replace('<div id="root"></div>', () => `<div id="root">${render(page.path)}</div>`)

  const dir = path.join(dist, ...page.path.split('/').filter(Boolean))
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), html)
}

// עמוד "לא נמצא": Vercel מגיש אותו לכל כתובת שלא קיימת, עם סטטוס 404 אמיתי (ולא "תקין"), כך שגוגל
// מבין שהעמוד לא קיים – חשוב במיוחד לעמודי הספאם שנשארו בגוגל מהפריצה לאתר הישן
const notFoundHtml = template
  .replace(/<title>[\s\S]*?<\/title>/, () => `<title>העמוד לא נמצא | גלילה</title>\n    <meta name="robots" content="noindex" />`)
  .replace('<div id="root"></div>', () => `<div id="root">${render('/this-page-does-not-exist/')}</div>`)
await writeFile(path.join(dist, '404.html'), notFoundHtml)

const urls = pageList.filter((p) => !p.private).map((p) => `  <url><loc>${absolute(p.path)}</loc></url>`).join('\n')
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)

// llms.txt: תקציר קריא של האתר לעוזרי בינה מלאכותית – מי אנחנו, פרטי קשר ורשימת העמודים עם תיאור
const publicPages = pageList.filter((p) => !p.private)
const isPost = (p) => p.jsonLd?.some((data) => data['@type'] === 'Article')
const line = (p) => `- [${p.title}](${absolute(p.path)}): ${p.description}`
const org = pageList[0].jsonLd?.[0]
await writeFile(
  path.join(dist, 'llms.txt'),
  [
    `# ${org?.name ?? site.name}`,
    '',
    `> ${org?.description ?? ''}`,
    '',
    `- אתר: ${site.url}/`,
    `- טלפון: ${site.phoneDisplay}`,
    `- אימייל: ${site.email}`,
    ...(org?.location ?? []).map((place) => `- מיקום: ${place.name} (${place.address.streetAddress}, ${place.address.addressLocality})`),
    '',
    '## עמודים',
    '',
    ...publicPages.filter((p) => !isPost(p)).map(line),
    '',
    '## מאמרים להורים',
    '',
    ...publicPages.filter(isPost).map(line),
    '',
  ].join('\n'),
)

await rm(serverDir, { recursive: true, force: true })
console.log(`Prerendered ${pageList.length} pages`)
