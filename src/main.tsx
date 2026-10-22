import { inject } from '@vercel/analytics'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
// הגופן Rubik נשמר באתר עצמו (עברית ואנגלית בלבד) במקום להיטען מ-Google Fonts – כך הוא לא מעכב את הצגת העמוד
import '@fontsource/rubik/hebrew-400.css'
import '@fontsource/rubik/hebrew-500.css'
import '@fontsource/rubik/hebrew-600.css'
import '@fontsource/rubik/hebrew-800.css'
import '@fontsource/rubik/latin-400.css'
import '@fontsource/rubik/latin-500.css'
import '@fontsource/rubik/latin-600.css'
import '@fontsource/rubik/latin-800.css'
import './index.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// עמודים שנוצרו מראש בזמן הבנייה כבר מכילים HTML (כולל 404.html); spa.html הריק משמש רק באחסון Apache
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

// סטטיסטיקת כניסות אנונימית של Vercel (בלי עוגיות ובלי פרטים מזהים): כמה מבקרים, אילו עמודים,
// ומאיפה הגיעו – כולל הפניות מעוזרי בינה מלאכותית. אוספת נתונים רק באתר החי, ורק אחרי
// שמפעילים את Web Analytics בלוח הבקרה של Vercel.
if (import.meta.env.PROD) inject()
