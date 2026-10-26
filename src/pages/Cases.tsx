import { Rich } from '../components/Blocks'
import { areas } from '../config/site'
import Img from '../components/Img'
import Layout from '../components/Layout'
import { cases, type Block } from '../content'

const CASES_CONTACT_INTRO = 'מלאי את הטופס ותלחצי שליחה, ונחזור אלייך בשיחה טלפונית ללא עלות, כדי לתאם מפגש היכרות.'

const intro = cases.blocks.find((b) => b.type === 'heading')

// כל תיאור מקרה הוא טקסט ואחריו התמונה שליוותה אותו
const stories = cases.blocks.reduce<{ text: Block; image?: Block }[]>((list, block) => {
  if (block.type === 'html') list.push({ text: block })
  else if (block.type === 'image' && list.length) list[list.length - 1].image = block
  return list
}, [])

// הסתרת פסקת מילות המפתח שבסוף כל סיפור: רק אחרי אישור הלקוחה. עד אז false, והסיפור מוצג במלואו.
// גם כשמסתירים, הטקסט נשמר ב-cases.json וב-content-archive.
const HIDE_KEYWORD_LINES = false

// השורה המודגשת הראשונה בכל סיפור מוצגת ככותרת (h2), באותן מילים.
function splitStory(html = '') {
  const m = html.match(/^<p><strong>([\s\S]*?)<\/strong><\/p>/)
  const heading = m ? m[1].replace(/&nbsp;/g, ' ').trim() : undefined
  let body = m ? html.slice(m[0].length) : html
  if (HIDE_KEYWORD_LINES) body = body.replace(/<p>[^<]*(?:<strong><br><\/strong>)?<\/p>\s*$/, '')
  return { heading, body }
}

export default function Cases() {
  return (
    <Layout title="תיאורי מקרה מהקבוצה החברתית לילדים על הרצף | גלילה" contactIntro={CASES_CONTACT_INTRO}>
      <div className="mx-auto max-w-site px-5 py-8">
        <h1 className="title text-center">תיאורי מקרה מהקבוצה החברתית לילדים על הרצף</h1>
        {intro && <p className="mx-auto mt-5 max-w-[1000px] text-center text-[20px] leading-snug font-extrabold text-brand md:text-[23px]">{intro.text}</p>}

        {stories.map((story, i) => {
          const { heading, body } = splitStory(story.text.html)
          return (
            <article
              key={story.text.id ?? i}
              className="card mt-10 grid items-start gap-6 border-b-[3px] border-b-brand-soft p-5 md:grid-cols-[2fr_1fr] md:p-8"
            >
              <div>
                {heading && <h2 className="mb-4 text-[18px] leading-snug font-bold">{heading}</h2>}
                <Rich html={body} />
              </div>
              <Img name={story.image?.image} alt={story.image?.alt} sizes="(min-width: 768px) 33vw, 100vw" className="mx-auto max-h-[520px] w-auto max-w-full rounded-[5px]" />
            </article>
          )
        })}

        <section className="card mx-auto mt-12 max-w-[1000px] p-6 text-center md:p-10">
          <h2 className="title">איך מצטרפים לקבוצה חברתית לילדים על הרצף?</h2>
          <p className="mt-4 text-[18px]">בקבוצה ילדים לומדים לפתח מיומנויות חברתיות וכישורים בין-אישיים בסביבה תומכת, ולצד מטרות הקבוצה כל ילד מקבל מטרות טיפוליות אישיות שמתאימות לו. הקבוצות נפגשות בשני מקומות:</p>
          <ul className="mt-4 space-y-2 text-[18px]">
            {areas.map((area) => (
              <li key={area.name}>
                <strong>{area.name}</strong>: {area.place}, {area.address} – {area.groups[0]?.day}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[18px]">
            את הקבוצות בכל עיר לפי גיל ושעה תמצאו{' '}
            <a href="/#adven" className="text-brand-deep underline hover:text-sky">בעמוד הבית, בחלק "השירותים שלנו"</a>. ואפשר גם פשוט להשאיר פרטים בטופס כאן למטה.
          </p>
        </section>
      </div>
    </Layout>
  )
}
