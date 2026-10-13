import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import Layout from './Layout'

// מוצג בעמודי הקורסים כל עוד COURSES_OPEN כבוי: חלונית "בקרוב", שסגירתה מחזירה לדף הבית
export default function ComingSoon() {
  const navigate = useNavigate()
  const closeButton = useRef<HTMLButtonElement>(null)
  const close = () => navigate('/')

  useEffect(() => {
    closeButton.current?.focus()
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && navigate('/')
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <Layout title="קורסים דיגיטליים – בקרוב | גלילה" contact={false}>
      <div className="mx-auto flex min-h-[60vh] max-w-site flex-col items-center px-5 py-10 text-center">
        <h1 className="title">קורסים דיגיטליים</h1>
        <span className="divider my-5" />
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={close}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="soon-title"
          aria-describedby="soon-text"
          className="card relative w-full max-w-[460px] p-8 text-center md:p-10"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            ref={closeButton}
            type="button"
            onClick={close}
            aria-label="סגירה וחזרה לדף הבית"
            className="absolute end-3 top-3 flex size-11 cursor-pointer items-center justify-center rounded-full text-3xl leading-none text-ink/60 hover:bg-powder hover:text-ink"
          >
            ×
          </button>
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-powder text-brand" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-8 translate-x-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <h2 id="soon-title" className="mt-5 text-[30px] leading-tight font-extrabold text-brand">
            בקרוב!
          </h2>
          <p id="soon-text" className="mt-3 text-lg">
            בקרוב יהיו כאן קורסים דיגיטליים להורים.
          </p>
          <button type="button" onClick={close} className="btn mt-7 cursor-pointer rounded-lg px-8 py-3.5 text-base hover:scale-100 hover:brightness-110">
            חזרה לדף הבית
          </button>
        </div>
      </div>
    </Layout>
  )
}
