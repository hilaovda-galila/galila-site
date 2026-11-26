import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import LeadForm from '../components/LeadForm'
import { paths } from '../config/site'
import { downloadHref, downloadThumb, downloads } from '../content/downloads'

export const downloadsMeta = {
  title: 'חומרים להורדה בחינם להורים לילדים על הרצף | גלילה',
  description: 'סיפורים חברתיים, לוחות תת״ח, משחקים ומתכונים אורייניים מבית גלילה, להורדה בחינם. משאירים פרטים וכל הקבצים נפתחים.',
}

const STORAGE_KEY = 'galila-downloads-open'

function readUnlocked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export default function Downloads() {
  const [unlocked, setUnlocked] = useState(false)

  // מי שכבר השאיר פרטים בדפדפן הזה לא צריך למלא שוב
  useEffect(() => setUnlocked(readUnlocked()), [])

  function unlock() {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // בלי אחסון בדפדפן ההורדות פשוט ייפתחו רק בביקור הזה
    }
    setUnlocked(true)
  }

  return (
    <Layout title={downloadsMeta.title} contact={false}>
      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <header className="text-center">
          <h1 className="title">חומרים להורדה בחינם</h1>
          <span className="divider mx-auto my-5" />
          <p className="mx-auto max-w-[760px] text-lg">
            סיפורים חברתיים, לוחות תקשורת, משחקים ומתכונים אורייניים שהכנו בגלילה, לשימוש בבית עם הילד. כל הקבצים להדפסה, בחינם.
          </p>
        </header>

        <section aria-labelledby="unlock" className="card mx-auto mt-8 max-w-[760px] p-6 md:p-8">
          {unlocked ? (
            <div className="text-center" role="status">
              <h2 id="unlock" className="text-[26px] leading-tight font-extrabold text-brand md:text-[30px]">
                הקבצים פתוחים להורדה
              </h2>
              <p className="mt-2">תודה! אפשר להוריד את כל הקבצים כאן למטה. כשנעלה חומרים חדשים, נעדכן אתכם.</p>
            </div>
          ) : (
            <>
              <h2 id="unlock" className="text-center text-[26px] leading-tight font-extrabold text-brand md:text-[30px]">
                השאירו פרטים, וכל הקבצים נפתחים
              </h2>
              <LeadForm submitLabel="לפתיחת הקבצים" onDone={unlock} />
            </>
          )}
        </section>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {downloads.map((item) => (
            <li key={item.id} id={item.id} className="card flex scroll-mt-6 flex-col overflow-hidden">
              <div className="flex h-[220px] items-center justify-center bg-sand p-3">
                <img
                  src={downloadThumb(item)}
                  alt={`עמוד ראשון מתוך "${item.title}"`}
                  loading="lazy"
                  className="max-h-full max-w-full rounded shadow-sm"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="mb-2 w-fit rounded-full bg-powder px-3 py-0.5 text-sm font-medium text-brand-deep">{item.tag}</span>
                <h2 className="text-[22px] leading-tight font-extrabold">{item.title}</h2>
                <p className="mt-2 flex-1">{item.description}</p>
                <p className="mt-2 text-sm text-ink/70">PDF · {item.pages === 1 ? 'עמוד אחד' : `${item.pages} עמודים`}</p>
                {unlocked ? (
                  <a href={downloadHref(item)} download={item.saveAs} className="btn mt-4 rounded-lg">
                    הורדה
                  </a>
                ) : (
                  <a href="#unlock" className="btn mt-4 rounded-lg opacity-80">
                    השאירו פרטים להורדה
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center">
          רוצים לשמוע על הקבוצות החברתיות שלנו?{' '}
          <a href={`/#contact`} className="font-medium text-brand-deep underline">
            השאירו פרטים
          </a>{' '}
          או קראו עוד ב<a href={paths.blog} className="font-medium text-brand-deep underline">בלוג</a>.
        </p>
      </div>
    </Layout>
  )
}
