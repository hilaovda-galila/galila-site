// התוכן המקורי של האתר, כפי שחולץ מהארכיון. גיבוי קריא נמצא ב-content-archive/*.md
import authorJson from './author.json'
import casesJson from './cases.json'
import homeJson from './home.json'
import postsJson from './posts.json'

export type Block = {
  id?: string
  type: string
  level?: number
  text?: string
  html?: string
  image?: string
  alt?: string
  href?: string
  youtube?: string
  items?: { text?: string; href?: string; q?: string; a?: string }[]
}

export type Post = {
  slug: string
  title: string
  metaTitle: string
  description: string
  ogImage: string
  date: string
  dateText: string
  author: string
  blocks: Block[]
}

export type Testimonial = { text: string; name: string; title: string; image: string }

export const posts = postsJson as Post[]
export const author = authorJson as { name: string; bio: string; image: string }
export const cases = casesJson as { metaTitle: string; description: string; blocks: Block[] }
export const home = homeJson as unknown as {
  metaTitle: string
  description: string
  widgets: Record<string, Block>
  testimonials: Testimonial[]
}
