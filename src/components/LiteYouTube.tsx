import { useState } from 'react'

type Props = {
  id: string
  title: string
  // כשמועבר, הלחיצה רק מדווחת החוצה והרכיב שמעל מחליט מה לנגן (ראו ShortsSequence)
  onPlay?: () => void
  className?: string
}

// נגן YouTube Shorts "קל": מציג רק תמונה ממוזערת וכפתור, וטוען את הנגן עצמו רק אחרי לחיצה –
// כך הסרטונים לא מאטים את טעינת העמוד.
export default function LiteYouTube({ id, title, onPlay, className = '' }: Props) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={`relative aspect-[9/16] overflow-hidden rounded-2xl bg-sand ${className}`}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={onPlay ?? (() => setPlaying(true))}
          aria-label={`הפעלת הסרטון: ${title}`}
          className="group absolute inset-0 size-full cursor-pointer"
        >
          {/* oar2 היא התמונה הממוזערת האנכית של Shorts */}
          <img src={`https://i.ytimg.com/vi/${id}/oar2.jpg`} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center bg-ink/10 transition-colors group-hover:bg-ink/0">
            <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-7 translate-x-0.5" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
