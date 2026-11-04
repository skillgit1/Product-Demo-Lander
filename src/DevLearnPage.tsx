import { useEffect, useRef, useState } from 'react'
import { trackDevLearnCTA } from './lib/posthog'

// DevLearn 2026 event page (/devlearn). A pricing-forward exclusive for
// DevLearn attendees: same stack and tokens as the rest of the site, but its
// own copy and its own comparison pricing section the other landing pages
// don't have.
//
// Post-CRO/CMO-review revision (Nov 2026, day before the event): no dollar
// figures on the page at all, and every pricing CTA now opens a HubSpot
// Meetings scheduler in a modal (East Apthorp's calendar, since Ryan isn't
// set up in HubSpot yet) instead of linking out to the generic demo form.

const MEETING_EMBED_SRC = 'https://meetings.hubspot.com/east-apthorp/skillwell-onboarding-devlearn?embed=true'

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

// The meetings-iframe-container div stays mounted in the DOM from first
// render (just hidden with CSS), never conditionally unmounted. HubSpot's
// embed script scans the DOM for that class once when it loads; if the div
// came and went with the modal, only the very first open would ever work.
// The script itself is only injected the first time the modal opens, so
// visitors who never book never load a third-party script.
function MeetingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const scriptLoaded = useRef(false)

  useEffect(() => {
    if (!open || scriptLoaded.current) return
    scriptLoaded.current = true
    const script = document.createElement('script')
    script.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'
    script.async = true
    document.body.appendChild(script)
  }, [open])

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data && event.data.meetingBookSucceeded) {
        window.location.href = 'https://www.skillwell.com/'
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div
      className={open ? 'fixed inset-0 z-50 flex justify-center bg-ink/60 sm:items-center sm:p-4' : 'hidden'}
      onClick={onClose}
      aria-hidden={!open}
    >
      {/* Full-screen sheet on phones (no margins to fight the calendar grid
          for width); a centered, bounded card from sm up. */}
      <div
        className="flex h-full w-full flex-col bg-white sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl sm:shadow-[var(--shadow-overlay)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3 sm:border-0 sm:px-4 sm:pb-0 sm:pt-4">
          <span className="text-sm font-bold text-ink">Schedule your onboarding call</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sunken text-ink transition-colors hover:bg-line-strong"
          >
            <XIcon />
          </button>
        </div>
        <div className="meetings-iframe-container min-h-0 flex-1 overflow-y-auto" data-src={MEETING_EMBED_SRC} />
      </div>
    </div>
  )
}

function OpenMeetingButton({
  contentTag,
  onOpen,
  children,
  className = '',
}: {
  contentTag: string
  onOpen: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => {
        trackDevLearnCTA(contentTag)
        onOpen()
      }}
      className={`flex items-center justify-center gap-2 rounded-btn bg-primary px-8 py-4 text-lg font-bold text-white shadow-[0_10px_26px_rgba(0,94,141,0.35)] transition-colors hover:bg-primary-hover ${className}`}
    >
      {children}
    </button>
  )
}

// Hero and banner CTAs don't leave the page. They jump to the pricing section
// so the visitor picks a plan before anything fires off to HubSpot. Each
// click is still tracked (tag ending in _scroll) so the funnel from "saw the
// hero" to "reached pricing" to "clicked an actual offer" is visible in
// PostHog, even though the first step never hits the outbound CTA link.
function ScrollToPricingButton({ contentTag, children, className = '' }: { contentTag: string; children: React.ReactNode; className?: string }) {
  function onClick(e: React.MouseEvent) {
    e.preventDefault()
    trackDevLearnCTA(contentTag)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('pricing')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' })
  }
  return (
    <a href="#pricing" onClick={onClick} className={className}>
      {children}
    </a>
  )
}

const BRANDS = ['capgemini', 'merck', 'amazon', 'ochsner', 'microsoft'] as const
const BRAND_ALT: Record<string, string> = {
  capgemini: 'Capgemini',
  merck: 'Merck',
  amazon: 'Amazon',
  ochsner: 'Ochsner Health',
  microsoft: 'Microsoft',
}
const LOGO_H: Record<string, string> = {
  capgemini: '22px',
  merck: '22px',
  amazon: '24px',
  ochsner: '30px',
  microsoft: '21px',
}

