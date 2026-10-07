import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import './landing.css'
import CbePage from './CbePage.tsx'
import { initPostHog, markLandingPage } from './lib/posthog'

// CBE / Direct Assessment landing page (/cbe). Same tracking as the other
// pages, tagged landing_page='cbe' and not part of the hero A/B experiment.
initPostHog()
markLandingPage('cbe')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CbePage />
  </StrictMode>,
)
