import { Rich } from '../components/Blocks'
import Img from '../components/Img'
import Layout from '../components/Layout'
import { cases, type Block } from '../content'

const CASES_CONTACT_INTRO = 'מלאי את הטופס ותלחצי שליחה, ונחזור אלייך בשיחה טלפונית כדי לתאם מפגש היכרות ראשוני ללא עלות.'

const intro = cases.blocks.find((b) => b.type === 'heading')

// כל תיאור מקרה הוא טקסט ואחריו התמונה שליוותה אותו
const stories = cases.blocks.reduce<{ text: Block; image?: Block }[]>((list, block) => {
  if (block.type === 'html') list.push({ text: block })
  else if (block.type === 'image' && list.length) list[list.length - 1].image = block
  return list
}, [])

export default function Cases() {
  return (
    <Layout title="תאורי מקרה | גלילה" contactIntro={CASES_CONTACT_INTRO}>
      <div className="mx-auto max-w-site px-5 py-8">
        <h1 className="title text-center">תאורי מקרה</h1>
        {intro && <p className="mx-auto mt-5 max-w-[1000px] text-center text-[20px] leading-snug font-extrabold text-brand md:text-[23px]">{intro.text}</p>}

        {stories.map((story, i) => (
          <article
            key={story.text.id ?? i}
            className="card mt-10 grid items-start gap-6 border-b-[3px] border-b-brand-soft p-5 md:grid-cols-[2fr_1fr] md:p-8"
          >
            <Rich html={story.text.html} />
            <Img name={story.image?.image} alt={story.image?.alt} className="mx-auto max-h-[520px] w-auto max-w-full rounded-[5px]" />
          </article>
        ))}
      </div>
    </Layout>
  )
}
