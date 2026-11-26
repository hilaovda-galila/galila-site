import { useState } from 'react'
import { Link } from 'react-router'
import AuthDialog from '../components/AuthDialog'
import Layout from '../components/Layout'
import { paths } from '../config/site'
import { ACCESS_DAYS, courseMinutes, type Course } from '../content/courses'
import { isActive, useSession } from '../lib/session'
import { CourseCover, DemoNotice } from './Courses'

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
    <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 0 1 4 0v2h-4V7Z" />
  </svg>
)

// עמוד קורס: מה בקורס (הסרטונים ואורכם), למי הוא מתאים, ותיבת רכישה.
// הסרטונים עצמם נפתחים רק באזור הצפייה ("הקורסים שלי") אחרי רכישה.
export default function CoursePage({ course }: { course: Course }) {
  const { session } = useSession()
  const [buying, setBuying] = useState(false)
  const owned = session?.enrollments.some((e) => e.courseSlug === course.slug && isActive(e))
  const minutes = courseMinutes(course)

  const purchase = (
    <div className="card p-6 text-center">
      <p className="text-[34px] leading-none font-extrabold">₪{course.priceILS}</p>
      <p className="mt-2 text-[15px] text-ink/75">תשלום חד-פעמי</p>
      {owned ? (
        <Link to={paths.myCourses} className="btn mt-5 block rounded-lg py-3.5 text-base hover:scale-100 hover:brightness-110">
          לצפייה בקורס
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setBuying(true)}
          className="btn mt-5 w-full cursor-pointer rounded-lg py-3.5 text-base hover:scale-100 hover:brightness-110"
        >
          לרכישת הקורס
        </button>
      )}
      <ul className="mt-5 space-y-1.5 text-start text-[15px]">
        <li>✓ {course.lessons.length} סרטונים, כ-{minutes} דקות</li>
        <li>✓ הגישה נפתחת מיד אחרי התשלום</li>
        <li>✓ צפייה מכל מכשיר, למשך {ACCESS_DAYS} יום</li>
      </ul>
    </div>
  )

  return (
    <Layout title={`${course.title} – קורס דיגיטלי להורים | גלילה`} contact={false}>
      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <nav aria-label="פירורי לחם" className="mb-4 text-sm text-ink/70">
          <Link to={paths.courses} className="hover:text-brand-deep">
            קורסים דיגיטליים
          </Link>{' '}
          » {course.title}
        </nav>
        <DemoNotice />

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <CourseCover course={course} className="aspect-[16/9] rounded-2xl" />
            <h1 className="mt-6 text-[34px] leading-tight font-extrabold text-brand md:text-[44px]">{course.title}</h1>
            <p className="mt-3 text-lg">{course.summary}</p>
            <p className="mt-3 text-[15px] text-ink/75">
              {course.lessons.length} סרטונים · כ-{minutes} דקות · גישה ל-{ACCESS_DAYS} יום
            </p>

            {/* בטלפון תיבת הרכישה מופיעה כאן, מיד אחרי הפתיחה; במחשב היא בעמודה שבצד */}
            <div className="mt-6 lg:hidden">{purchase}</div>

            <section aria-labelledby="lessons" className="mt-10">
              <h2 id="lessons" className="mb-4 text-[26px] leading-tight font-extrabold text-brand md:text-[30px]">
                מה בקורס
              </h2>
              <ol className="space-y-3">
                {course.lessons.map((lesson, i) => (
                  <li key={lesson.title} className="card flex items-start gap-4 p-4 md:p-5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand font-semibold text-ink">{i + 1}</span>
                    <div className="grow">
                      <h3 className="text-lg leading-snug font-bold">{lesson.title}</h3>
                      <p className="mt-1">{lesson.summary}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 text-sm text-ink/60">
                      {lesson.minutes} דק׳
                      {!owned && <LockIcon />}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <section aria-labelledby="outcomes" className="card p-6">
                <h2 id="outcomes" className="mb-3 text-[22px] font-extrabold text-brand">
                  מה תקבלו מהקורס
                </h2>
                <ul className="list-disc space-y-1.5 ps-5">
                  {course.outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section aria-labelledby="audience" className="card p-6">
                <h2 id="audience" className="mb-3 text-[22px] font-extrabold text-brand">
                  למי הקורס מתאים
                </h2>
                <ul className="list-disc space-y-1.5 ps-5">
                  {course.audience.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6">{purchase}</div>
          </aside>
        </div>
      </div>

      {buying && <AuthDialog course={course} onClose={() => setBuying(false)} />}
    </Layout>
  )
}
