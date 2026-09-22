import posthog from 'posthog-js'

/**
 * PostHog wiring for the landing page (project 530617). Tracks all visitors
 * from page load: autocapture off but pageviews on, cross-subdomain cookie so
 * identity spans preview + apex, and person profiles only for identified users.
 * Note: this captures anonymous visitors with no consent gate — fine for US
 * traffic; add a cookie/consent notice before running EU/UK traffic.
 */

let started = false

export function initPostHog() {
  if (started || typeof window === 'undefined') return
  started = true
  posthog.init('phc_r5XKDVrufrZTnNmtA2eGAHEaZmZoogXok5pAwajRSxv3', {
    api_host: 'https://us.i.posthog.com',
    cross_subdomain_cookie: true, // cookie on .tryskillwell.com so a person is
    // recognized across the preview subdomain and the apex domain
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    person_profiles: 'identified_only',
  })

  // A/B copy test: stamp the assigned variant onto EVERY event as a super
  // property, so conversion can be broken down by variant regardless of which
  // UTM channel the visitor arrived through. Then fire a one-time exposure
  // event (the denominator for the test).
  const variant = getHeroVariant()
  posthog.register({ copy_variant: variant })
  posthog.capture('experiment_viewed', { experiment: HERO_EXPERIMENT, variant, ...getUTMs() })
}

// ---- Hero copy split test -------------------------------------------------
export type HeroVariant = 'control' | 'variant'
export const HERO_EXPERIMENT = 'hero_copy'
const HERO_AB_KEY = 'sw_ab_hero'

/**
 * Assign (and persist) the visitor's hero-copy variant. 50/50, sticky per
 * browser, and independent of UTM so every channel splits evenly. Add
 * ?ab=control or ?ab=variant to the URL to force a variant for QA/screenshots.
 */
export function getHeroVariant(): HeroVariant {
  if (typeof window === 'undefined') return 'control'
  const forced = new URLSearchParams(window.location.search).get('ab')
  if (forced === 'control' || forced === 'variant') {
    try { localStorage.setItem(HERO_AB_KEY, forced) } catch { /* ignore */ }
    return forced
  }
  try {
    const saved = localStorage.getItem(HERO_AB_KEY)
    if (saved === 'control' || saved === 'variant') return saved
    const assigned: HeroVariant = Math.random() < 0.5 ? 'control' : 'variant'
    localStorage.setItem(HERO_AB_KEY, assigned)
    return assigned
  } catch {
    return Math.random() < 0.5 ? 'control' : 'variant'
  }
}

// Captured ONCE at module load. This module is imported from the app entry
// point, so this runs before the app renders and before anything could alter
// the URL — the UTMs survive to the conversion event even if the query string
// were changed afterward. (PostHog also auto-reads UTMs on init.)
const LANDING_UTMS: Record<string, string> = (() => {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  const out: Record<string, string> = {}
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const v = p.get(k)
    if (v !== null) out[k] = v
  }
  return out
})()

/** UTM params captured at page load, attached to every conversion event. */
export function getUTMs(): Record<string, string> {
  return LANDING_UTMS
}

/** Called from the form submit handler: identify the lead by email. */
export function optInAndIdentify(data: { email: string; firstName: string; lastName: string }) {
  if (!started) initPostHog()
  const utms = getUTMs()
  posthog.identify(data.email, {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    copy_variant: getHeroVariant(),
    ...utms,
  })
  posthog.capture('tour_form_submitted', utms)
}

/** Called when someone clicks "Start the Preview". */
export function trackStartPreview() {
  if (!started) initPostHog()
  posthog.capture('start_preview_clicked', getUTMs())
}
