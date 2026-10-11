import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { paths } from '../config/site'
import { ACCESS_DAYS, type Course } from '../content/courses'
import { DEMO_CODE, DEMO_MODE, grantAccess, signIn, useSession } from '../lib/session'

type Props = {
  // בלי קורס: התחברות/הרשמה בלבד. עם קורס: אחרי ההתחברות ממשיכים לתשלום או לקוד גישה
  course?: Course
  onClose: () => void
}

export default function AuthDialog({ course, onClose }: Props) {
  const { session } = useSession()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'register' | 'login'>('register')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    // TODO: הרשמה/התחברות אמיתית מול השרת. במצב הדגמה הסיסמה לא נשלחת ולא נשמרת.
    signIn(String(data.get('name') ?? '').trim(), String(data.get('email')).trim())
    if (!course) finish()
  }

  function finish() {
    onClose()
    navigate(paths.myCourses)
  }

  function handlePay() {
    if (!course) return
    // TODO: מעבר לעמוד התשלום של ספק הסליקה; הגישה תיפתח רק כשה-Webhook יאשר את התשלום.
    grantAccess(course.slug, 'purchase')
    finish()
  }

  function handleCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!course) return
    // TODO: בדיקת הקוד מול השרת (תוקף, מספר שימושים, לאיזה קורס)
    if (code.trim().toUpperCase() !== DEMO_CODE) return setCodeError('הקוד לא נמצא או שכבר אינו בתוקף.')
    grantAccess(course.slug, 'code')
    finish()
  }

  const labelClass = 'mb-1.5 block font-medium'
  const step = session ? 'access' : 'account'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="card relative w-full max-w-[460px] p-6 md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={onClose} aria-label="סגירה" className="absolute end-3 top-3 cursor-pointer rounded-full p-2 text-2xl leading-none text-ink/60 hover:text-ink">
          ×
        </button>

        {DEMO_MODE && <p className="mb-4 rounded-lg bg-sun/30 px-3 py-2 text-sm">מצב הדגמה: עדיין אין הרשמה או תשלום אמיתיים, ושום פרט לא נשלח.</p>}

        {step === 'account' ? (
          <>
            <h2 id="auth-title" className="text-center text-[28px] leading-tight font-extrabold text-brand">
              {mode === 'register' ? 'הרשמה' : 'התחברות'}
            </h2>
            {course && <p className="mt-2 text-center text-ink/75">כדי לרכוש את הקורס "{course.title}"</p>}
            <form onSubmit={handleAccount} className="mt-5 grid gap-4">
              {mode === 'register' && (
                <label className="block">
                  <span className={labelClass}>שם מלא</span>
                  <input name="name" type="text" required autoComplete="name" className="field" />
                </label>
              )}
              <label className="block">
                <span className={labelClass}>אימייל</span>
                <input name="email" type="email" required autoComplete="email" dir="ltr" className="field text-right" />
              </label>
              <label className="block">
                <span className={labelClass}>סיסמה</span>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  dir="ltr"
                  className="field text-right"
                />
              </label>
              <button type="submit" className="btn cursor-pointer rounded-lg py-4 text-base hover:scale-100 hover:brightness-110">
                {mode === 'register' ? 'הרשמה והמשך' : 'התחברות'}
              </button>
            </form>
            <p className="mt-4 text-center text-sm">
              {mode === 'register' ? 'כבר נרשמת? ' : 'עוד לא נרשמת? '}
              <button type="button" onClick={() => setMode(mode === 'register' ? 'login' : 'register')} className="cursor-pointer font-medium text-brand-deep underline">
                {mode === 'register' ? 'להתחברות' : 'להרשמה'}
              </button>
            </p>
          </>
        ) : (
          course && (
            <>
              <h2 id="auth-title" className="text-center text-[28px] leading-tight font-extrabold text-brand">
                רכישת הקורס
              </h2>
              <div className="mt-4 rounded-xl bg-sand p-4 text-center">
                <p className="text-lg font-semibold">{course.title}</p>
                <p className="mt-1 text-ink/75">
                  גישה לצפייה למשך {ACCESS_DAYS} יום · ₪{course.priceILS}
                </p>
              </div>
              <button type="button" onClick={handlePay} className="btn mt-5 w-full cursor-pointer rounded-lg py-4 text-base hover:scale-100 hover:brightness-110">
                מעבר לתשלום מאובטח
              </button>

              <form onSubmit={handleCode} className="mt-6 border-t border-brand-soft pt-5">
                <label className="block">
                  <span className={labelClass}>יש לך קוד גישה או קופון?</span>
                  <span className="flex gap-2">
                    <input
                      value={code}
                      onChange={(event) => {
                        setCode(event.target.value)
                        setCodeError('')
                      }}
                      required
                      dir="ltr"
                      autoComplete="off"
                      aria-describedby="code-help"
                      className="field text-right"
                    />
                    <button type="submit" className="shrink-0 cursor-pointer rounded-lg border border-brand px-4 font-semibold text-brand-deep hover:bg-powder">
                      הפעלת קוד
                    </button>
                  </span>
                </label>
                <p id="code-help" className="mt-2 text-sm text-ink/70" role="status">
                  {codeError || `קוד תקין פותח ${ACCESS_DAYS} ימי צפייה בלי תשלום.${DEMO_MODE ? ` קוד לדוגמה: ${DEMO_CODE}` : ''}`}
                </p>
              </form>
            </>
          )
        )}
      </div>
    </div>
  )
}
