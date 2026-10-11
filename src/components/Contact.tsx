import { useState, type FormEvent, type ReactNode } from 'react'
import { areas, site, whatsappLink } from '../config/site'
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, UsersIcon } from './icons'

const DEFAULT_INTRO = 'השאירו פרטים, ונחזור אלייך בשיחה טלפונית כדי לתאם מפגש היכרות'

function Detail({ icon, href, children }: { icon: ReactNode; href?: string; children: ReactNode }) {
  const body = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-powder text-brand">{icon}</span>
      <span className="break-all">{children}</span>
    </>
  )
  const className = 'flex items-center gap-3 py-2'
  return (
    <li>
      {href ? (
        <a
          href={href}
          className={`${className} transition-colors hover:text-brand-deep`}
          {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {body}
        </a>
      ) : (
        <span className={className}>{body}</span>
      )}
    </li>
  )
}

export default function Contact({ intro = DEFAULT_INTRO }: { intro?: string }) {
  const [sent, setSent] = useState(false)

  // אין לאתר שרת: הטופס מרכיב הודעה ופותח אותה בוואטסאפ, והפונה שולח אותה בעצמו.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const message = [
      'שלום, השארתי פרטים באתר של גלילה.',
      `שם מלא: ${data.get('name')}`,
      `טלפון: ${data.get('phone')}`,
      `אזור: ${data.get('area')}`,
      `גיל הילד/ה: ${data.get('age')}`,
    ].join('\n')
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  const labelClass = 'mb-1.5 block font-medium'
  const iconClass = 'size-6'

  return (
    <section id="contact" className="bg-sand px-5 py-16 md:py-20">
      {/* העוגנים המקוריים של "השאירו פרטים" */}
      <span id="25" />
      <span id="7" />
      <div className="mx-auto grid max-w-[1100px] gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="card p-6 md:p-9">
          <h2 className="text-center text-[38px] leading-tight font-extrabold text-brand md:text-[46px]">צרו קשר</h2>
          <p className="mt-3 mb-6 text-center text-lg">{intro}</p>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>שם מלא</span>
              <input name="name" type="text" required autoComplete="name" className="field" />
            </label>
            <label className="block">
              <span className={labelClass}>טלפון</span>
              <input name="phone" type="tel" required autoComplete="tel" className="field text-right" />
            </label>
            <label className="block">
              <span className={labelClass}>אזור</span>
              <select name="area" required defaultValue="" className="field">
                <option value="" disabled>
                  בחרו אזור
                </option>
                {areas.map((area) => (
                  <option key={area.name}>{area.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>גיל הילד/ה</span>
              <input name="age" type="number" required min={1} max={18} step="0.5" inputMode="decimal" className="field" />
            </label>
            <button type="submit" className="btn cursor-pointer rounded-lg py-4 text-base hover:scale-100 hover:brightness-110 sm:col-span-2">
              שליחת פרטים
            </button>
            {sent && (
              <p className="text-sm sm:col-span-2" role="status">
                הפנייה נפתחה בוואטסאפ – נשאר רק ללחוץ שם על "שליחה". תודה!
              </p>
            )}
          </form>
        </div>

        <div className="p-2 md:p-6">
          <h2 className="text-center text-[30px] leading-tight font-extrabold text-brand md:text-[34px]">פרטי התקשרות</h2>
          <ul className="mx-auto mt-5 w-fit">
            <Detail icon={<PhoneIcon className={iconClass} />} href={site.phoneHref}>
              {site.phoneDisplay}
            </Detail>
            <Detail icon={<FacebookIcon className={iconClass} />} href={site.facebook}>
              Facebook
            </Detail>
            <Detail icon={<InstagramIcon className={iconClass} />} href={site.instagram}>
              Instagram
            </Detail>
            <Detail icon={<UsersIcon className={iconClass} />} href={site.community}>
              {site.communityName}
            </Detail>
            <Detail icon={<MailIcon className={iconClass} />} href={`mailto:${site.email}`}>
              {site.email}
            </Detail>
            {areas.map((area) => (
              <Detail key={area.name} icon={<PinIcon className={iconClass} />}>
                {area.place}, {area.address}
              </Detail>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
