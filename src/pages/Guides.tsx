import { useState } from 'react'
import Layout from '../components/Layout'
import LeadForm from '../components/LeadForm'

export const guidesMeta = {
  title: 'מדריכים להורים – בקרוב | גלילה',
  description: 'בקרוב בגלילה: מדריכים להורים לילדים על הרצף, להורדה בתשלום. השאירו פרטים ונעדכן כשהמדריכים יעלו.',
}

// "מדריכים": מדריכים להורדה בתשלום. עד שהם מוכנים העמוד מציג "בקרוב" וטופס לקבלת עדכונים
// (הפרטים נכנסים לאותו גיליון של "חומרים להורדה", ועמודת "עמוד" מראה שהגיעו מכאן).
export default function Guides() {
  const [sent, setSent] = useState(false)

  return (
    <Layout title={guidesMeta.title} contact={false}>
      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <header className="text-center">
          <span className="mb-4 inline-block rounded-full bg-powder px-4 py-1 font-medium text-brand-deep">בקרוב</span>
          <h1 className="title">מדריכים להורים</h1>
          <span className="divider mx-auto my-5" />
          <p className="mx-auto max-w-[760px] text-lg">
            אנחנו עובדות על מדריכים להורים לילדים על הרצף, להורדה בתשלום. השאירו פרטים, ונעדכן אתכם כשהמדריכים יעלו לאתר.
          </p>
        </header>

        <section aria-labelledby="updates" className="card mx-auto mt-8 max-w-[760px] p-6 md:p-8">
          {sent ? (
            <div className="text-center" role="status">
              <h2 id="updates" className="text-[26px] leading-tight font-extrabold text-brand md:text-[30px]">
                תודה, נעדכן אתכם
              </h2>
              <p className="mt-2">כשהמדריכים יהיו מוכנים, תקבלו מאיתנו הודעה.</p>
            </div>
          ) : (
            <>
              <h2 id="updates" className="text-center text-[26px] leading-tight font-extrabold text-brand md:text-[30px]">
                רוצים לשמוע ראשונים?
              </h2>
              <LeadForm submitLabel="עדכנו אותי" onDone={() => setSent(true)} />
            </>
          )}
        </section>
      </div>
    </Layout>
  )
}
