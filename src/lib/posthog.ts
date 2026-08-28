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
export function optInAndIdentify(data: { email: string; firstName: string; lastName: string }) {
  if (!started) initPostHog()
  posthog.opt_in_capturing()
  posthog.identify(data.email, {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
  })
}

/** Called when someone clicks "Start the Preview" (no form, so no identify). */
export function trackStartPreview() {
  if (!started) initPostHog()
  posthog.opt_in_capturing()
  posthog.capture('start_preview_clicked')
}
