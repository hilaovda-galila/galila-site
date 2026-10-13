import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { pages } from './routes'

export { site } from './config/site'

export const pageList = pages.map(({ path, title, description, image, private: isPrivate, jsonLd }) => ({ path, title, description, image, private: isPrivate, jsonLd }))

export function render(path: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={encodeURI(path)}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
