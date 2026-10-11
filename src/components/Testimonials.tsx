import { useEffect, useState } from 'react'
import type { Testimonial } from '../content'
import { ChevronIcon } from './icons'

// צבעי העיגול מתחלפים בין גווני הלוגו
const avatarColors = ['bg-powder text-brand-deep', 'bg-sun/40 text-ink', 'bg-sky/20 text-ink']

// האות של הילד/ה מתוך הקרדיט ("אמא של א' (6)" → א'), כדי לשמור על אנונימיות מלאה
function initial(name: string) {
  const match = name.match(/של\s+([א-ת])/)
  return `${match ? match[1] : name.trim().charAt(0)}'`
}

function Card({ item, colorIndex }: { item: Testimonial; colorIndex: number }) {
  return (
    <figure className="flex h-full flex-col items-center rounded-2xl border-2 border-brand-soft bg-white px-6 pt-8 pb-7 text-center shadow-[0_6px_22px_rgba(236,99,148,0.12)] md:px-8">
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-9 shrink-0 text-brand-soft" aria-hidden="true">
        <path d="M10 7H6a3 3 0 0 0-3 3v4h5v3H5v2h3a2 2 0 0 0 2-2V7Zm11 0h-4a3 3 0 0 0-3 3v4h5v3h-3v2h3a2 2 0 0 0 2-2V7Z" />
      </svg>
      <blockquote className="mt-4 grow text-[17px] leading-relaxed md:text-lg">{item.text}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span
          className={`flex size-14 shrink-0 items-center justify-center rounded-full text-xl font-semibold ring-2 ring-white ${avatarColors[colorIndex % avatarColors.length]}`}
          aria-hidden="true"
        >
          {initial(item.name)}
        </span>
        <span className="text-start">
          <span className="block font-semibold">{item.name}</span>
          {item.title && <span className="block text-sm text-ink/70">{item.title}</span>}
        </span>
      </figcaption>
    </figure>
  )
}

// קרוסלת המלצות: כרטיס אחד בנייד ושניים זה לצד זה במחשב, עם חיצים, נקודות,
// מעבר אוטומטי כל 7 שניות ועצירה בריחוף או במיקוד
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [perPage, setPerPage] = useState(1)
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)')
    const sync = () => {
      setPerPage(wide.matches ? 2 : 1)
      setPage(0)
    }
    sync()
    wide.addEventListener('change', sync)
    return () => wide.removeEventListener('change', sync)
  }, [])

  const pages: Testimonial[][] = []
  for (let i = 0; i < items.length; i += perPage) pages.push(items.slice(i, i + perPage))
  const count = pages.length

  useEffect(() => {
    if (paused || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setPage((p) => (p + 1) % count), 7000)
    return () => clearInterval(timer)
  }, [paused, count])

  const go = (step: number) => setPage((p) => (p + step + count) % count)
  const arrowClass =
    'absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full border border-brand-soft bg-white p-1.5 text-brand-deep shadow-sm transition-colors hover:bg-powder'

  return (
    <div
      className="relative mx-auto max-w-[900px] px-11 md:px-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="הורים ממליצים"
    >
      <button type="button" onClick={() => go(-1)} aria-label="ההמלצות הקודמות" className={`${arrowClass} start-0`}>
        <ChevronIcon className="size-6" />
      </button>
      <button type="button" onClick={() => go(1)} aria-label="ההמלצות הבאות" className={`${arrowClass} end-0`}>
        <ChevronIcon className="size-6 rotate-180" />
      </button>

      {/* כל העמודים באותו תא גריד, כך שהגובה נקבע לפי הגבוה ביותר ואין קפיצות */}
      <div className="grid">
        {pages.map((group, i) => (
          <div
            key={group[0].text}
            aria-hidden={i !== page}
            className={`col-start-1 row-start-1 grid gap-6 transition-opacity duration-500 md:grid-cols-2 ${
              i === page ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            {group.map((item, j) => (
              <Card key={item.text} item={item} colorIndex={i * perPage + j} />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {pages.map((group, i) => (
          <button
            key={group[0].text}
            type="button"
            onClick={() => setPage(i)}
            aria-label={`עמוד המלצות ${i + 1} מתוך ${count}`}
            aria-current={i === page}
            className={`size-2.5 cursor-pointer rounded-full transition-colors ${i === page ? 'bg-brand' : 'bg-brand-soft'}`}
          />
        ))}
      </div>
    </div>
  )
}
