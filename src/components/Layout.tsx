import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router'
import { areas, paths, site, whatsappLink } from '../config/site'
import Contact from './Contact'
import Header from './Header'
import { WhatsAppIcon } from './icons'

type Props = {
  title: string
  children: ReactNode
  contactIntro?: string
  // האזור שמסומן מראש בטופס (בעמודי הערים)
  contactArea?: string
  contact?: boolean
}

export default function Layout({ title, children, contactIntro, contactArea, contact = true }: Props) {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    document.title = title
  }, [title])

  // מעבר בין עמודים: גלילה לראש העמוד, או אל העוגן אם יש
  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-[3px] focus:bg-white focus:px-5 focus:py-2 focus:shadow-lg"
      >
        דילוג לתוכן הראשי
      </a>
      <Header />
      <main id="main">{children}</main>
      {contact && <Contact intro={contactIntro} defaultArea={contactArea} />}

      {/* פוטר: הקבוצות בכל עיר (שם, כתובת, יום) וקישורים לעמודים המרכזיים – עוזר גם לגוגל להבין את מבנה האתר */}
      <footer className="bg-brand px-5 py-6 text-center text-ink">
        <ul className="mx-auto flex max-w-[1100px] flex-col items-center gap-1 font-medium md:flex-row md:justify-center md:gap-8">
          {areas.map((area) => (
            <li key={area.name}>
              <Link to={area.page} className="underline-offset-2 hover:underline">
                {area.name} – {area.place}, {area.address.split(',')[0]} · {area.groups[0].day}
              </Link>
            </li>
          ))}
        </ul>
        <nav aria-label="קישורים בתחתית העמוד" className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[15px]">
          <Link to="/מיומנויות-חברתיות-לילדים-על-הרצף/" className="hover:underline">מיומנויות חברתיות לילדים על הרצף</Link>
          <Link to="/הצוות-שלנו/" className="hover:underline">הצוות שלנו</Link>
          <Link to={paths.cases} className="hover:underline">תיאורי מקרה</Link>
          <Link to={paths.blog} className="hover:underline">בלוג</Link>
          <Link to={paths.courses} className="hover:underline">קורסים דיגיטליים</Link>
          <a href={site.phoneHref} className="hover:underline" dir="ltr">{site.phoneDisplay}</a>
        </nav>
        <p className="mt-3 text-sm">© {new Date().getFullYear()} {site.name} – קבוצות חברתיות. כל הזכויות שמורות.</p>
      </footer>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="צ'אט בוואטסאפ"
        className="fixed end-5 bottom-[15px] z-30 rounded-full bg-whatsapp p-3 text-white shadow-md transition-transform hover:scale-110 md:end-[30px] md:bottom-[45px]"
      >
        <WhatsAppIcon className="size-[42px]" />
      </a>
    </>
  )
}
