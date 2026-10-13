import type { ReactElement } from 'react'
import { Navigate } from 'react-router'
import ComingSoon from './components/ComingSoon'
import { imageSrc } from './components/Img'
import { COURSES_OPEN } from './content/courses'
import { paths, redirects } from './config/site'
import { cases, home, posts } from './content'
import Blog, { blogMeta } from './pages/Blog'
import Cases from './pages/Cases'
import Courses, { coursesMeta } from './pages/Courses'
import MyCourses from './pages/MyCourses'
import { organizationLd, postLd } from './seo'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PostPage from './pages/PostPage'

export type Page = {
  path: string
  title: string
  description: string
  image?: string
  // עמוד אישי שלא אמור להופיע בגוגל
  private?: boolean
  // נתונים מובנים (schema.org) למנועי חיפוש ולעוזרי בינה מלאכותית – ראו src/seo.ts
  jsonLd?: object[]
  element: ReactElement
}

// כל עמודי האתר, בכתובות המקוריות שלהם
export const pages: Page[] = [
  { path: '/', title: home.metaTitle, description: home.description, image: imageSrc('IMG-20230523-WA0016.jpg'), jsonLd: [organizationLd], element: <Home /> },
  { path: paths.blog, ...blogMeta, element: <Blog /> },
  { path: paths.cases, title: 'תאורי מקרה | גלילה', description: cases.description, element: <Cases /> },
  // עד שהקורסים נפתחים (COURSES_OPEN) שני העמודים מציגים חלונית "בקרוב" ולא נכנסים למפת האתר
  COURSES_OPEN
    ? { path: paths.courses, ...coursesMeta, element: <Courses /> }
    : { path: paths.courses, title: 'קורסים דיגיטליים – בקרוב | גלילה', description: 'בקרוב: קורסים דיגיטליים להורים מבית גלילה.', private: true, element: <ComingSoon /> },
  // אזור אישי: נוצר מראש רק עם שער הכניסה, בלי תוכן, ולא נכנס למפת האתר
  {
    path: paths.myCourses,
    title: 'הקורסים שלי | גלילה',
    description: 'אזור הצפייה להורים בקורסים הדיגיטליים של גלילה.',
    private: true,
    element: COURSES_OPEN ? <MyCourses /> : <ComingSoon />,
  },
  ...posts.map((post) => ({
    path: `/${post.slug}/`,
    title: post.metaTitle,
    description: post.description,
    image: imageSrc(post.ogImage),
    jsonLd: postLd(post),
    element: <PostPage post={post} />,
  })),
]

export function normalizePath(pathname: string) {
  let path = pathname
  try {
    path = decodeURIComponent(pathname)
  } catch {
    // נתיב עם קידוד שגוי נשאר כמו שהוא
  }
  return path.endsWith('/') ? path : `${path}/`
}

export function resolve(pathname: string): ReactElement {
  const path = normalizePath(pathname)
  const page = pages.find((p) => p.path === path)
  if (page) return page.element
  if (redirects[path]) return <Navigate to={redirects[path]} replace />
  return <NotFound />
}
