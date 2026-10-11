import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { site, whatsappLink } from '../config/site'
import Contact from './Contact'
import Header from './Header'
import { WhatsAppIcon } from './icons'

type Props = {
  title: string
  children: ReactNode
  contactIntro?: string
  contact?: boolean
}

export default function Layout({ title, children, contactIntro, contact = true }: Props) {
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
      {contact && <Contact intro={contactIntro} />}

      <footer className="bg-brand px-5 py-5 text-center font-medium text-ink">
        © {new Date().getFullYear()} {site.name} – קבוצות חברתיות. כל הזכויות שמורות.
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
