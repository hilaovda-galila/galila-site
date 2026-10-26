import { Link } from 'react-router'
import Blocks from '../components/Blocks'
import Img from '../components/Img'
import Layout from '../components/Layout'
import { FacebookIcon, InstagramIcon, MailIcon, UsersIcon } from '../components/icons'
import { areas, paths, site } from '../config/site'
import { author, posts, type Post } from '../content'

const POST_CONTACT_INTRO = 'השאירו פרטים, ונחזור אלייך בשיחה טלפונית כדי לתאם מפגש היכרות ראשוני ללא עלות.'

const social = [
  { href: site.facebook, label: 'גלילה קבוצה חברתית', icon: FacebookIcon },
  { href: 'https://www.facebook.com/groups/1472658063366683/', label: 'קהילת "מדברים אוטיזם בגיל הרך"', icon: UsersIcon },
  { href: site.instagram, label: 'Instagram', icon: InstagramIcon },
  { href: `mailto:${site.email}`, label: site.email, icon: MailIcon },
]

export default function PostPage({ post }: { post: Post }) {
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <Layout title={post.metaTitle} contactIntro={POST_CONTACT_INTRO}>
      <article className="mx-auto max-w-[900px] px-5 py-8">
        <h1 className="text-[34px] leading-tight font-extrabold text-brand md:text-[52px]">{post.title}</h1>
        <p className="mt-4 flex flex-wrap gap-x-5 text-sm text-ink/70">
          <time dateTime={post.date}>{post.dateText}</time>
          <span>{post.author}</span>
        </p>

        <Blocks blocks={post.blocks} />

        {/* קישור מכל כתבה אל הקבוצות עצמן */}
        <div className="card mt-10 p-6 text-center">
          <p className="text-xl font-extrabold text-brand">הקבוצות החברתיות של גלילה</p>
          <p className="mt-2">קבוצות קטנות לילדים וילדות על הרצף בגילאי 4–9, לתרגול מיומנויות חברתיות:</p>
          <ul className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
            {areas.map((area) => (
              <li key={area.name}>
                <Link to={area.page} className="font-medium text-brand-deep underline hover:text-sky">
                  {area.name} – {area.groups[0].day}, {area.place}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <aside className="mt-10 flex flex-col items-center gap-5 border-t-[3px] border-sun pt-8 text-center sm:flex-row sm:text-start">
          <Img name={author.image} alt={author.name} sizes="100px" className="size-[100px] shrink-0 rounded-full object-cover" />
          <div>
            <p className="text-xl font-extrabold text-brand">{author.name}</p>
            <p className="mt-1">{author.bio}</p>
          </div>
        </aside>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-start">
          {social.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <a
                href={href}
                className="flex items-center gap-2 font-medium hover:text-brand-deep"
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <Icon className="size-5 text-brand" />
                <span className="break-all">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </article>

      <section className="mx-auto max-w-site px-5 pb-10" aria-labelledby="more-posts">
        <h2 id="more-posts" className="title mb-8 text-center">
          מאמרים נוספים
        </h2>
        <div className="grid gap-[30px] md:grid-cols-3">
          {more.map((p) => (
            <article key={p.slug} className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)]">
              <Link to={`/${p.slug}/`} tabIndex={-1} aria-hidden="true">
                <Img name={p.ogImage} alt="" sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[3/2] w-full object-cover" />
              </Link>
              <div className="p-5">
                <h3 className="text-[19px] leading-snug font-extrabold">
                  <Link to={`/${p.slug}/`} className="text-brand hover:text-sky">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-ink/60">{p.dateText}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link to={paths.blog} className="btn">
            לכל המאמרים
          </Link>
        </p>
      </section>
    </Layout>
  )
}
