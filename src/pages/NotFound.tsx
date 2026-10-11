import { Link } from 'react-router'
import Layout from '../components/Layout'

export default function NotFound() {
  return (
    <Layout title="העמוד לא נמצא | גלילה" contact={false}>
      <div className="mx-auto max-w-site px-5 py-24 text-center">
        <h1 className="title">העמוד לא נמצא</h1>
        <p className="my-6 text-lg">ייתכן שהכתובת השתנתה או שהעמוד הוסר.</p>
        <Link to="/" className="btn">
          חזרה לעמוד הבית
        </Link>
      </div>
    </Layout>
  )
}
