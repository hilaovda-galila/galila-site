import { Link } from 'react-router'
import Img from '../components/Img'
import Layout from '../components/Layout'
import { posts } from '../content'

export const blogMeta = {
  title: 'בלוג להורים לילדים על הרצף - ידע וכלים מעשיים | גלילה',
  description:
    'בלוג מקצועי ונגיש להורים לילדים עם אוטיזם ASD – על תקשורת, הורות, אספרגר, טיפול בתא לחץ, בדיקת אקסום, קריספר, תסמונת ויליאמס ועוד',
}

export default function Blog() {
  return (
    <Layout title={blogMeta.title}>
      <div className="mx-auto max-w-site px-5 py-8">
        <nav aria-label="פירורי לחם" className="mb-4 text-sm text-ink/70">
          <Link to="/" className="hover:text-brand-deep">
            ראשי
          </Link>{' '}
          » בלוג
        </nav>
        <h1 className="title mb-10 text-center">מאמרים בנושא אוטיזם ASD</h1>

        <div className="grid gap-x-[30px] gap-y-[35px] md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="flex flex-col bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)]">
              <Link to={`/${post.slug}/`} tabIndex={-1} aria-hidden="true">
                <Img name={post.ogImage} alt="" className="aspect-[3/2] w-full object-cover" />
              </Link>
              <div className="flex grow flex-col p-5">
                <h2 className="text-[21px] leading-snug font-extrabold">
                  <Link to={`/${post.slug}/`} className="text-brand hover:text-sky">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-ink/60">{post.dateText}</p>
                <p className="mt-3 grow text-[15px] text-ink/80">{post.description}</p>
                <Link to={`/${post.slug}/`} className="mt-4 text-sm font-medium text-brand-deep hover:text-sky" aria-label={`קראו עוד: ${post.title}`}>
                  קראו עוד »
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  )
}
