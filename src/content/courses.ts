// קורסים דיגיטליים.
// TODO: הקורסים, המחירים והפרקים כאן הם דוגמה בלבד, כדי לבנות ולבדוק את הממשק.
// להחליף בקורסים האמיתיים (ובהמשך לטעון אותם ממסד הנתונים) לפני פתיחה להורים.
export type Lesson = { title: string; minutes: number; videoId?: string }

export type Course = {
  slug: string
  title: string
  summary: string
  // שם קובץ תמונה מ-src/content/images.json; בלי תמונה מוצג רקע צבעוני
  image?: string
  priceILS: number
  lessons: Lesson[]
}

// כל עוד false, עמודי הקורסים מציגים רק חלונית "בקרוב" שמחזירה לדף הבית, והקטלוג,
// ההרשמה ואזור הצפייה (שעדיין במצב הדגמה) לא נחשפים לגולשים.
// להפוך ל-true רק כשיש קורסים אמיתיים, הרשמה אמיתית וסליקה.
export const COURSES_OPEN = false

export const ACCESS_DAYS = 30

export const courses: Course[] = [
  {
    slug: 'emotional-regulation-at-home',
    title: 'ויסות רגשי בבית',
    summary: 'כלים מעשיים לזיהוי סימנים מוקדמים של הצפה, ולבניית שגרה שעוזרת לילד להירגע.',
    priceILS: 149,
    lessons: [
      { title: 'מה קורה לילד ברגע של הצפה', minutes: 9 },
      { title: 'סימנים מוקדמים ואיך מזהים אותם', minutes: 12 },
      { title: 'פינת הרגעה ושגרות שעוזרות', minutes: 11 },
      { title: 'מה עושים אחרי התפרצות', minutes: 8 },
    ],
  },
  {
    slug: 'joining-play',
    title: 'איך עוזרים לילד להצטרף למשחק',
    summary: 'צעדים קטנים לתרגול בבית ובגן השעשועים: הצטרפות, תורות והתמודדות עם "לא".',
    priceILS: 129,
    lessons: [
      { title: 'למה הצטרפות למשחק כל כך קשה', minutes: 7 },
      { title: 'משפטי פתיחה ותרגול בבית', minutes: 10 },
      { title: 'תורות, ניצחון והפסד', minutes: 12 },
    ],
  },
  {
    slug: 'from-struggle-to-play',
    title: 'במקום מאבק – לשחק את המשחק',
    summary: 'איך ללמד ילדים להביע סירוב בדרך מקובלת, ולהפוך רגעי התנגדות להזדמנות ללמידה.',
    priceILS: 149,
    lessons: [
      { title: 'מה מסתתר מאחורי ה"לא"', minutes: 10 },
      { title: 'שפה שמורידה התנגדות', minutes: 13 },
      { title: 'בחירות, הומור ושיתוף פעולה', minutes: 11 },
      { title: 'תרגול ושאלות נפוצות', minutes: 9 },
    ],
  },
]

export const courseMinutes = (course: Course) => course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0)
