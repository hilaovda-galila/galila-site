import { useState } from 'react'
import { Link } from 'react-router'
import AuthDialog from '../components/AuthDialog'
import Img, { imageSrc } from '../components/Img'
import Layout from '../components/Layout'
import { paths } from '../config/site'
import { ACCESS_DAYS, courseMinutes, courses, type Course } from '../content/courses'
import { DEMO_MODE, isActive, useSession } from '../lib/session'

export const coursesMeta = {
  title: 'קורסים דיגיטליים להורים | גלילה',
  description: 'קורסים מקוונים קצרים להורים לילדים על הרצף האוטיסטי: כלים מעשיים לוויסות רגשי, משחק חברתי ותקשורת, לצפייה מהבית.',
}

export function DemoNotice() {
  if (!DEMO_MODE) return null
  return (
    <p className="mx-auto mb-8 max-w-[760px] rounded-xl bg-sun/30 px-4 py-3 text-center text-sm">
      עמוד בהקמה: הקורסים והמחירים המוצגים הם דוגמה בלבד, ועדיין אין הרשמה או תשלום אמיתיים.
    </p>
  )
}

export function CourseCover({ course, className = '' }: { course: Course; className?: string }) {
  return imageSrc(course.image) ? (
    <Img name={course.image} alt="" className={`w-full object-cover ${className}`} />
  ) : (
    <div className={`flex w-full items-center justify-center bg-linear-to-br from-powder to-sun/40 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-14 text-brand/70">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  )
}

export default function Courses() {
  const { session } = useSession()
  const [buying, setBuying] = useState<Course | null>(null)

  return (
    <Layout title={coursesMeta.title}>
      <div className="mx-auto max-w-site px-5 py-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="title">קורסים דיגיטליים</h1>
          <span className="divider my-5" />
          <p className="mb-6 max-w-[680px] text-lg">
            קורסים מקוונים קצרים להורים, עם כלים מעשיים מהעבודה שלנו בקבוצות. כל רכישה פותחת גישה לצפייה למשך {ACCESS_DAYS} יום.
          </p>
          <Link to={paths.myCourses} className="mb-8 font-medium text-brand-deep underline hover:text-sky">
            {session ? 'לקורסים שלי' : 'כבר רכשת? כניסה לאזור הצפייה'}
          </Link>
        </div>

        <DemoNotice />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const owned = session?.enrollments.some((e) => e.courseSlug === course.slug && isActive(e))
            return (
              <article key={course.slug} className="card flex flex-col overflow-hidden">
                <CourseCover course={course} className="aspect-[16/9]" />
                <div className="flex grow flex-col p-6 text-center">
                  <h2 className="text-[23px] leading-snug font-extrabold text-brand">{course.title}</h2>
                  <p className="mt-3 grow">{course.summary}</p>
                  <p className="mt-4 text-[15px] text-ink/75">
                    {course.lessons.length} פרקים · כ-{courseMinutes(course)} דקות · גישה ל-{ACCESS_DAYS} יום
                  </p>
                  <p className="mt-3 text-[28px] leading-none font-extrabold">₪{course.priceILS}</p>
                  {owned ? (
                    <Link to={paths.myCourses} className="btn mt-5 rounded-lg py-3.5 text-base hover:scale-100 hover:brightness-110">
                      לצפייה בקורס
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setBuying(course)}
                      className="btn mt-5 cursor-pointer rounded-lg py-3.5 text-base hover:scale-100 hover:brightness-110"
                    >
                      לרכישת הקורס
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {buying && <AuthDialog course={buying} onClose={() => setBuying(null)} />}
    </Layout>
  )
}
