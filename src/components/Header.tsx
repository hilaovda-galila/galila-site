import { useState } from 'react'
import { Link } from 'react-router'
import { navLinks, site } from '../config/site'
import Img, { imageSrc } from './Img'
import { MenuIcon } from './icons'

const LOGO = 'לוגו-רקע-שקוף-2.png'

function NavItem({ href, label, className, onClick }: { href: string; label: string; className: string; onClick?: () => void }) {
  // עוגנים בעמוד הבית הם קישורים רגילים; עמודים אחרים עוברים דרך הראוטר
  return href.includes('#') ? (
    <a href={href} className={className} onClick={onClick}>
      {label}
    </a>
  ) : (
    <Link to={href} className={className} onClick={onClick}>
      {label}
    </Link>
  )
}

// לשונית: מלבן לחיץ בגובה 44 פיקסלים לפחות (נוח ללחיצה גם באצבע), עם מסגרת ברורה במיקוד מקלדת
const tabClass =
  'flex min-h-11 items-center justify-center rounded-lg border border-brand-soft bg-white px-3 py-2 text-center text-[17px] leading-tight font-medium text-brand-deep transition-colors hover:border-brand hover:bg-powder'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header id="1" className="relative z-10 border-b-2 border-white/25 bg-cream">
      <div className="mx-auto flex max-w-site items-center justify-between gap-3 px-3 py-2">
        <Link to="/" aria-label={`${site.name} – לעמוד הבית`} className="shrink-0">
          {imageSrc(LOGO) ? (
            <Img name={LOGO} alt="גלילה – קבוצות חברתיות" loading="eager" sizes="99px" className="w-[73px] md:w-[99px]" />
          ) : (
            <span className="text-3xl font-extrabold text-brand">{site.name}</span>
          )}
        </Link>

        {/* לשוניות כמלבנים לחיצים, 4 בשורה בשתי שורות */}
        <nav className="hidden grow grid-cols-4 gap-2 lg:grid lg:max-w-[860px]" aria-label="ניווט ראשי">
          {navLinks.map((link) => (
            <NavItem key={link.label} {...link} className={tabClass} />
          ))}
        </nav>

        <button
          type="button"
          className="rounded-[3px] bg-sun p-1.5 text-ink transition-colors hover:bg-brand-soft lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon open={open} />
        </button>

        <a href={site.phoneHref} className="btn shrink-0 px-2.5 py-2.5 text-sm font-extrabold md:px-6 md:py-3 md:text-[15px]">
          ליצירת קשר
        </a>
      </div>

      {open && (
        <nav id="mobile-nav" className="absolute inset-x-0 top-full grid grid-cols-2 gap-2 bg-cream p-3 shadow-lg lg:hidden" aria-label="ניווט נייד">
          {navLinks.map((link) => (
            <NavItem key={link.label} {...link} onClick={() => setOpen(false)} className={tabClass} />
          ))}
        </nav>
      )}
    </header>
  )
}
