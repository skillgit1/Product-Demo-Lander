import { useState } from 'react'
import type { FormEvent } from 'react'
import { HeroReel } from './components/HeroReel'
import { optInAndIdentify, trackStartPreview } from './lib/posthog'

const TOUR_URL = 'https://www.skillwell.com/take-a-tour'

// ---- HubSpot Forms API (unauthenticated submission endpoint) --------------
const HS_PORTAL_ID = '2593232'
const HS_FORM_GUID = '83eab7f8-7224-4895-9bcc-26c94d915c6f'
const HS_ENDPOINT = `https://api.hsforms.com/submissions/v3/integration/submit/${HS_PORTAL_ID}/${HS_FORM_GUID}`

/** Read the HubSpot tracking cookie so the lead ties to the visitor's session. */
function getHubspotCookie(): string | undefined {
  const m = document.cookie.match(/(?:^|;)\s*hubspotutk=([^;]+)/)
  return m ? decodeURIComponent(m[1]) : undefined
}

async function submitToHubSpot(data: { firstName: string; lastName: string; email: string }): Promise<boolean> {
  const context: Record<string, string> = {
    pageUri: window.location.href,
    pageName: document.title,
  }
  const hutk = getHubspotCookie()
  if (hutk) context.hutk = hutk // only send if present

  const payload = {
    fields: [
      { name: 'email', value: data.email },
      { name: 'firstname', value: data.firstName },
      { name: 'lastname', value: data.lastName },
    ],
    context,
  }

  try {
    const res = await fetch(HS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error('HubSpot rejected the submission:', await res.json().catch(() => ({})))
    }
    return res.ok
  } catch (error) {
    console.error('Network error sending to HubSpot:', error)
    return false
  }
}

const BRANDS = ['capgemini', 'merck', 'amazon', 'ochsner', 'microsoft'] as const
const BRAND_ALT: Record<string, string> = {
  capgemini: 'Capgemini',
  merck: 'Merck',
  amazon: 'Amazon',
  ochsner: 'Ochsner Health',
  microsoft: 'Microsoft',
}
// Per-logo heights, tuned for optical balance (bounding boxes differ per mark).
const LOGO_H: Record<string, string> = {
  capgemini: '24px',
  merck: '24px',
  amazon: '26px',
  ochsner: '32px',
  microsoft: '23px',
}

const inputCls =
  'w-full rounded-lg border border-line-strong bg-[#fafbfc] px-3.5 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/25'

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

// Simplified CTA that replaces the opt-in form for now. Fires a PostHog
// conversion event, then sends the visitor into the tour.
function StartPreviewButton() {
  function onClick() {
    trackStartPreview()
    window.location.href = TOUR_URL
  }
  return (
    <button
      onClick={onClick}
      className="mx-auto flex items-center justify-center gap-2 rounded-btn bg-primary px-8 py-4 text-lg font-bold text-white shadow-[0_10px_26px_rgba(0,94,141,0.35)] transition-colors hover:bg-primary-hover"
    >
      Start the Preview <Arrow />
    </button>
  )
}

