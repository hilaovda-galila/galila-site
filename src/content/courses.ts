// קורסים דיגיטליים.
// TODO: הקורסים, המחירים והפרקים כאן הם דוגמה בלבד, כדי לבנות ולבדוק את הממשק.
// להחליף בקורסים האמיתיים (ובהמשך לטעון אותם ממסד הנתונים) לפני פתיחה להורים.
// summary: משפט אחד על הפרק, מוצג בעמוד הקורס לפני הרכישה
export type Lesson = { title: string; minutes: number; summary: string; videoId?: string }

export type Course = {
  slug: string
  title: string
  summary: string
  // שם קובץ תמונה מ-src/content/images.json; בלי תמונה מוצג רקע צבעוני
  image?: string
  // לבקשת הלקוחה המחיר לא מוצג באתר בשלב זה; כשמוגדר, הוא מופיע בקטלוג, בעמוד הקורס ובחלון הרכישה
  priceILS?: number
  lessons: Lesson[]
  // "מה תקבלו מהקורס" ו"למי הקורס מתאים" בעמוד הקורס
  outcomes: string[]
  audience: string[]
}

// כל עוד false, עמודי הקורסים מציגים רק חלונית "בקרוב" שמחזירה לדף הבית, והקטלוג,
// ההרשמה ואזור הצפייה (שעדיין במצב הדגמה) לא נחשפים לגולשים.
//
// באתר החי הערך תמיד false. הוא true רק בתצוגה מקדימה מקומית, שמופעלת ב-`npm run dev:courses`
// (מצב "courses-preview" של Vite) ורצה על המחשב בלבד. הבנייה ש-Vercel מעלה לאוויר רצה במצב
// "production", ולכן הקוד של הקטלוג ושל אזור הצפייה אפילו לא נכנס אליה.
// כדי לפתוח את הקורסים באמת: להחליף את התנאי ב-true, ורק כשיש קורסים אמיתיים, הרשמה אמיתית וסליקה.
export const COURSES_OPEN = import.meta.env.MODE === 'courses-preview'

export const ACCESS_DAYS = 30

// תבנית: קורס אחד עם 3 סרטונים של 15–20 דקות. כדי להוסיף קורס – מעתיקים את הבלוק ומשנים.
export const courses: Course[] = [
  {
    slug: 'emotional-regulation-at-home',
    // לבקשת הלקוחה בלי שם קורס ספציפי בתבנית
    title: 'קורס דיגיטלי להורים',
    summary: 'שלושה סרטונים קצרים עם כלים מעשיים לזיהוי סימנים מוקדמים של הצפה, ולבניית שגרה שעוזרת לילד להירגע.',
    lessons: [
      { title: 'מה קורה לילד ברגע של הצפה', minutes: 15, summary: 'מה עובר על הילד ברגע של הצפה, ולמה דווקא אז כל כך קשה לו להקשיב.' },
      { title: 'סימנים מוקדמים ואיך מזהים אותם', minutes: 18, summary: 'איך מזהים את הרגע שלפני, ומה אפשר לעשות כבר אז.' },
      { title: 'פינת הרגעה ושגרות שעוזרות', minutes: 20, summary: 'בונים יחד עם הילד פינה ושגרה שעוזרות לו לחזור לאיזון.' },
    ],
    outcomes: [
      'הבנה של מה שקורה לילד ברגעי הצפה',
      'דרכים לזהות סימנים מוקדמים, לפני שהמצב מסלים',
      'כלים מעשיים ליישום בבית, כבר מהיום',
    ],
    audience: ['הורים לילדים על הרצף בגילאי 4–9', 'הורים שמחפשים כלים לרגעים של התפרצות והצפה'],
  },
]

export const coursePath = (course: Course) => `/courses/${course.slug}/`

export const courseMinutes = (course: Course) => course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0)
