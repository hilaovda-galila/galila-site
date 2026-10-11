import { useLocation } from 'react-router'
import { resolve } from './routes'

export default function App() {
  const { pathname } = useLocation()
  return resolve(pathname)
}
