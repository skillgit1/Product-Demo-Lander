import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import './landing.css'
import App from './App.tsx'
import { initPostHog, markLandingPage, trackHeroExperiment } from './lib/posthog'

initPostHog()
markLandingPage('main')
trackHeroExperiment()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
