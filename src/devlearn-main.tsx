import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import './landing.css'
import DevLearnPage from './DevLearnPage.tsx'
import { initPostHog, markLandingPage } from './lib/posthog'

// DevLearn 2026 event-exclusive pricing page (/devlearn). Same tracking as
// the other pages, tagged landing_page='devlearn' and not part of the hero
// A/B experiment (it has its own headline, not the control/variant pair).
initPostHog()
markLandingPage('devlearn')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DevLearnPage />
  </StrictMode>,
)
