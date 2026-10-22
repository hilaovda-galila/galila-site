import type { Block } from '../content'
import Img from './Img'
import LiteYouTube from './LiteYouTube'

export function Rich({ html, className = '' }: { html?: string; className?: string }) {
  if (!html) return null
  return <div className={`rich ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}

// מציג רצף של בלוקי תוכן (כתבות, תיאורי מקרה) לפי הסדר המקורי
export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const key = block.id ?? i
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={key} className="mt-10 mb-4 text-[30px] leading-tight font-extrabold text-brand md:text-[36px]">
                {block.text}
              </h2>
            )
          case 'html':
            return <Rich key={key} html={block.html} className="my-5" />
          case 'image':
            return <Img key={key} name={block.image} alt={block.alt} sizes="(min-width: 900px) 860px, 100vw" className="mx-auto my-7 max-h-[640px] w-auto max-w-full rounded-[5px]" />
          case 'video':
            return block.youtube ? <LiteYouTube key={key} id={block.youtube} title="סרטון של גלילה ב-YouTube" className="mx-auto my-7 w-full max-w-[340px]" /> : null
          case 'list':
            return (
              <ul key={key} className="rich my-5">
                {block.items?.map((item) => <li key={item.text}>{item.href ? <a href={item.href}>{item.text}</a> : item.text}</li>)}
              </ul>
            )
          case 'faq':
            return (
              <div key={key} className="my-5 border-t border-ink/15">
                {block.items?.map((item) => (
                  <details key={item.q} className="group border-b border-ink/15">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-medium marker:hidden">
                      {item.q}
                      <span className="text-2xl leading-none text-brand group-open:hidden" aria-hidden="true">
                        +
                      </span>
                      <span className="hidden text-2xl leading-none text-brand group-open:inline" aria-hidden="true">
                        −
                      </span>
                    </summary>
                    <Rich html={item.a} className="pb-5" />
                  </details>
                ))}
              </div>
            )
          default:
            return null
        }
      })}
    </>
  )
}
