// עמודי התוכן שנוספו לקידום בגוגל (אוקטובר 2026): עמוד לכל עיר, מדריך מיומנויות חברתיות ועמוד הצוות.
// התוכן נכתב רק מעובדות שכבר מופיעות באתר ונבדק מולן; התוכנית המלאה ב-seo/content-plan-2026-10.json.
import data from './landing-pages.json'

export type LandingPage = {
  path: string
  kind: 'city' | 'guide' | 'team'
  area?: string
  title: string
  description: string
  h1: string
  subtitle: string
  intro: string
  sections: { h2: string; html: string }[]
  faq: { q: string; a: string }[]
  cta: string
}

export const landingPages = data as LandingPage[]
