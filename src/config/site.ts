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
  // כתובת ה-Web App של Google Apps Script ששומר את הנרשמים ל"חומרים להורדה" בגיליון של הלקוחה
  // ושולח לה את הרשימה במייל ב-1 לכל חודש (הקוד וההוראות: docs/leads-google-apps-script.gs).
  // כל עוד ריק – העמוד לא מוצג בתפריטים ולא נכנס לגוגל.
  leadsEndpoint: '',
}

// הקבוצות הפעילות לפי אזור – מוצגות ככרטיסים ב"השירותים שלנו" ומזינות את שדה האזור בטופס
export const areas = [
  {
    name: 'חיפה',
    page: '/קבוצה-חברתית-לילדים-על-הרצף-חיפה/',
    place: 'מרכז קריגר',
    address: 'אליהו חכים 6, חיפה',
    groups: [
      { title: 'קבוצה לגילאי גן', day: 'ימי שלישי', time: '16:00' },
      { title: 'קבוצה לכיתות א׳–ג׳', day: 'ימי שלישי', time: '17:30' },
    ],
  },
  {
    name: 'תל אביב',
    page: '/קבוצה-חברתית-לילדים-על-הרצף-תל-אביב/',
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
  downloads: '/חומרים-להורדה/',
}

// 8 לשוניות = שתי שורות של 4. שורה ראשונה: מקטעי עמוד הבית (המספרים הם העוגנים המקוריים);
// שורה שנייה: המלצות והעמודים הנפרדים.
// הוסרו: "ראשי" (הלוגו מוביל לעמוד הבית), "היתרונות שלנו" (המשך של "המודל שלנו"),
// "השאירו פרטים" (כפתור "ליצירת קשר" וכפתורי המקטעים מובילים לשם) והוובינר שנמחק.
export const navLinks = [
  { href: '/קבוצה-חברתית-לילדים-על-הרצף-חיפה/', label: 'קבוצות בחיפה' },
  { href: '/קבוצה-חברתית-לילדים-על-הרצף-תל-אביב/', label: 'קבוצות בתל אביב' },
  { href: '/מיומנויות-חברתיות-לילדים-על-הרצף/', label: 'מיומנויות חברתיות' },
  { href: '/הצוות-שלנו/', label: 'הצוות שלנו' },
  { href: '/#13', label: 'הורים ממליצים' },
  { href: paths.cases, label: 'תיאורי מקרה' },
  // "חומרים להורדה" מחליף את "שאלות נפוצות" ברגע שהגיליון מחובר (site.leadsEndpoint); השאלות נשארות בעמוד הבית
  site.leadsEndpoint ? { href: paths.downloads, label: 'חומרים להורדה' } : { href: '/#faq', label: 'שאלות נפוצות' },
  { href: paths.blog, label: 'בלוג' },
]

// כתובות ישנות של האתר שמפנות לכתובות העדכניות.
// כל שורה כאן חייבת להופיע גם ב-"redirects" שב-vercel.json (שם זו הפניה אמיתית מהשרת, 301,
// שמעבירה לגוגל את הדירוג של הכתובת הישנה). הבנייה נכשלת אם משהו חסר שם (scripts/prerender.mjs).
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
  // קיצורים לחומרים מודפסים, קוד QR וביו באינסטגרם
  '/haifa/': '/קבוצה-חברתית-לילדים-על-הרצף-חיפה/',
  '/tel-aviv/': '/קבוצה-חברתית-לילדים-על-הרצף-תל-אביב/',
  '/pressure-chamber-asd/': '/טיפול-בילדים-עם-אוטיזם-asd-באמצעות-תא-לחץ/',
}

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
