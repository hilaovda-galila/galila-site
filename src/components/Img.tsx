import type { ImgHTMLAttributes } from 'react'
import meta from '../content/image-meta.json'
import manifest from '../content/images.json'

// מפתח = שם הקובץ המקורי מספריית המדיה; ערך = הנתיב תחת public/images
const images = manifest as Record<string, string>
// מידות כל תמונה והגרסאות המוקטנות שלה (נוצר ב-scripts/optimize-images.mjs)
const sizes = meta as Record<string, { w: number; h: number; variants: number[] }>

export function imageSrc(name?: string) {
  const src = name ? images[name] : undefined
  return src ? encodeURI(src) : undefined
}

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { name?: string }

// תמונה מהאתר המקורי. אם הקובץ עדיין לא נמצא ב-public/images – לא מוצג כלום.
// הדפדפן בוחר לבד את הגרסה המתאימה לרוחב המסך (srcSet), לפי הרוחב שהתמונה תופסת בעמוד (sizes).
// המידות (width/height) שומרות לתמונה מקום לפני שהיא נטענת, כך שהעמוד לא קופץ.
export default function Img({ name, alt = '', loading = 'lazy', sizes: displaySizes = '100vw', ...rest }: Props) {
  const path = name ? images[name] : undefined
  if (!path) return null
  const info = sizes[path]
  const src = encodeURI(path)
  const srcSet = info?.variants.length
    ? [...info.variants.map((w) => `${encodeURI(path.replace(/(\.\w+)$/, `-${w}w$1`))} ${w}w`), `${src} ${info.w}w`].join(', ')
    : undefined
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? displaySizes : undefined}
      width={info?.w}
      height={info?.h}
      // באתר המקורי חלק מהתיאורים היו רשימות ארוכות של מילות מפתח; לא מקריאים אותן לקוראי מסך
      alt={alt.length > 140 ? '' : alt}
      loading={loading}
      decoding="async"
      {...rest}
    />
  )
}
