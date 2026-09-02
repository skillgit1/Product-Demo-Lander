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
    ...utms,
  })
  posthog.capture('tour_form_submitted', utms)
}

/** Called when someone clicks "Start the Preview". */
export function trackStartPreview() {
  if (!started) initPostHog()
  posthog.capture('start_preview_clicked', getUTMs())
}
