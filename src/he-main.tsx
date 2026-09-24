import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import './landing.css'
import HePage from './HePage.tsx'
import { initPostHog, markLandingPage } from './lib/posthog'

// Higher-ed landing page (/he). Same tracking as the main page, but tagged
// landing_page='higher_ed' and NOT part of the hero A/B experiment.
initPostHog()
markLandingPage('higher_ed')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HePage />
  </StrictMode>,
)
