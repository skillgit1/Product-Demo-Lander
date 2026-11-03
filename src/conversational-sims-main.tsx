import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import './landing.css'
import ConversationalSimsPage from './ConversationalSimsPage.tsx'
import { initPostHog, markLandingPage } from './lib/posthog'

// Conversational sims product page (/conversational-sims). Temporary
// standalone home for this content while it's being built out as a real
// page on skillwell.com; HubSpot will redirect a clean link here for
// DevLearn reps to share in the meantime.
initPostHog()
markLandingPage('conversational_sims')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConversationalSimsPage />
  </StrictMode>,
)