function BookingCard() {
  const [submitting, setSubmitting] = useState(false)
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.reportValidity() || submitting) return
    setSubmitting(true)
    const fd = new FormData(form)
    const lead = {
      firstName: String(fd.get('firstname') ?? ''),
      lastName: String(fd.get('lastname') ?? ''),
      email: String(fd.get('email') ?? ''),
    }
    // PostHog: opt in + identify (before the HubSpot fetch)
    optInAndIdentify(lead)
    await submitToHubSpot(lead)
    window.location.href = TOUR_URL
  }
  return (
    <div className="mx-auto w-full max-w-[440px] overflow-hidden rounded-2xl border border-line bg-panel shadow-[var(--shadow-overlay)]">
      <div className="flex items-center justify-center gap-6 border-b border-line px-5 py-3.5 text-sm">
        <span className="flex items-center gap-2 font-semibold text-ink">
          <i className="h-2 w-2 rounded-full bg-primary" /> Fill out the form
        </span>
        <span className="flex items-center gap-2 text-ink-muted">
          <i className="h-2 w-2 rounded-full bg-line-strong" /> Explore the preview
        </span>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 p-5">
        <div>
          <h3 className="text-center font-display text-xl font-bold tracking-tight text-ink">Explore the 2-minute platform preview</h3>
          <p className="mx-auto mt-1 max-w-[36ch] text-center text-sm text-ink-soft">
            See exactly how Skillwell verifies competency on real enterprise training. Enter your details to explore instantly.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input required type="text" name="firstname" placeholder="First name *" autoComplete="given-name" className={inputCls} />
          <input required type="text" name="lastname" placeholder="Last name *" autoComplete="family-name" className={inputCls} />
        </div>
        <input required type="email" name="email" placeholder="Work email *" autoComplete="email" className={inputCls} />
        <button type="submit" disabled={submitting} className="mt-1 flex items-center justify-center gap-2 rounded-btn bg-primary px-4 py-3.5 text-base font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-70">
          {submitting ? 'Submitting…' : <>Explore the preview <Arrow /></>}
        </button>
      </form>
    </div>
  )
}

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs font-bold uppercase tracking-widest text-primary ${className}`}>{children}</p>
}

const BENEFITS = [
  {
    n: '01',
    grad: 'linear-gradient(135deg, var(--color-oasis), var(--color-sky))',
    title: 'Adaptive learning that verifies competency',
    body: 'The map rebuilds for each person, so learners skip what they know and the platform confirms what they can actually do.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18M12 8v4l3 2" />
      </>
    ),
  },
  {
    n: '02',
    grad: 'linear-gradient(135deg, var(--color-sky), #2ea0d6)',
    title: 'Immersive, enterprise-grade simulations',
    body: 'Learners practice real job scenarios in realistic simulations, the kind of proof a completion certificate can never give you.',
    icon: (
      <>
        <path d="M4 5h16v11H4z" /><path d="M2 20h20M10 9l4 2.5L10 14z" />
      </>
    ),
  },
  {
    n: '03',
    grad: 'linear-gradient(135deg, var(--color-lime), var(--color-oasis))',
    title: 'Skills data that proves ROI',
    body: 'See the analytics L&D leaders use to prove measurable skill growth across every cohort, not just who finished the course.',
    icon: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
  },
]

const FAQ = [
  {
    q: 'Does Skillwell replace my LMS?',
    a: 'No. We are a bolt-on approach that helps you verify competency and skill development with adaptive and immersive learning. Easy to integrate.',
  },
  {
    q: 'Is this just AI coaching?',
    a: 'AI coaching does not address the underlying L&D problem, which is verifying competency. That is why Skillwell helps companies build immersive, enterprise-grade simulations and adaptive learning that changes based on each learner. Live AI avatar coaching is on the roadmap, but it is only one piece of the puzzle.',
  },
  {
    q: 'What is adaptive learning?',
    a: "With Skillwell, the platform adapts to the learner as it verifies their skills. Learners skip content they know and focus on what they don't, so they progress faster, close skill gaps, and give L&D teams measurable ROI.",
  },
]

export default function App() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-panel/85 backdrop-blur">
        <div className="mx-auto flex h-15 max-w-6xl items-center px-5 py-3">
          <a href="https://www.skillwell.com/" aria-label="Skillwell home">
            <img src="./skillwell-logo-horizontal.svg" alt="Skillwell" className="h-6 w-auto" />
          </a>
        </div>
      </header>

      {/* Hero: message + form beside the real learning map */}
      <section className="bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-8 lg:py-14">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>For L&amp;D leaders at Fortune 1000 companies</Eyebrow>
            <h1 className="mx-auto mt-3 max-w-[24ch] font-display text-[clamp(32px,4.6vw,52px)] font-bold leading-[1.06] tracking-tight text-ink text-balance">
              Prove your training builds <span className="text-primary">real, on-the-job skills</span>
            </h1>
            <p className="mx-auto mt-3 max-w-[46ch] text-[16px] leading-relaxed text-ink-soft">
              See how Skillwell's AI learning platform makes this easy. Explore the 2-minute preview below.
            </p>
          </div>
          <div className="mt-7">
            <HeroReel />
          </div>
          <div id="tour-form" className="mt-6 scroll-mt-24">
            <StartPreviewButton />
          </div>
        </div>
      </section>

      {/* Logo bar */}
      <section className="border-y border-line bg-panel py-7">
        <div className="mx-auto max-w-6xl px-5">
          <p className="mb-5 text-center text-xs font-bold uppercase tracking-widest text-ink-muted">
            Trusted by learning teams at
          </p>
          <div className="marquee">
            <div className="marquee-track">
              {[...BRANDS, ...BRANDS].map((b, i) => (
                <span key={b + i} className="mr-14 flex h-10 w-[120px] shrink-0 items-center justify-center">
                  <img
                    src={`./logos/${b}.png`}
                    alt={i < BRANDS.length ? BRAND_ALT[b] : ''}
                    aria-hidden={i >= BRANDS.length}
                    style={{ maxHeight: LOGO_H[b], maxWidth: '100%' }}
                    className="object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-sand py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <Eyebrow>Inside the platform</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-[18ch] font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-ink text-balance">
              What you get with Skillwell
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.n} className="relative overflow-hidden rounded-2xl border border-line bg-panel p-7 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(16,41,46,0.13)]">
                <span className="absolute right-5 top-4 text-3xl font-extrabold tracking-tight text-ink/[0.06]">{b.n}</span>
                <div className="mb-4 grid h-13 w-13 place-items-center rounded-[15px] text-[#04252b] shadow-[0_8px_18px_rgba(0,72,83,0.16)]" style={{ background: b.grad }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    {b.icon}
                  </svg>
                </div>
                <h3 className="text-[17px] font-bold leading-tight tracking-tight text-ink">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <Eyebrow>Straight answers</Eyebrow>
            <h2 className="mx-auto mt-3 font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-ink text-balance">
              Questions L&amp;D leaders ask us
            </h2>
          </div>
          <div className="mx-auto mt-8 flex max-w-[760px] flex-col gap-3.5">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-2xl border border-line bg-panel p-6 shadow-[var(--shadow-card)]">
                <p className="text-[16.5px] font-bold tracking-tight text-ink">{f.q}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-surface pb-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(24px,3vw,32px)] font-bold tracking-tight text-ink text-balance">
              See a mini preview of the Skillwell platform
            </h2>
            <p className="mx-auto mt-3 max-w-[46ch] text-ink-soft">
              Verify competency, close skill gaps, and deploy immersive and adaptive training to your workforce today.
            </p>
          </div>
          <div className="mt-8">
            <StartPreviewButton />
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
