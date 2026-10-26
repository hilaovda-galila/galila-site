// "חומרים להורדה": קבצים שהורים מורידים בחינם אחרי שהשאירו פרטים ואישרו קבלת עדכונים.
// הוספת קובץ: שמים את ה-PDF ב-public/downloads/ (שם באנגלית, בלי רווחים), תמונת תצוגה ב-public/downloads/thumbs/
// (רוחב 480, webp), ומוסיפים כאן שורה. החדשים ראשונים.
export type Download = {
  id: string
  title: string
  description: string
  // תגית קצרה שמוצגת על הכרטיס
  tag: string
  pages: number
  // שם הקובץ כשההורה שומר אותו
  saveAs: string
}

export const downloads: Download[] = [
  {
    id: 'tomer-hears-alarm',
    title: 'תומר שומע אזעקה',
    description: 'סיפור חברתי מאויר על תומר, בן 5, ששומע אזעקה. לקריאה משותפת עם הילד.',
    tag: 'סיפור חברתי',
    pages: 10,
    saveAs: 'תומר שומע אזעקה - גלילה.pdf',
  },
  {
    id: 'water-day-aac-board',
    title: 'לוח תת״ח ליום מים',
    description: 'לוח תקשורת עם תמונות ומילים ליום מים: קר, רטוב, מציק, להתנגב, לנוח ואז לחזור, חיבוק ועוד.',
    tag: 'תת״ח',
    pages: 1,
    saveAs: 'לוח תתח יום מים - גלילה.pdf',
  },
  {
    id: 'sufganiya-picture-recipe',
    title: 'מתכון אורייני לסופגנייה',
    description: 'מתכון עם תמונה לכל מצרך ולכל שלב, להכנה משותפת עם הילד בחנוכה.',
    tag: 'חנוכה',
    pages: 2,
    saveAs: 'מתכון אורייני לסופגנייה - גלילה.pdf',
  },
  {
    id: 'hanukkah-memory-game',
    title: 'משחק זיכרון לחנוכה',
    description: 'קלפים עם תמונה ומילה: נר, חנוכייה, כד, שמן, סביבון, סופגניות, לביבות ודמי חנוכה. מדפיסים, גוזרים ומשחקים.',
    tag: 'חנוכה',
    pages: 2,
    saveAs: 'משחק זיכרון חנוכה - גלילה.pdf',
  },
  {
    id: 'hanukkah-double-game',
    title: 'דאבל חנוכה',
    description: 'קלפי משחק בסגנון "דאבל": מחפשים את התמונה שמופיעה בשני הקלפים. מדפיסים וגוזרים.',
    tag: 'חנוכה',
    pages: 11,
    saveAs: 'דאבל חנוכה - גלילה.pdf',
  },
]

export const downloadHref = (d: Download) => `/downloads/${d.id}.pdf`
export const downloadThumb = (d: Download) => `/downloads/thumbs/${d.id}.webp`
