import { useEffect, useState } from 'react'
import { ACCESS_DAYS } from '../content/courses'

// מצב הדגמה: אין עדיין שרת, הרשמה אמיתית או סליקה. ה"חשבון" והגישה לקורסים נשמרים
// רק בדפדפן הזה (localStorage), וסיסמאות לא נשמרות בכלל.
// כשמחברים שרת אמיתי מחליפים את הקובץ הזה בלבד: אותו ממשק (useSession), מקור נתונים אחר.
export const DEMO_MODE = true
export const DEMO_CODE = 'GALILA30'

// רשומת גישה לקורס – מקבילה לטבלת enrollments המתוכננת
export type Enrollment = { courseSlug: string; expiresAt: string; source: 'purchase' | 'code' }
export type Session = { name: string; email: string; enrollments: Enrollment[] }

const KEY = 'galila-demo-session'
const CHANGED = 'galila-session-changed'
const DAY = 24 * 60 * 60 * 1000

function read(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function write(session: Session | null) {
  try {
    if (session) localStorage.setItem(KEY, JSON.stringify(session))
    else localStorage.removeItem(KEY)
  } catch {
    // אחסון מקומי חסום (למשל גלישה פרטית) – ההדגמה פשוט לא תישמר
  }
  window.dispatchEvent(new Event(CHANGED))
}

export const isActive = (enrollment: Enrollment) => new Date(enrollment.expiresAt).getTime() > Date.now()
export const daysLeft = (enrollment: Enrollment) => Math.max(0, Math.ceil((new Date(enrollment.expiresAt).getTime() - Date.now()) / DAY))

export function signIn(name: string, email: string) {
  const current = read()
  // התחברות עם אותו אימייל שומרת על הקורסים הקיימים
  write({ name: name || current?.name || email.split('@')[0], email, enrollments: current?.email === email ? current.enrollments : [] })
}

export const signOut = () => write(null)

// פותח (או מחדש) גישה לקורס ל-30 יום מהרגע הזה
export function grantAccess(courseSlug: string, source: Enrollment['source']) {
  const session = read()
  if (!session) return
  const expiresAt = new Date(Date.now() + ACCESS_DAYS * DAY).toISOString()
  write({ ...session, enrollments: [...session.enrollments.filter((e) => e.courseSlug !== courseSlug), { courseSlug, expiresAt, source }] })
}

// ready=false בזמן יצירת העמוד מראש ובטעינה הראשונה, לפני שנקרא המצב מהדפדפן
export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => setSession(read())
    sync()
    setReady(true)
    window.addEventListener(CHANGED, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CHANGED, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { session, ready }
}
