import { useEffect, useState } from 'react'
import type { Testimonial } from '../content'
import Img from './Img'
import { ChevronIcon } from './icons'

// קרוסלת ההמלצות המקורית: שקופית אחת, חיצים, נקודות, מעבר אוטומטי כל 5 שניות ועצירה בריחוף
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = items.length

  useEffect(() => {
    if (paused || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 5000)
    return () => clearInterval(timer)
  }, [paused, count])

  const go = (step: number) => setIndex((i) => (i + step + count) % count)
  const arrowClass =
    'absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full p-1 text-ink/50 transition-colors hover:text-brand'

  return (
    <div
      className="relative mx-auto max-w-[900px] px-9"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="הורים ממליצים"
    >
      <button type="button" onClick={() => go(-1)} aria-label="ההמלצה הקודמת" className={`${arrowClass} start-0`}>
        <ChevronIcon className="size-7" />
      </button>
      <button type="button" onClick={() => go(1)} aria-label="ההמלצה הבאה" className={`${arrowClass} end-0`}>
        <ChevronIcon className="size-7 rotate-180" />
      </button>

      {/* כל השקופיות באותו תא גריד, כך שהגובה נקבע לפי הארוכה ביותר ואין קפיצות */}
      <div className="grid">
        {items.map((item, i) => (
          <figure
            key={item.text}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 flex flex-col items-center text-center transition-opacity duration-500 ${
              i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <blockquote className="text-lg leading-relaxed md:text-xl">{item.text}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <Img name={item.image} alt="" className="size-[50px] rounded-full object-cover" />
              <span className="text-start">
                <span className="block font-semibold">{item.name}</span>
                <span className="block text-sm text-ink/70">{item.title}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.text}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`המלצה ${i + 1} מתוך ${count}`}
            aria-current={i === index}
            className={`size-2.5 cursor-pointer rounded-full transition-colors ${i === index ? 'bg-ink' : 'bg-ink/25'}`}
          />
        ))}
      </div>
    </div>
  )
}
