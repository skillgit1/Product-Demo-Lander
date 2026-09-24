import { HeroReel } from './components/HeroReel'
import { trackStartPreview } from './lib/posthog'

// Higher-ed landing page (/he). Same components and design system as the main
// page; only the copy is institution-focused. Not part of the hero A/B test.

const TOUR_URL = 'https://www.skillwell.com/take-a-tour'

const BRANDS = ['ucf', 'georgia-state', 'tec-monterrey'] as const
const BRAND_ALT: Record<string, string> = {
  ucf: 'University of Central Florida',
  'georgia-state': 'Georgia State University',
  'tec-monterrey': 'Tecnológico de Monterrey',
}
// Per-logo heights, tuned for optical balance (stacked marks need more height).
const LOGO_H: Record<string, string> = {
  ucf: '32px',
  'georgia-state': '40px',
  'tec-monterrey': '30px',
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

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

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs font-bold uppercase tracking-widest text-primary ${className}`}>{children}</p>
}

const BENEFITS = [
  {
    n: '01',
    grad: 'linear-gradient(135deg, var(--color-lime), var(--color-oasis))',
    title: 'Lower DFW rates',
    body: 'Adaptive learning meets every student where they are and closes knowledge gaps before they turn into drops, withdrawals, and failures.',
    icon: (
      <>
        <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /><path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    n: '02',
    grad: 'linear-gradient(135deg, var(--color-oasis), var(--color-sky))',
    title: 'Boost student engagement',
    body: 'Immersive simulations put students inside real scenarios and decisions, the kind of active learning that keeps them coming back.',
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      </>
    ),
  },
  {
    n: '03',
    grad: 'linear-gradient(135deg, var(--color-sky), #2ea0d6)',
    title: 'Modernize courseware in minutes',
    body: 'Convert outdated PDFs, slide decks, and documents into adaptive, immersive courseware in a few clicks, not a semester of redesign.',
    icon: (
      <>
        <path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" />
      </>
    ),
  },
  {
    n: '04',
    grad: 'linear-gradient(135deg, var(--color-primary), var(--color-oasis))',
    title: 'AI-powered, faculty-controlled',
    body: 'Personalized learning powered by AI with safeguarded faculty oversight, so instructors approve the content and control how it adapts.',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
      </>
    ),
  },
]

const FAQ = [
  {
    q: 'Does Skillwell replace our LMS?',
    a: 'No. Skillwell is a bolt-on that layers adaptive and immersive learning on top of your existing LMS to verify competency and close skill gaps. It integrates easily.',
  },
  {
    q: 'How does this lower DFW rates?',
    a: 'The platform identifies each student’s gaps and closes them before assessments, while immersive practice builds durable skills. The analytics surface at-risk students early, so support reaches them in time.',
  },
  {
    q: 'Do faculty stay in control?',
    a: 'Yes. Skillwell is AI-powered but faculty-governed. Instructors approve the learning maps, control the content, and see exactly how the AI adapts for each student.',
  },
  {
    q: 'How fast can we launch a course?',
    a: 'Upload existing courseware and Skillwell converts it into adaptive, immersive learning in minutes. Most programs pilot within days, not a semester.',
  },
]

export default function HePage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
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
        <div className="mx-auto max-w-5xl px-5 py-8 lg:py-14">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>For Institutional Administrators</Eyebrow>
            <h1 className="mx-auto mt-3 max-w-[24ch] font-display text-[clamp(32px,4.6vw,52px)] font-bold leading-[1.06] tracking-tight text-ink text-balance">
              Deliver personalized and <span className="text-primary">immersive learning at scale</span>
            </h1>
            <p className="mx-auto mt-3 max-w-[48ch] text-[16px] leading-relaxed text-ink-soft">
              Turn outdated courseware into adaptive, immersive learning that lifts engagement and lowers DFW rates. Explore the 2-minute preview below.
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
            Trusted by institutions like
          </p>
          {/* Only three logos, so a centered, evenly-spaced row that fades in
              (no scrolling marquee, which would repeat them). */}
          <div className="he-logos mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-16 gap-y-8 sm:gap-x-24">
            {BRANDS.map((b) => (
              <span key={b} className="flex h-11 w-[150px] items-center justify-center">
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

      {/* Benefits */}
      <section className="bg-sand py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <Eyebrow>Built for higher ed</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-[20ch] font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-ink text-balance">
              What Skillwell does for your institution
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
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
              Questions administrators ask us
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
            <p className="mx-auto mt-3 max-w-[48ch] text-ink-soft">
              Lower DFW rates, lift student engagement, and modernize courseware in minutes, with AI your faculty controls.
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
