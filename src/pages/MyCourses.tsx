import { useState } from 'react'
import { Link } from 'react-router'
import AuthDialog from '../components/AuthDialog'
import Layout from '../components/Layout'
import LiteYouTube from '../components/LiteYouTube'
import { paths } from '../config/site'
import { courseMinutes, courses, type Course } from '../content/courses'
import { daysLeft, isActive, signOut, useSession, type Enrollment } from '../lib/session'
import { CourseCover, DemoNotice } from './Courses'

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })

function Player({ course }: { course: Course }) {
  const [index, setIndex] = useState(0)
  const lesson = course.lessons[index]

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div>
        {lesson.videoId ? (
          <LiteYouTube key={lesson.videoId} id={lesson.videoId} title={lesson.title} className="!aspect-video" />
        ) : (
          // TODO: נגן הווידאו המוגן (קישור חתום מהשרת) – כרגע אין סרטונים לפרקים
          <div className="flex aspect-video items-center justify-center rounded-2xl bg-sand p-6 text-center text-ink/70">הסרטון של הפרק יופיע כאן</div>
        )}
        <h3 className="mt-4 text-[23px] leading-snug font-extrabold text-brand">
          פרק {index + 1}: {lesson.title}
        </h3>
        <p className="mt-1 text-ink/70">{lesson.minutes} דקות</p>
      </div>

      <ol className="card self-start overflow-hidden" aria-label="פרקי הקורס">
        {course.lessons.map((item, i) => (
          <li key={item.title} className="border-b border-brand-soft/60 last:border-b-0">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-current={i === index}
              className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-start transition-colors hover:bg-powder ${i === index ? 'bg-powder font-semibold' : ''}`}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-ink">{i + 1}</span>
              <span className="grow">{item.title}</span>
              <span className="shrink-0 text-sm text-ink/60">{item.minutes} דק׳</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function MyCourses() {
  const { session, ready } = useSession()
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const [dialog, setDialog] = useState<{ course?: Course } | null>(null)

  const owned = (session?.enrollments ?? [])
    .map((enrollment) => ({ enrollment, course: courses.find((c) => c.slug === enrollment.courseSlug) }))
    .filter((item): item is { enrollment: Enrollment; course: Course } => Boolean(item.course))
  const open = owned.find((item) => item.course.slug === openSlug && isActive(item.enrollment))

  return (
    <Layout title="הקורסים שלי | גלילה" contact={false}>
      <div className="mx-auto min-h-[50vh] max-w-site px-5 py-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="title">הקורסים שלי</h1>
          <span className="divider my-5" />
        </div>
        <DemoNotice />

        {/* שער הגישה: בלי משתמש מחובר לא מוצג שום תוכן של קורס */}
        {!ready ? (
          <p className="text-center text-ink/70" role="status">
            טוען…
          </p>
        ) : !session ? (
          <div className="card mx-auto max-w-[520px] p-8 text-center">
            <h2 className="text-[26px] leading-tight font-extrabold text-brand">אזור הצפייה מיועד להורים רשומים</h2>
            <p className="mt-3">כדי לצפות בקורסים שרכשת צריך להתחבר.</p>
            <button type="button" onClick={() => setDialog({})} className="btn mt-6 cursor-pointer rounded-lg px-8 py-3.5 text-base hover:scale-100 hover:brightness-110">
              התחברות / הרשמה
            </button>
            <p className="mt-5">
              <Link to={paths.courses} className="font-medium text-brand-deep underline hover:text-sky">
                לקטלוג הקורסים
              </Link>
            </p>
          </div>
        ) : (
          <>
            <p className="mb-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
              <span>
                שלום {session.name} · <span dir="ltr">{session.email}</span>
              </span>
              <button type="button" onClick={signOut} className="cursor-pointer font-medium text-brand-deep underline hover:text-sky">
                התנתקות
              </button>
            </p>

            {open ? (
              <section aria-labelledby="player-title">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h2 id="player-title" className="text-[28px] leading-tight font-extrabold">
                    {open.course.title}
                  </h2>
                  <button type="button" onClick={() => setOpenSlug(null)} className="cursor-pointer font-medium text-brand-deep underline hover:text-sky">
                    חזרה לכל הקורסים שלי
                  </button>
                </div>
                <p className="mb-5 inline-block rounded-full bg-powder px-4 py-1.5 font-medium text-brand-deep">
                  הגישה בתוקף עד {formatDate(open.enrollment.expiresAt)} · נותרו {daysLeft(open.enrollment)} ימים
                </p>
                <Player key={open.course.slug} course={open.course} />
              </section>
            ) : owned.length === 0 ? (
              <div className="card mx-auto max-w-[520px] p-8 text-center">
                <p className="text-lg">עדיין אין לך קורסים פעילים.</p>
                <Link to={paths.courses} className="btn mt-5 rounded-lg px-8 py-3.5 text-base hover:scale-100 hover:brightness-110">
                  לקטלוג הקורסים
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {owned.map(({ course, enrollment }) => {
                  const active = isActive(enrollment)
                  return (
                    <article key={course.slug} className="card flex flex-col overflow-hidden">
                      <CourseCover course={course} className={`aspect-[16/9] ${active ? '' : 'opacity-50'}`} />
                      <div className="flex grow flex-col p-6 text-center">
                        <h2 className="text-[23px] leading-snug font-extrabold text-brand">{course.title}</h2>
                        <p className="mt-2 text-[15px] text-ink/75">
                          {course.lessons.length} פרקים · כ-{courseMinutes(course)} דקות
                        </p>
                        <p className={`mt-4 grow font-medium ${active ? '' : 'text-brand-deep'}`}>
                          {active
                            ? `הגישה בתוקף עד ${formatDate(enrollment.expiresAt)} (נותרו ${daysLeft(enrollment)} ימים)`
                            : `הגישה הסתיימה ב-${formatDate(enrollment.expiresAt)}`}
                        </p>
                        <button
                          type="button"
                          onClick={() => (active ? setOpenSlug(course.slug) : setDialog({ course }))}
                          className="btn mt-5 cursor-pointer rounded-lg py-3.5 text-base hover:scale-100 hover:brightness-110"
                        >
                          {active ? 'לצפייה בקורס' : 'חידוש הגישה'}
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {dialog && <AuthDialog course={dialog.course} onClose={() => setDialog(null)} />}
    </Layout>
  )
}
