import { Link } from 'react-router'
import Blocks, { Rich } from '../components/Blocks'
import Img from '../components/Img'
import Layout from '../components/Layout'
import Testimonials from '../components/Testimonials'
import { areas } from '../config/site'
import { home } from '../content'
import type { LandingPage as Page } from '../content/landing'
import { testimonials } from '../content/testimonials'

// תמונות הצוות מעמוד הבית, לפי מזהה הווידג'ט המקורי
const teamPhotos: Record<string, { image?: string; id: string }> = {
  'הילה עובדה': { image: home.widgets['9bbbc86']?.image, id: 'hila' },
  'גלית ברנהולץ': { image: home.widgets['378270b']?.image, id: 'galit' },
}

const mapsLink = (address: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
const wazeLink = (address: string) => `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`

// עמוד תוכן כללי: עמודי הערים, מדריך המיומנויות החברתיות ועמוד הצוות (התוכן ב-src/content/landing-pages.json)
export default function LandingPage({ page }: { page: Page }) {
  const area = page.area ? areas.find((a) => a.name === page.area) : undefined
  const crumb = page.kind === 'guide' ? { to: '/autism-blog-parents/', label: 'בלוג' } : undefined

  return (
    <Layout title={page.title} contactIntro={page.cta || undefined} contactArea={area?.name}>
      <article className="mx-auto max-w-[900px] px-5 py-10">
        <nav aria-label="פירורי לחם" className="mb-4 text-sm text-ink/70">
          <Link to="/" className="hover:text-brand-deep">
            ראשי
          </Link>
          {crumb && (
            <>
              {' '}
              »{' '}
              <Link to={crumb.to} className="hover:text-brand-deep">
                {crumb.label}
              </Link>
            </>
          )}{' '}
          » {page.h1}
        </nav>

        <header className="text-center">
          <h1 className="title">{page.h1}</h1>
          <span className="divider mx-auto my-5" />
          {page.subtitle && <p className="text-[20px] leading-snug font-extrabold text-brand md:text-[23px]">{page.subtitle}</p>}
        </header>

        <Rich html={page.intro} className="mt-6 text-lg" />

        {page.sections.map((section) => {
          const person = page.kind === 'team' ? teamPhotos[section.h2] : undefined
          const isPlace = Boolean(area) && section.h2.startsWith('איפה נפגשים')
          const isTestimonials = /המלצות|ממליצים/.test(section.h2)
          const isFaq = section.h2.includes('שאלות נפוצות')
          return (
            <section key={section.h2} id={person?.id} className="mt-12 scroll-mt-6">
              <h2 className="mb-4 text-[28px] leading-tight font-extrabold text-brand md:text-[34px]">{section.h2}</h2>
              {person?.image && (
                <div className="mb-5 size-[150px] overflow-hidden rounded-full bg-powder ring-4 ring-brand-soft/50">
                  <Img name={person.image} alt={section.h2} sizes="150px" className="size-full object-cover object-top" />
                </div>
              )}
              <Rich html={section.html} />
              {isPlace && area && (
                <p className="mt-4 flex flex-wrap gap-3">
                  <a href={mapsLink(area.address)} target="_blank" rel="noopener noreferrer" className="btn rounded-lg">
                    ניווט בגוגל מפות
                  </a>
                  <a href={wazeLink(area.address)} target="_blank" rel="noopener noreferrer" className="btn rounded-lg">
                    ניווט ב-Waze
                  </a>
                </p>
              )}
              {isTestimonials && (
                <div className="mt-6">
                  <Testimonials items={testimonials} />
                </div>
              )}
              {isFaq && page.faq.length > 0 && <Blocks blocks={[{ type: 'faq', items: page.faq }]} />}
            </section>
          )
        })}

        {/* שאלות נפוצות לעמוד שאין בו מקטע ייעודי להן */}
        {page.faq.length > 0 && !page.sections.some((s) => s.h2.includes('שאלות נפוצות')) && (
          <section className="mt-12">
            <h2 className="mb-4 text-[28px] leading-tight font-extrabold text-brand md:text-[34px]">שאלות נפוצות</h2>
            <Blocks blocks={[{ type: 'faq', items: page.faq }]} />
          </section>
        )}
      </article>
    </Layout>
  )
}
