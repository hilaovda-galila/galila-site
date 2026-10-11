// טעינה עצלה של YouTube IFrame API – החלק שבו האתר משתמש
export type Player = {
  destroy(): void
  playVideo(): void
  pauseVideo(): void
  mute(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  getCurrentTime(): number
  getDuration(): number
}

type PlayerOptions = {
  videoId: string
  host: string
  width: string
  height: string
  playerVars: Record<string, number | string>
  events: {
    onReady?(event: { target: Player }): void
    onStateChange?(event: { target: Player; data: number }): void
  }
}

type YouTubeApi = { Player: new (element: HTMLElement, options: PlayerOptions) => Player }
type YouTubeWindow = Window & { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void }

export const ENDED = 0
export const PLAYING = 1

let apiPromise: Promise<YouTubeApi> | null = null

function loadYouTubeApi() {
  apiPromise ??= new Promise<YouTubeApi>((resolve) => {
    const w = window as YouTubeWindow
    if (w.YT?.Player) return resolve(w.YT)
    const previous = w.onYouTubeIframeAPIReady
    w.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve(w.YT!)
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })
  return apiPromise
}

// יוצר נגן בתוך holder ומחזיר פונקציית ניקוי. YouTube מחליף את האלמנט שמקבל ב-iframe,
// ולכן האלמנט נוצר כאן ידנית, מחוץ ל-React.
export function mountPlayer(
  holder: HTMLElement,
  videoId: string,
  playerVars: PlayerOptions['playerVars'],
  events: PlayerOptions['events'],
  onCreated?: (player: Player) => void,
) {
  let cancelled = false
  let player: Player | null = null
  const target = document.createElement('div')
  holder.appendChild(target)
  loadYouTubeApi().then((YT) => {
    if (cancelled) return
    player = new YT.Player(target, { videoId, host: 'https://www.youtube-nocookie.com', width: '100%', height: '100%', playerVars, events })
    onCreated?.(player)
  })
  return () => {
    cancelled = true
    player?.destroy()
    holder.replaceChildren()
  }
}
