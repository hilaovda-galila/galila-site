import BannerVideo from '../components/BannerVideo'
import { Rich } from '../components/Blocks'
import Img from '../components/Img'
import Layout from '../components/Layout'
import ShortsSequence from '../components/ShortsSequence'
import Testimonials from '../components/Testimonials'
import { PinIcon } from '../components/icons'
import { areas, introVideo, shorts, site, youtubeChannel } from '../config/site'
import { home } from '../content'
import { testimonials } from '../content/testimonials'

// המזהים הם מזהי הווידג'טים של העמוד המקורי ב-Elementor (ראו src/content/home.json)
const w = home.widgets
const CTA = 'אני רוצה לשמוע עוד בשיחה טלפונית'

const advantages = [
  { image: '496fdfbd', text: 'f6e16f6' },
  { image: '4dc0fae8', text: 'b130aad' },
  { image: '74bde379', text: 'ad309b7' },
]

const team = [
  { name: '1704531', text: '291b3a6', image: '9bbbc86' },
  { name: '8764d0f', text: '1ec4d50', image: '378270b' },
]

export default function Home() {
  return (
    <Layout title={home.metaTitle} contactIntro={w['9e3b821']?.html?.replace(/<[^>]+>/g, '')}>
      {/* סרטון ההיכרות – לכל רוחב האתר, מתחת לתפריט ומעל הלוגו */}
      <section className="mx-auto max-w-site" aria-label="סרטון היכרות">
        <BannerVideo id={introVideo.id} title={introVideo.title} />
      </section>

      {/* פתיח */}
      <section className="mx-auto flex max-w-site flex-col items-center gap-[11px] px-2.5 py-2.5 text-center">
        <Img name="גלילה-600-pix.png" alt="גלילה – קבוצות חברתיות" loading="eager" sizes="(min-width: 700px) 420px, 60vw" className="w-[60%] max-w-[420px]" />
        <h1 className="text-[32px] leading-tight font-extrabold text-brand md:text-[41px]">{w['4d9b430'].text}</h1>
        <p className="text-[20px] leading-tight font-extrabold text-brand md:text-[23px]">{w['c7af937'].text}</p>
        <Rich html={w['20fdeab'].html} />
        <a href={site.phoneHref} className="btn mb-6">
          {w['cbf0f2c'].text}
        </a>
      </section>

      {/* אודותינו */}
      <section id="about" className="px-2.5 py-[60px] md:px-5 lg:px-0 lg:py-20">
        <span id="2" />
        {/* הטקסט "מלווה" את הגלילה לצד התמונה (ראו .follow ב-index.css) */}
        <div className="mx-auto grid max-w-site items-start gap-8 px-2.5 md:grid-cols-2">
          <div className="follow text-center">
            <h2 className="title">{w['3ba5a54d'].text}</h2>
            <span className="divider mx-auto my-5" />
            <Rich html={w['23f1335a'].html} className="mb-5" />
            <a href="#contact" className="btn">
              {CTA}
            </a>
          </div>
          <Img name={w['89acc0e'].image} alt={w['89acc0e'].alt} sizes="(min-width: 768px) 640px, 100vw" className="mx-auto w-full max-w-[640px]" />
        </div>
      </section>

      {/* השירותים שלנו */}
      <section id="adven" className="bg-sand px-5 py-16 md:py-20">
        <span id="3" />
        <div className="mx-auto flex max-w-[1100px] flex-col items-center">
          <h2 className="title text-center">{w['65f38e61'].text}</h2>
          <span className="divider my-5" />
          <p className="mb-10 max-w-[640px] text-center text-lg">קבוצות חברתיות לילדים על הספקטרום האוטיסטי, בקבוצות קטנות לפי גיל.</p>

          <div className="grid w-full gap-8 md:grid-cols-2">
            {areas.map((area) => (
              <div key={area.name} className="text-center">
                <h3 className="flex items-center justify-center gap-2 text-[28px] leading-tight font-extrabold text-brand">
                  <PinIcon className="size-6 shrink-0" />
                  {area.name}
                </h3>
                <p className="mt-1 mb-4 text-ink/75">
                  {area.place} · {area.address}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {area.groups.map((group) => (
                    <article key={group.title} className="card p-5">
                      <h4 className="text-xl leading-snug font-semibold">{group.title}</h4>
                      <p className="mt-3 inline-block rounded-full bg-powder px-3 py-1 text-[15px] font-medium text-brand-deep">
                        {group.day} · {group.time}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <a href="#contact" className="btn mt-10">
            {CTA}
          </a>
        </div>
      </section>

      {/* המודל שלנו */}
      <section className="mx-auto max-w-site">
        <span id="4" />
        {/* הצד הקצר מבין השניים "מלווה" את הגלילה לצד הארוך */}
        <div className="grid items-start md:grid-cols-2">
          <div className="follow p-2.5">
            {/* במחשב התמונה מוצגת בחיתוך גבוה, כדי שלטקסט שלצידה יהיה מרחק ללוות את הגלילה */}
            <Img name={w['a35332b'].image} alt={w['a35332b'].alt} sizes="(min-width: 768px) 50vw, 100vw" className="w-full object-cover md:aspect-[4/5]" />
          </div>
          <div className="follow p-2.5 text-center md:px-8">
            <h2 className="title">{w['3aba3dd'].text}</h2>
            <span className="divider mx-auto my-5" />
            <Rich html={w['f8d558e'].html} />
          </div>
        </div>
      </section>

      {/* היתרונות שלנו */}
      <section id="services" className="px-2.5 py-[60px] md:px-5 lg:px-0">
        <span id="5" />
        <div className="mx-auto max-w-site">
          <span className="divider mx-auto mb-5" />
          <div className="grid lg:grid-cols-3">
            {advantages.map((card) => (
              <article
                key={card.text}
                className="card m-[5px] overflow-hidden border-b-[3px] border-b-brand-soft pb-[15px] md:m-[15px]"
              >
                <Img name={w[card.image].image} alt={w[card.image].alt} sizes="(min-width: 1024px) 33vw, 100vw" className="h-[321px] w-full object-cover md:h-[412px]" />
                <Rich html={w[card.text].html} className="p-5 text-center" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* הצוות שלנו */}
      <section className="mx-auto max-w-[1100px] px-5 py-10">
        <span id="6" />
        <h2 className="title mb-10 text-center">{w['718463c'].text}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {team.map((member) => (
            <article key={member.name} className="card flex flex-col items-center p-6 text-center md:p-8">
              <div className="size-[170px] shrink-0 overflow-hidden rounded-full bg-powder ring-4 ring-brand-soft/50">
                <Img name={w[member.image].image} alt={w[member.name].text} sizes="170px" className="size-full object-cover object-top" />
              </div>
              <h3 className="mt-5 mb-3 text-[30px] leading-tight font-semibold text-brand">{w[member.name].text}</h3>
              <Rich html={w[member.text].html} />
            </article>
          ))}
        </div>
      </section>

      {/* הורים ממליצים */}
      <section className="mx-auto max-w-site px-2.5 py-2.5">
        <span id="13" />
        <h2 className="title mb-6 text-center">{w['3ec2969'].text}</h2>
        <Testimonials items={testimonials} />
      </section>

      {/* תובנות וטיפים מהשטח */}
      <section id="tips" className="mx-auto max-w-[1100px] px-5 py-14" aria-labelledby="tips-title">
        <div className="flex flex-col items-center">
          <h2 id="tips-title" className="title text-center">
            תובנות וטיפים מהשטח
          </h2>
          <span className="divider my-5" />
          <p className="mb-10 max-w-[640px] text-center text-lg">סרטונים קצרים מערוץ היוטיוב של גלילה, עם כלים מעשיים להורים לילדים על הרצף.</p>

          <ShortsSequence videos={shorts} />

          <a href={youtubeChannel} target="_blank" rel="noopener noreferrer" className="btn mt-10 leading-snug">
            לצפייה בכל הסרטונים והטיפים בערוץ היוטיוב שלנו
          </a>
        </div>
      </section>
    </Layout>
  )
}
