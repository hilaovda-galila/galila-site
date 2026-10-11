// כל פרטי ההתקשרות והניווט – כפי שהופיעו באתר המקורי. מעדכנים רק כאן.
export const site = {
  name: 'גלילה',
  domain: 'galilagroup.com',
  url: 'https://galilagroup.com',
  phoneDisplay: '0549480868',
  phoneHref: 'tel:0549480868',
  // מספר וואטסאפ בפורמט בינלאומי, ספרות בלבד
  whatsappNumber: '972504387806',
  email: 'galit36007@gmail.com',
  address: 'אליהו חכים 6 חיפה',
  facebook: 'https://www.facebook.com/profile.php?id=100088575528100',
  instagram: 'https://www.instagram.com/galilagroup/',
  community: 'https://www.facebook.com/share/g/1B9KHdjobE',
  communityName: 'קהילת - מדברים אוטיזם בגיל הרך',
}

// הקבוצות הפעילות לפי אזור – מוצגות ככרטיסים ב"השירותים שלנו" ומזינות את שדה האזור בטופס
export const areas = [
  {
    name: 'חיפה',
    place: 'מרכז קריגר',
    address: 'אליהו חכים 6, חיפה',
    groups: [
      { title: 'קבוצה לגילאי גן', day: 'ימי שלישי', time: '16:00' },
      { title: 'קבוצה לכיתות א׳–ג׳', day: 'ימי שלישי', time: '17:30' },
    ],
  },
  {
    name: 'תל אביב',
    place: 'בניין שקל',
    address: 'תש"ח 2, תל אביב',
    groups: [
      { title: 'קבוצה לילדי גן', day: 'ימי ראשון', time: '16:15' },
      { title: 'קבוצה לכיתות א׳–ג׳', day: 'ימי ראשון', time: '17:15' },
    ],
  },
]

// סרטוני YouTube Shorts מהערוץ הרשמי, למקטע "תובנות וטיפים מהשטח" בעמוד הבית
export const youtubeChannel =
  'https://www.youtube.com/@%D7%92%D7%9C%D7%99%D7%9C%D7%94%D7%A7%D7%91%D7%95%D7%A6%D7%94%D7%97%D7%91%D7%A8%D7%AA%D7%99%D7%AA/shorts'

// סרטון ההיכרות שמוצג לכל הרוחב בראש עמוד הבית
export const introVideo = { id: 'RooKJJgXJvg', title: 'גלילה קבוצה חברתית' }

export const shorts = [
  { id: 'A8CtlidTDwQ', title: 'התנהגות חזרתית באוטיזם ASD' },
  { id: 'zpTgZwx3skE', title: 'מילת הקסם "אוף" והקשר שלה לוויסות רגשי' },
]

export const paths = {
  blog: '/autism-blog-parents/',
  cases: '/גלילה-קבוצות-חברתיות-2/',
  webinar: '/הרשמה-לוובינר/',
}

// סדר ושמות התפריט כמו באתר המקורי; המספרים הם העוגנים המקוריים בעמוד הבית
export const navLinks = [
  { href: '/#1', label: 'ראשי' },
  { href: '/#2', label: 'אודות' },
  { href: '/#3', label: 'השירותים שלנו' },
  { href: '/#4', label: 'המודל שלנו' },
  { href: '/#5', label: 'היתרונות שלנו' },
  { href: '/#6', label: 'הצוות שלנו' },
  { href: paths.blog, label: 'בלוג' },
  { href: '/#13', label: 'הורים ממליצים' },
  { href: paths.cases, label: 'תאורי מקרה' },
  { href: '/#25', label: 'השאירו פרטים' },
  { href: paths.webinar, label: 'הרשמה לוובינר' },
]

// כתובות ישנות של האתר שמפנות לכתובות העדכניות
export const redirects: Record<string, string> = {
  '/בלוג/': paths.blog,
  '/בלוג-הורים-אוטיזם/': paths.blog,
  '/גלילה-קבוצה-חברתית/': paths.cases,
  '/הורים-ממליצים/': '/#13',
  '/asperger-high-functioning/': '/asperger-syndrome-guide-for-parents/',
  '/hugging-strangers-autism/': '/hugging-strangers-autism-guide/',
  '/אוקסיטוצין-ואוטיזם-מה-הקשר/': '/oxytocin-and-autism-treatment-guide/',
  '/אפילפסיה-ואוטיזם-השפעות-וטיפול/': '/epilepsy-and-autism-connection-guide/',
  '/על-הספקטרום-מה-באמת-עובר-על-הורים-לילדי/': '/parents-of-children-with-autism-challenges/',
  '/pressure-chamber-asd/': '/טיפול-בילדים-עם-אוטיזם-asd-באמצעות-תא-לחץ/',
}

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
