// נתונים מובנים (schema.org / JSON-LD): תיאור מדויק של העסק ושל הכתבות, בפורמט שמנועי חיפוש
// ועוזרי בינה מלאכותית קוראים ישירות. נכנס ל-HTML של כל עמוד בזמן הבנייה (scripts/prerender.mjs).
import { imageSrc } from './components/Img'
import { areas, paths, site, youtubeChannel } from './config/site'
import { author, type Post } from './content'

const abs = (path?: string) => (path ? site.url + path : undefined)
const text = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const ORG_ID = `${site.url}/#organization`

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': ORG_ID,
  name: 'גלילה – קבוצה חברתית',
  alternateName: ['גלילה', 'Galila'],
  description:
    'קבוצות חברתיות טיפוליות לילדים וילדות על הרצף האוטיסטי (ASD) בגילאי 4–9, בחיפה ובתל אביב, והדרכת הורים. בהנחיית מטפלת רגשית באמנות ומנתחת התנהגות.',
  url: `${site.url}/`,
  logo: abs(imageSrc('גלילה-600-pix.png')),
  image: abs(imageSrc('IMG-20230523-WA0016.jpg')),
  telephone: '+972-54-948-0868',
  email: site.email,
  areaServed: areas.map((area) => ({ '@type': 'City', name: area.name })),
  location: areas.map((area) => ({
    '@type': 'Place',
    name: `${area.place}, ${area.name}`,
    address: { '@type': 'PostalAddress', streetAddress: area.address.split(',')[0], addressLocality: area.name, addressCountry: 'IL' },
  })),
  founder: [
    { '@type': 'Person', name: 'הילה עובדה', jobTitle: 'מטפלת רגשית באמנות ומדריכת הורים' },
    { '@type': 'Person', name: 'גלית ברנהולץ', jobTitle: 'מנתחת התנהגות' },
  ],
  knowsAbout: ['אוטיזם', 'ASD', 'מיומנויות חברתיות', 'קבוצות חברתיות לילדים', 'ויסות רגשי', 'הדרכת הורים', 'ניתוח התנהגות יישומי (ABA)'],
  sameAs: [site.facebook, site.instagram, youtubeChannel.replace(/\/shorts$/, '')],
}

export function postLd(post: Post) {
  const url = `${site.url}/${post.slug}/`
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: abs(imageSrc(post.ogImage)),
    datePublished: post.date,
    inLanguage: 'he',
    mainEntityOfPage: url,
    author: { '@type': 'Person', name: post.author || author.name, description: author.bio },
    publisher: { '@id': ORG_ID },
  }
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ראשי', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'בלוג', item: site.url + paths.blog },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }
  // השאלות הנפוצות שבסוף הכתבה, אם יש
  const questions = post.blocks.filter((block) => block.type === 'faq').flatMap((block) => block.items ?? [])
  const faq = questions.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: text(item.a) } })),
      }
    : null
  return faq ? [article, breadcrumbs, faq] : [article, breadcrumbs]
}
