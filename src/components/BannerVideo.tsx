import { useEffect, useRef, useState } from 'react'
import { ENDED, PLAYING, mountPlayer } from './youtube'

// סרטון הפתיחה בראש עמוד הבית: רצועה רחבה שמתנגנת בלופ, בלי קול ובלי לחיצה
// (דפדפנים מרשים ניגון אוטומטי רק כשהסרטון מושתק). הכפתור פותח את הסרטון המלא עם קול.
export default function BannerVideo({ id, title }: { id: string; title: string }) {
  const holder = useRef<HTMLDivElement>(null)
  const [full, setFull] = useState(false)
  // תמונת הפתיחה נשארת עד שהסרטון באמת מתנגן – אם הדפדפן חוסם ניגון אוטומטי, רואים תמונה ולא מסך שחור
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (full || !holder.current) return
    // הנגן נטען רק אחרי שהעמוד עלה, ולא למי שביקש להפחית תנועה
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    return mountPlayer(
      holder.current,
      id,
      { autoplay: 1, mute: 1, controls: 0, playsinline: 1, rel: 0, disablekb: 1, loop: 1, playlist: id },
      {
        onReady: ({ target }) => {
          target.mute()
          target.playVideo()
        },
        onStateChange: ({ target, data }) => {
          if (data === PLAYING) setStarted(true)
          if (data === ENDED) {
            target.seekTo(0, true)
            target.playVideo()
          }
        },
      },
    )
  }, [id, full])

  if (full) {
    return (
      <div className="relative aspect-video overflow-hidden bg-sand">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
    )
  }

  return (
    <div className="relative aspect-[16/8] overflow-hidden bg-sand md:aspect-[16/6]">
      <img src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" decoding="async" className="size-full object-cover object-top" />
      {/* הנגן בגובה מלא של 16:9 ומוצמד למעלה, כך שהרצועה חותכת רק את החלק התחתון */}
      <div
        ref={holder}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 aspect-video w-full transition-opacity duration-700 [&_iframe]:size-full ${
          started ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <button
        type="button"
        onClick={() => setFull(true)}
        className="absolute start-3 bottom-3 flex cursor-pointer items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-ink shadow-md transition-transform hover:scale-105 md:start-5 md:bottom-5 md:text-base"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
        לצפייה בסרטון המלא עם קול
      </button>
    </div>
  )
}
