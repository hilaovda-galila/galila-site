// העלאת האתר לאחסון ב-JetServer (FTPS). רץ מהמחשב הזה – השרת חוסם חיבורי FTP מחו"ל, ולכן לא מ-GitHub.
// שימוש: npm run deploy (בונה ומעלה). רק קבצים שהשתנו מאז ההעלאה הקודמת עולים
// (הרשימה נשמרת ב-secrets/deploy-manifest.json). קבצים ישנים בשרת לא נמחקים.
// הסיסמה של חשבון ה-FTP: בשורה אחת בקובץ secrets/ftp-password.txt (לא נכנס ל-Git).
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Client } from 'basic-ftp'

const FTP = { host: 'israel69.jetserver.net', user: 'deploy@galilagroup.com' }

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const secrets = path.join(root, 'secrets')
const manifestFile = path.join(secrets, 'deploy-manifest.json')

const password = (await readFile(path.join(secrets, 'ftp-password.txt'), 'utf8').catch(() => '')).trim()
if (!password) {
  console.error('חסרה הסיסמה של חשבון ה-FTP בקובץ secrets/ftp-password.txt')
  process.exit(1)
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? listFiles(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  )
  return files.flat()
}

const previous = JSON.parse(await readFile(manifestFile, 'utf8').catch(() => '{}'))
const current = {}
const changed = []
for (const file of await listFiles(dist)) {
  const rel = path.relative(dist, file).split(path.sep).join('/')
  current[rel] = createHash('sha1').update(await readFile(file)).digest('hex')
  if (previous[rel] !== current[rel]) changed.push(rel)
}
// ה-.htaccess הראשי עולה אחרון, כדי שההפניות החדשות לא יפעלו לפני שהעמודים שהן מפנות אליהם בשרת
changed.sort((a, b) => (a === '.htaccess') - (b === '.htaccess'))

if (!changed.length) {
  console.log('אין שינויים להעלות')
  process.exit(0)
}

const client = new Client(60_000)
try {
  await client.access({ ...FTP, password, secure: true })
  for (const rel of changed) {
    const dir = path.posix.dirname(rel)
    await client.ensureDir(dir === '.' ? '/' : '/' + dir)
    await client.uploadFrom(path.join(dist, rel), '/' + rel)
    console.log('↑', rel)
  }
} finally {
  client.close()
}

await writeFile(manifestFile, JSON.stringify(current, null, 2))
console.log(`הועלו ${changed.length} קבצים`)
