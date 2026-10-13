// כל פרטי ההתקשרות והניווט – כפי שהופיעו באתר המקורי. מעדכנים רק כאן.
export const site = {
  name: 'גלילה',
  domain: 'galilagroup.com',
  // הכתובת הראשית ב-Vercel היא עם www; הכתובת בלי www מפנה אליה
  url: 'https://www.galilagroup.com',
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
    place: 'גימנסיה',
    address: "זאב ז'בוטינסקי 106, תל אביב",
    groups: [
      { title: 'קבוצה לילדי גן', day: 'ימי ראשון', time: '16:00' },
      { title: 'קבוצה לכיתות א׳–ג׳', day: 'ימי ראשון', time: '17:30' },
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
  courses: '/courses/',
  myCourses: '/courses/my/',
}

// 8 לשוניות = שתי שורות של 4. שורה ראשונה: מקטעי עמוד הבית (המספרים הם העוגנים המקוריים);
// שורה שנייה: המלצות והעמודים הנפרדים.
// הוסרו: "ראשי" (הלוגו מוביל לעמוד הבית), "היתרונות שלנו" (המשך של "המודל שלנו"),
// "השאירו פרטים" (כפתור "ליצירת קשר" וכפתורי המקטעים מובילים לשם) והוובינר שנמחק.
export const navLinks = [
  { href: '/#2', label: 'אודות' },
  { href: '/#3', label: 'השירותים שלנו' },
  { href: '/#4', label: 'המודל שלנו' },
  { href: '/#6', label: 'הצוות שלנו' },
  { href: '/#13', label: 'הורים ממליצים' },
  { href: paths.cases, label: 'תאורי מקרה' },
  { href: paths.blog, label: 'בלוג' },
  { href: paths.courses, label: 'קורסים דיגיטליים' },
]

// כתובות ישנות של האתר שמפנות לכתובות העדכניות
export const redirects: Record<string, string> = {
  '/בלוג/': paths.blog,
  '/בלוג-הורים-אוטיזם/': paths.blog,
  '/גלילה-קבוצה-חברתית/': paths.cases,
  '/הורים-ממליצים/': '/#13',
  // עמוד הוובינר (מרץ 2025) הוסר; הטקסט שלו שמור ב-content-archive/webinar.md
  '/הרשמה-לוובינר/': '/',
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
