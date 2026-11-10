import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './learning-portfolio-beta.css'
import LearningPortfolioBetaPage from './LearningPortfolioBetaPage.tsx'
import { initPostHog, markLandingPage } from './lib/posthog'

// Skillwell Verify skills report mockup (/learning-portfolio-beta). A direct
// rebuild of a design artifact, not a marketing landing page — still tagged
// for PostHog like the others for consistency.
initPostHog()
markLandingPage('learning-portfolio-beta')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LearningPortfolioBetaPage />
  </StrictMode>,
)
