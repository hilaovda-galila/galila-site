import type { ReactElement } from 'react'
import { Navigate } from 'react-router'
import { imageSrc } from './components/Img'
import { paths, redirects } from './config/site'
import { cases, home, posts, webinar } from './content'
import Blog, { blogMeta } from './pages/Blog'
import Cases from './pages/Cases'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PostPage from './pages/PostPage'
import Webinar from './pages/Webinar'

export type Page = {
  path: string
  title: string
  description: string
  image?: string
  element: ReactElement
}

// כל עמודי האתר, בכתובות המקוריות שלהם
export const pages: Page[] = [
  { path: '/', title: home.metaTitle, description: home.description, image: imageSrc('IMG-20230523-WA0016.jpg'), element: <Home /> },
  { path: paths.blog, ...blogMeta, element: <Blog /> },
  { path: paths.cases, title: 'תאורי מקרה | גלילה', description: cases.description, element: <Cases /> },
  { path: paths.webinar, title: 'הרשמה לוובינר | גלילה', description: webinar.description, element: <Webinar /> },
  ...posts.map((post) => ({
    path: `/${post.slug}/`,
    title: post.metaTitle,
    description: post.description,
    image: imageSrc(post.ogImage),
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
