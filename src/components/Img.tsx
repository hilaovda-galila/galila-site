import type { ImgHTMLAttributes } from 'react'
import manifest from '../content/images.json'

// מפתח = שם הקובץ המקורי מספריית המדיה; ערך = הנתיב תחת public/images
const images = manifest as Record<string, string>

export function imageSrc(name?: string) {
  const src = name ? images[name] : undefined
  return src ? encodeURI(src) : undefined
}

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { name?: string }

// תמונה מהאתר המקורי. אם הקובץ עדיין לא נמצא ב-public/images – לא מוצג כלום.
export default function Img({ name, alt = '', loading = 'lazy', ...rest }: Props) {
  const src = imageSrc(name)
  if (!src) return null
  // באתר המקורי חלק מהתיאורים היו רשימות ארוכות של מילות מפתח; לא מקריאים אותן לקוראי מסך
  return <img src={src} alt={alt.length > 140 ? '' : alt} loading={loading} decoding="async" {...rest} />
}
