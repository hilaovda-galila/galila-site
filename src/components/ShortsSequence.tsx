import { useEffect, useRef, useState } from 'react'
import LiteYouTube from './LiteYouTube'
import { ENDED, mountPlayer, type Player } from './youtube'

type Video = { id: string; title: string }

function ActivePlayer({ video, muted, visible, onEnded }: { video: Video; muted: boolean; visible: boolean; onEnded: () => void }) {
  const holder = useRef<HTMLDivElement>(null)
  const player = useRef<Player | null>(null)
  const ended = useRef(onEnded)
  ended.current = onEnded

  useEffect(() => {
    if (!holder.current) return
    // סרטוני Shorts לא "מסתיימים" אלא מתחילים מחדש בלופ, ולכן עוקבים אחרי זמן הניגון:
    // הגעה לסוף, או קפיצה של הזמן אחורה, פירושן שהסרטון הושלם
    let last = 0
    let done = false
    const finish = () => {
      if (done) return
      done = true
      ended.current()
    }
    const timer = setInterval(() => {
      const current = player.current
      if (typeof current?.getCurrentTime !== 'function') return
      const time = current.getCurrentTime()
      const duration = current.getDuration()
      if (duration > 0 && (time >= duration - 0.4 || time + 1 < last)) finish()
      last = time
    }, 300)
    const unmount = mountPlayer(
      holder.current,
      video.id,
      { autoplay: 1, mute: muted ? 1 : 0, playsinline: 1, rel: 0 },
      {
        onReady: ({ target }) => {
          if (muted) target.mute()
          target.playVideo()
        },
        onStateChange: ({ data }) => {
          if (data === ENDED) finish()
        },
      },
      (created) => (player.current = created),
    )
    return () => {
      clearInterval(timer)
      player.current = null
      unmount()
    }
  }, [video.id, muted])

  // עוצרים כשגוללים הלאה וממשיכים כשחוזרים
  useEffect(() => {
    try {
      if (visible) player.current?.playVideo()
      else player.current?.pauseVideo()
    } catch {
      // הנגן עדיין נטען
    }
  }, [visible])

  return <div ref={holder} title={video.title} className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-sand [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:size-full" />
}

// סרטוני ה-Shorts מתחילים להתנגן לבד (מושתקים) כשמגיעים אליהם בגלילה, אחד אחרי השני.
// לחיצה על סרטון אחר מפעילה אותו עם קול.
export default function ShortsSequence({ videos }: { videos: Video[] }) {
  const section = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [muted, setMuted] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = section.current
    if (!element) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
        if (entry.isIntersecting && !reduceMotion) setActive((current) => current ?? 0)
      },
      { threshold: 0.35 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={section} className="grid w-full max-w-[720px] gap-6 sm:grid-cols-2">
      {videos.map((video, i) => (
        <article key={video.id} className={`card overflow-hidden p-3 transition-shadow ${i === active ? 'ring-2 ring-brand' : ''}`}>
          {i === active ? (
            <ActivePlayer video={video} muted={muted} visible={visible} onEnded={() => setActive((i + 1) % videos.length)} />
          ) : (
            <LiteYouTube
              id={video.id}
              title={video.title}
              onPlay={() => {
                setMuted(false)
                setActive(i)
              }}
            />
          )}
          <h3 className="px-2 pt-4 pb-2 text-center text-lg leading-snug font-semibold">{video.title}</h3>
        </article>
      ))}
    </div>
  )
}