const OUTCOMES = [
  {
    title: 'Frontline training',
    tagline: 'Ready for the floor, not just the handbook.',
    image: '/devlearn/outcomes/frontline.jpg',
    big: true,
  },
  {
    title: 'Onboarding and compliance',
    tagline: 'Compliance training that changes behavior company-wide.',
    image: '/devlearn/outcomes/sales.jpg',
  },
  {
    title: 'Leadership development',
    tagline: 'Practice the hard conversation before you have it for real.',
    image: '/devlearn/outcomes/leadership.jpg',
  },
  {
    title: 'Higher ed',
    tagline: 'Competency-based programs that adapt to every student.',
    image: '/devlearn/outcomes/highered.jpg',
  },
  {
    title: 'Healthcare and pharma',
    tagline: 'Clinical and compliance training that holds up under pressure.',
    image: '/devlearn/outcomes/healthcare.jpg',
  },
]

const CAPABILITIES = [
  {
    title: 'Adaptive learning maps',
    body: 'A course that rebuilds itself around each learner, so they skip what they already know and spend time only where they do not.',
    image: '/devlearn/capability-adaptive.jpg',
  },
  {
    title: 'Conversational sims',
    badge: 'New',
    body: 'Learners talk through a real scenario with an AI character and get coached on what they actually said, not just whether they clicked next.',
    image: '/devlearn/capability-conversational.jpg',
  },
  {
    title: 'Branching simulations',
    body: 'Immersive, scenario-based practice where every choice leads somewhere different, so the stakes feel real before they are.',
    image: '/devlearn/capability-branching.jpg',
  },
]

