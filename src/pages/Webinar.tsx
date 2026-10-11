import { useState, type FormEvent } from 'react'
import Img from '../components/Img'
import Layout from '../components/Layout'
import { whatsappLink } from '../config/site'
import { webinar } from '../content'

// פרטי הוובינר כפי שהופיעו באתר המקורי
const details = [
  { label: 'איפה?', value: 'מקוון ב-ZOOM' },
  { label: 'שעה', value: '20:00' },
  { label: 'תאריך', value: '2/3/2025' },
]

const image = webinar.blocks.find((b) => b.type === 'image')
const inputClass = 'w-full rounded-[3px] border border-ink/20 bg-white px-4 py-2.5'

export default function Webinar() {
  const [sent, setSent] = useState(false)

  // אין לאתר שרת: הטופס מרכיב הודעה ופותח אותה בוואטסאפ, והנרשם שולח אותה בעצמו.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const field = (name: string) => String(data.get(name) ?? '').trim()
    const lines = [
      'שלום, אשמח להירשם לוובינר "במקום מאבק לשחק את המשחק".',
      `שם מלא: ${field('name')}`,
      `כתובת אימייל: ${field('email')}`,
      `מספר טלפון: ${field('phone')}`,
    ]
    if (field('role')) lines.push(`מי אני: ${field('role')}`)
    lines.push(`קבלת דיוור: ${data.get('newsletter') ? 'מאשר/ת' : 'לא'}`)
    if (field('message')) lines.push(`הודעה: ${field('message')}`)
    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <Layout title="הרשמה לוובינר | גלילה" contact={false}>
      <div className="mx-auto max-w-site px-5 py-10">
        <h1 className="text-center text-[40px] leading-tight font-extrabold text-brand md:text-[60px]">במקום מאבק לשחק את המשחק</h1>

        <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
          <div>
            {image?.alt && <p className="mb-8 text-lg">{image.alt}</p>}
            <dl className="grid gap-6 sm:grid-cols-3">
              {details.map((item) => (
                <div key={item.label} className="border-b-[3px] border-sun pb-3 text-center">
                  <dt className="text-[28px] leading-tight font-extrabold text-brand">{item.label}</dt>
                  <dd className="mt-1 text-lg">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Img name={image?.image} alt="" className="mx-auto max-h-[560px] w-auto max-w-full" />
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-12 grid max-w-[700px] gap-4">
          <p className="font-medium">ב-2/3/2025 תשלח הזמנה להרצאה</p>
          <label className="block">
            <span className="mb-1 block">שם מלא</span>
            <input name="name" type="text" required autoComplete="name" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1 block">כתובת אימייל</span>
            <input name="email" type="email" required autoComplete="email" dir="ltr" className={`${inputClass} text-right`} />
          </label>
          <label className="block">
            <span className="mb-1 block">מספר טלפון</span>
            <input name="phone" type="tel" required autoComplete="tel" className={`${inputClass} text-right`} />
          </label>
          <label className="block">
            <span className="mb-1 block">מי את/ה</span>
            <input name="role" type="text" placeholder="הורה/סבא/ת /איש מקצוע" className={inputClass} />
          </label>
          <label className="flex items-center gap-2">
            <input name="newsletter" type="checkbox" className="size-4 accent-brand" />
            אני מאשר/ת קבלת דיוור
          </label>
          <label className="block">
            <span className="mb-1 block">הייתי רוצה להגיד לכן ש..</span>
            <textarea name="message" rows={4} className={`${inputClass} resize-y`} />
          </label>
          <button type="submit" className="btn cursor-pointer py-[15px] text-base hover:scale-100 hover:brightness-110">
            שליחה
          </button>
          {sent && (
            <p className="text-sm" role="status">
              ההרשמה נפתחה בוואטסאפ – נשאר רק ללחוץ שם על "שליחה". תודה!
            </p>
          )}
        </form>
      </div>
    </Layout>
  )
}
