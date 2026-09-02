import posthog from 'posthog-js'

/**
 * PostHog wiring for the landing page. Mirrors the product's PostHog project
 * (530617): anonymous-first, autocapture off, and — per the brief — capturing
 * is OFF until the visitor opts in. We only opt in + identify when someone
 * submits the tour form (consent implied by submitting).
 */

let started = false

export function initPostHog() {
  if (started || typeof window === 'undefined') return
  started = true
  posthog.init('phc_r5XKDVrufrZTnNmtA2eGAHEaZmZoogXok5pAwajRSxv3', {
    api_host: 'https://us.i.posthog.com',
    cross_subdomain_cookie: true, // set the cookie on .tryskillwell.com so the
    // same person is recognized across preview. and the apex domain
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    person_profiles: 'identified_only',
    opt_out_capturing_by_default: true,
  })
}

/**
 * Called from the form submit handler, before the HubSpot fetch: opt the
 * visitor in to capturing and identify them by email so their (previously
 * anonymous) activity stitches to the person.
 */
// Captured ONCE at module load. This module is imported from the app entry
// point, so this runs before the app renders and before anything could alter
// the URL — the UTMs then survive to the (later, opt-in-gated) conversion
// event even if the query string were changed afterward.
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

export function optInAndIdentify(data: { email: string; firstName: string; lastName: string }) {
  if (!started) initPostHog()
  posthog.opt_in_capturing()
  const utms = getUTMs()
  posthog.identify(data.email, {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    ...utms,
  })
  posthog.capture('tour_form_submitted', utms)
}

/** Called when someone clicks "Start the Preview" (no form, so no identify). */
export function trackStartPreview() {
  if (!started) initPostHog()
  posthog.opt_in_capturing()
  posthog.capture('start_preview_clicked', getUTMs())
}
