import { useState, type FormEvent } from 'react'
import { site } from '../config/site'

// הנוסח שההורה מאשר. נשמר בגיליון יחד עם הפרטים, כתיעוד למה בדיוק ניתנה ההסכמה.
const CONSENT_TEXT = 'אני מאשר/ת לקבל מגלילה עדכונים, תכנים והצעות בדיוור (מייל, SMS או וואטסאפ). אפשר להסיר את עצמי בכל עת.'

// טופס השארת פרטים ("חומרים להורדה", "קורסים מקוונים"). הפרטים נשמרים בגיליון של גלילה דרך Google Apps Script
// (docs/leads-google-apps-script.gs); עמודת "עמוד" בגיליון מראה מאיזה עמוד הגיע כל נרשם. כל השדות חובה.
export default function LeadForm({ submitLabel, onDone }: { submitLabel: string; onDone: () => void }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    // שדה מלכודת לרובוטים: אנשים לא רואים אותו ולא ממלאים אותו
    if (data.get('website')) return
    setStatus('sending')
    const body = new URLSearchParams({
      age: String(data.get('age') ?? ''),
      diagnosed: String(data.get('diagnosed') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      city: String(data.get('city') ?? ''),
      consent: data.get('consent') ? 'yes' : 'no',
      consentText: CONSENT_TEXT,
      page: window.location.href,
    })
    try {
      // Google Apps Script לא מחזיר כותרות CORS לבקשה רגילה, ולכן no-cors: הבקשה נשלחת, ואת התשובה לא קוראים
      await fetch(site.leadsEndpoint, { method: 'POST', mode: 'no-cors', body })
      setStatus('idle')
      onDone()
    } catch {
      setStatus('error')
    }
  }

  const labelClass = 'mb-1.5 block font-medium'

  return (
    <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className={labelClass}>בן/בת כמה הילד/ה?</span>
        <input name="age" type="number" required min={1} max={18} step="0.5" inputMode="decimal" className="field" />
      </label>
      <fieldset className="block">
        <legend className={labelClass}>מאובחן/ת על הרצף?</legend>
        <div className="flex gap-6 py-2.5">
          <label className="flex items-center gap-2">
            <input type="radio" name="diagnosed" value="כן" required className="size-5 accent-brand-deep" /> כן
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="diagnosed" value="לא" className="size-5 accent-brand-deep" /> לא
          </label>
        </div>
      </fieldset>
      <label className="block">
        <span className={labelClass}>מייל</span>
        <input name="email" type="email" required autoComplete="email" maxLength={120} dir="ltr" className="field text-right" />
      </label>
      <label className="block">
        <span className={labelClass}>טלפון</span>
        <input name="phone" type="tel" required autoComplete="tel" minLength={9} maxLength={20} className="field text-right" />
      </label>
      <label className="block sm:col-span-2">
        <span className={labelClass}>עיר</span>
        <input name="city" type="text" required autoComplete="address-level2" maxLength={60} className="field" />
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
        {status === 'sending' ? 'שולחים…' : submitLabel}
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
  )
}
