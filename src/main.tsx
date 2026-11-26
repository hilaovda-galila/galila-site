import { inject } from '@vercel/analytics'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import './index.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// עמודים שנוצרו מראש בזמן הבנייה כבר מכילים HTML (כולל 404.html)
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

// סטטיסטיקת כניסות אנונימית של Vercel (בלי עוגיות ובלי פרטים מזהים): כמה מבקרים, אילו עמודים,
// ומאיפה הגיעו – כולל הפניות מעוזרי בינה מלאכותית. אוספת נתונים רק באתר החי, ורק אחרי
// שמפעילים את Web Analytics בלוח הבקרה של Vercel. באחסון ב-JetServer אין את שירות האיסוף של Vercel,
// ולכן רק בכתובות של Vercel.
if (import.meta.env.PROD && location.hostname.endsWith('.vercel.app')) inject()