function OutcomeTile({ title, tagline, image, big = false }: { title: string; tagline: string; image: string; big?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-navy-deep ${big ? 'aspect-[4/3] sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2' : 'aspect-[4/3] lg:aspect-square'}`}
    >
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className={`font-display font-bold tracking-tight text-white ${big ? 'text-2xl' : 'text-lg'}`}>{title}</h3>
        <p className={`mt-1.5 text-white/85 ${big ? 'max-w-[32ch] text-[15px]' : 'text-[13.5px]'} leading-snug`}>{tagline}</p>
      </div>
    </div>
  )
}


export default function DevLearnPage() {
  const [meetingOpen, setMeetingOpen] = useState(false)
  const openMeeting = () => setMeetingOpen(true)

  return (
    <div className="min-h-screen bg-surface text-ink">
      <MeetingModal open={meetingOpen} onClose={() => setMeetingOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-panel/85 backdrop-blur">
        <div className="mx-auto flex h-15 max-w-6xl items-center px-5 py-3">
          <a href="https://www.skillwell.com/" aria-label="Skillwell home">
            <img src="/skillwell-logo-horizontal.svg" alt="Skillwell" className="h-6 w-auto" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-surface">
        <div className="mx-auto max-w-5xl px-5 pb-8 pt-5 lg:pb-14 lg:pt-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-btn bg-gradient-to-r from-navy to-primary px-3.5 py-1.5 shadow-[0_2px_8px_rgba(0,72,83,0.18)]">
              <span className="text-xs font-semibold tracking-wide text-white">DevLearn 2026 Exclusive Offer</span>
            </div>
            <h1 className="mx-auto mt-4 max-w-[16ch] font-display text-[clamp(38px,5.6vw,64px)] font-bold leading-[1.04] tracking-tight text-ink text-balance">
              Try Skillwell for Free
            </h1>
            <p className="mx-auto mt-3 max-w-[48ch] text-[16px] leading-relaxed text-ink-soft">
              Give your team personalized skills training through an immersive, adaptive learning platform. Close skill gaps faster, with verified proof it worked.
            </p>
          </div>
          <div className="mt-7 flex justify-center">
            <ScrollToPricingButton
              contentTag="hero_scroll"
              className="flex items-center justify-center gap-2 rounded-btn bg-primary px-8 py-4 text-lg font-bold text-white shadow-[0_10px_26px_rgba(0,94,141,0.35)] transition-colors hover:bg-primary-hover"
            >
              Try Skillwell for Free <Arrow />
            </ScrollToPricingButton>
          </div>
        </div>
      </section>

      {/* Logo bar */}
      <section className="border-t border-line bg-panel py-7">
        <div className="mx-auto max-w-6xl px-5">
          <p className="mb-5 text-center text-xs font-bold uppercase tracking-widest text-ink-muted">
            Trusted by learning teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16">
            {BRANDS.map((b) => (
              <span key={b} className="flex h-10 w-[120px] items-center justify-center">
                <img
                  src={`/logos/${b}.png`}
                  alt={BRAND_ALT[b]}
                  style={{ maxHeight: LOGO_H[b], maxWidth: '100%' }}
                  className="object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Banner: a second, impossible-to-miss shot at the same action, right
          after the trust signal lands. */}
      <section className="bg-primary">
        <ScrollToPricingButton contentTag="banner_scroll" className="block px-5 py-4 text-center transition-colors hover:bg-primary-hover">
          <span className="text-[15px] font-bold text-white sm:text-base">
            Get access to Skillwell at DevLearn for free <span aria-hidden="true">&rarr;</span>
          </span>
        </ScrollToPricingButton>
      </section>

      {/* Outcomes: a photo mosaic, not paragraphs. Built for a show floor glance. */}
      <section className="bg-sand py-16">
        <div className="mx-auto max-w-5xl px-5">
          <p className="text-sm font-bold text-primary">Real world use cases</p>
          <h2 className="mt-2 max-w-[16ch] font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-ink text-balance">
            Skillwell in action
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            {OUTCOMES.map((o) => (
              <OutcomeTile key={o.title} {...o} />
            ))}
          </div>
        </div>
      </section>

      {/* Capability strip: dark field, left anchored, no icon cards. */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-balance">
            Inside the platform
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <div key={c.title}>
                <div className="aspect-video overflow-hidden rounded-xl bg-navy-deep">
                  <img src={c.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <h3 className="text-base font-bold tracking-tight">{c.title}</h3>
                  {c.badge && (
                    <span className="rounded-full bg-oasis px-2 py-0.5 text-[11px] font-bold text-navy-deep">{c.badge}</span>
                  )}
                </div>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/75">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-16 bg-surface py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-ink text-balance">
            Exclusive Pricing for DevLearn Attendees
          </h2>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft">
            Two ways in. Discounts in year one if you commit now, or try it free for a month first.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Starter Pack */}
            <div className="flex flex-col rounded-2xl border border-line bg-panel p-7 shadow-[var(--shadow-card)]">
              <p className="text-sm font-bold text-primary">DevLearn Exclusive Offer</p>
              <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-ink">Skillwell Starter Pack</h3>
              <div className="mt-4 flex flex-col gap-2">
                <p className="flex items-center gap-2 text-base font-bold text-ink">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                    <CheckIcon />
                  </span>
                  30% off your annual license fee
                </p>
                <p className="flex items-center gap-2 text-base font-bold text-ink">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                    <CheckIcon />
                  </span>
                  20 hours of free consulting
                </p>
              </div>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  '500 minutes of conversational simulation',
                  '2 branching simulations',
                  '1 adaptive course',
                  'Skills data reporting',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14.5px] text-ink-soft">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                      <CheckIcon />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <OpenMeetingButton
                  contentTag="starterpack"
                  onOpen={openMeeting}
                  className="w-full px-5 py-3.5 text-[15px]"
                >
                  Start Your Onboarding <Arrow />
                </OpenMeetingButton>
              </div>
            </div>

            {/* Free Trial */}
            <div className="flex flex-col rounded-2xl border border-line bg-panel p-7 shadow-[var(--shadow-card)]">
              <p className="text-sm font-bold text-primary">DevLearn Exclusive Offer</p>
              <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-ink">Skillwell Free Trial</h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-ink">$0</span>
                <span className="text-sm font-semibold text-ink-muted">for 30 days</span>
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  '60 minutes of conversational simulation',
                  '1 branching simulation',
                  'Content ingestion for your courseware',
                  'Optional adaptive course build',
                  'Full Starter Pack benefits if you buy before December 31, 2026',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14.5px] text-ink-soft">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sunken text-ink-muted">
                      <CheckIcon />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <OpenMeetingButton
                  contentTag="trial"
                  onOpen={openMeeting}
                  className="w-full px-5 py-3.5 text-[15px]"
                >
                  Start a free trial <Arrow />
                </OpenMeetingButton>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-ink-muted">
            This is only available to new customers who sign up at DevLearn and commit by December 31, 2026.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-sand py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(24px,3vw,32px)] font-bold tracking-tight text-ink text-balance">
              Start your onboarding today.
            </h2>
            <p className="mx-auto mt-3 max-w-[46ch] text-ink-soft">
              One short call with our learning experts gets your team live.
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <OpenMeetingButton contentTag="final_cta" onOpen={openMeeting}>
              Start Your Onboarding <Arrow />
            </OpenMeetingButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-deep text-white/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-[13px]">
          <span>© 2026 Skillwell. All rights reserved.</span>
          <a href="https://www.skillwell.com/" className="text-white/75 hover:underline">skillwell.com</a>
        </div>
      </footer>
    </div>
  )
}
