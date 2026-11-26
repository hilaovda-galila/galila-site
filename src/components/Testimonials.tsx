import { useRef, useState } from 'react'
import type { Testimonial } from '../content'
import { ChevronIcon } from './icons'

// צבעי העיגול מתחלפים בין גווני הלוגו
const avatarColors = ['bg-powder text-brand-deep', 'bg-sun/40 text-ink', 'bg-sky/20 text-ink']

// האות הראשונה של שם ההורה, שפותחת את הקרדיט ("ר' אמא של א' (6)" → ר'), כדי לשמור על אנונימיות מלאה
const initial = (name: string) => `${name.trim().charAt(0)}'`

// המלצה ארוכה מוצגת מקוצרת עם "להמשך קריאה", כדי שהכרטיסים יהיו בגובה דומה
const LONG_TEXT = 260

function Card({ item, colorIndex }: { item: Testimonial; colorIndex: number }) {
  const [expanded, setExpanded] = useState(false)
  const long = item.text.length > LONG_TEXT

  return (
    <figure className="flex h-full flex-col rounded-2xl bg-white p-6 text-start shadow-[0_6px_22px_rgba(236,99,148,0.12)] md:p-7">
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-8 shrink-0 text-brand-soft" aria-hidden="true">
        <path d="M10 7H6a3 3 0 0 0-3 3v4h5v3H5v2h3a2 2 0 0 0 2-2V7Zm11 0h-4a3 3 0 0 0-3 3v4h5v3h-3v2h3a2 2 0 0 0 2-2V7Z" />
      </svg>
      <div className="mt-3 grow">
        <blockquote className={`text-[17px] leading-relaxed ${long && !expanded ? 'line-clamp-6' : ''}`}>{item.text}</blockquote>
        {long && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="mt-2 cursor-pointer text-[15px] font-medium text-brand-deep underline hover:text-sky"
          >
            {expanded ? 'הצגה מקוצרת' : 'להמשך קריאה'}
          </button>
        )}
      </div>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-brand-soft/50 pt-4">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${avatarColors[colorIndex % avatarColors.length]}`}
          aria-hidden="true"
        >
          {initial(item.name)}
        </span>
        <span>
          <span className="block font-semibold">{item.name}</span>
          {item.title && <span className="block text-sm text-ink/70">{item.title}</span>}
        </span>
      </figcaption>
    </figure>
  )
}

// רצועת המלצות שגוללים לצדדים: בטלפון כרטיס אחד ומעט מהבא (כדי שיהיה ברור שאפשר להחליק),
// במחשב שלושה כרטיסים. החיצים מזיזים כרטיס אחד בכל לחיצה. אין מעבר אוטומטי – ההורה קורא בקצב שלו.
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLDivElement>(null)

  // בעברית (RTL) "הבא" נמצא משמאל, ולכן גלילה קדימה היא בכיוון השלילי
  const move = (direction: 1 | -1) => {
    const el = track.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return
    el.scrollBy({ left: -direction * (card.offsetWidth + 20), behavior: 'smooth' })
  }

  const arrowClass =
    'hidden cursor-pointer rounded-full border border-brand-soft bg-white p-2 text-brand-deep shadow-sm transition-colors hover:bg-powder md:flex'

  return (
    <div className="mx-auto max-w-[1200px]" aria-roledescription="carousel" aria-label="הורים ממליצים">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <div key={item.text} className="w-[85%] shrink-0 snap-start sm:w-[60%] md:w-[calc((100%-2.5rem)/3)]">
            <Card item={item} colorIndex={i} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-3">
        <button type="button" onClick={() => move(-1)} aria-label="ההמלצה הקודמת" className={arrowClass}>
          <ChevronIcon className="size-6" />
        </button>
        <button type="button" onClick={() => move(1)} aria-label="ההמלצה הבאה" className={arrowClass}>
          <ChevronIcon className="size-6 rotate-180" />
        </button>
      </div>
      <p className="mt-1 text-center text-sm text-ink/60 md:hidden" aria-hidden="true">
        החליקו לצדדים להמלצות נוספות
      </p>
    </div>
  )
}
