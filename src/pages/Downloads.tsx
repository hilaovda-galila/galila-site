import { useEffect, useState, type FormEvent } from 'react'
import Layout from '../components/Layout'
import { paths, site } from '../config/site'
import { downloadHref, downloadThumb, downloads } from '../content/downloads'

export const downloadsMeta = {
  title: 'חומרים להורדה בחינם להורים לילדים על הרצף | גלילה',
  description: 'סיפורים חברתיים, לוחות תת״ח, משחקים ומתכונים אורייניים מבית גלילה, להורדה בחינם. משאירים פרטים וכל הקבצים נפתחים.',
}

// הנוסח שההורה מאשר. נשמר בגיליון יחד עם הפרטים, כתיעוד למה בדיוק ניתנה ההסכמה.
const CONSENT_TEXT = 'אני מאשר/ת לקבל מגלילה עדכונים, תכנים והצעות בדיוור (מייל, SMS או וואטסאפ). אפשר להסיר את עצמי בכל עת.'
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
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')

  // מי שכבר השאיר פרטים בדפדפן הזה לא צריך למלא שוב
  useEffect(() => setUnlocked(readUnlocked()), [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    // שדה מלכודת לרובוטים: אנשים לא רואים אותו ולא ממלאים אותו
    if (data.get('website')) return
    setStatus('sending')
    const body = new URLSearchParams({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      consent: data.get('consent') ? 'yes' : 'no',
      consentText: CONSENT_TEXT,
      page: window.location.href,
    })
    try {
      // Google Apps Script לא מחזיר כותרות CORS לבקשה רגילה, ולכן no-cors: הבקשה נשלחת, ואת התשובה לא קוראים
      await fetch(site.leadsEndpoint, { method: 'POST', mode: 'no-cors', body })
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // בלי אחסון בדפדפן ההורדות פשוט ייפתחו רק בביקור הזה
      }
      setUnlocked(true)
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  const labelClass = 'mb-1.5 block font-medium'

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
              <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>שם</span>
                  <input name="name" type="text" required autoComplete="name" maxLength={80} className="field" />
                </label>
                <label className="block">
                  <span className={labelClass}>מייל</span>
                  <input name="email" type="email" required autoComplete="email" maxLength={120} dir="ltr" className="field text-right" />
                </label>
                <label className="block sm:col-span-2">
                  <span className={labelClass}>
                    טלפון <span className="font-normal text-ink/70">(לא חובה)</span>
                  </span>
                  <input name="phone" type="tel" autoComplete="tel" maxLength={20} className="field text-right" />
                </label>
                <label className="hidden" aria-hidden="true">
                  אתר
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>
                <label className="flex items-start gap-3 sm:col-span-2">
                  <input name="consent" type="checkbox" required className="mt-1 size-5 shrink-0 accent-brand-deep" />
                  <span>{CONSENT_TEXT}</span>
                </label>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn cursor-pointer rounded-lg py-4 text-base hover:scale-100 hover:brightness-110 disabled:opacity-60 sm:col-span-2"
                >
                  {status === 'sending' ? 'שולחים…' : 'לפתיחת הקבצים'}
                </button>
                {status === 'error' && (
                  <p className="text-sm text-brand-deep sm:col-span-2" role="alert">
                    משהו השתבש בשליחה. בדקו את החיבור לאינטרנט ונסו שוב.
                  </p>
                )}
                <p className="text-sm text-ink/70 sm:col-span-2">
                  הפרטים נשמרים אצלנו בלבד, ומשמשים רק למשלוח עדכונים ותכנים מגלילה. להסרה מרשימת התפוצה אפשר לכתוב לנו בכל עת לטלפון{' '}
                  <a href={site.phoneHref} className="text-brand-deep underline" dir="ltr">
                    {site.phoneDisplay}
                  </a>
                  .
                </p>
              </form>
            </>
          )}
        </section>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {downloads.map((item) => (
            <li key={item.id} className="card flex flex-col overflow-hidden">
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
