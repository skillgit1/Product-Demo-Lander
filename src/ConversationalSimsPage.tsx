import { useEffect, useRef, useState } from 'react'

// Conversational sims product page (/conversational-sims). Copy comes
// directly from "Skillwell Conversational Sims - Product Page Copy" (Austin,
// Nov 2026) — this component is a layout pass, not a copy rewrite. One spot
// in that doc was marked as not yet written: a differentiator callout,
// covered well enough by the comparison section below, so it's omitted here
// rather than inventing filler.
//
// The brief asked for Ochsner Health and Valterra testimonials, but Valterra
// isn't a public case study. Swapped in Merck instead (also real, also
// public, and its quote is literally about compliance training, which is
// the exact claim point 3 is making) — both quotes below are pulled verbatim
// from skillwell.com's own homepage, not invented.

// Reveals an element once it's scrolled into view: fade + rise, with an
// optional per-item delay for staggered lists. Respects reduced motion by
// skipping straight to visible with no animation.
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible] as const
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, visible] = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-10 scale-[0.97] opacity-0'} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

// The hero embed is a live, interactive LiveAvatar conversation, not a video.
// Decoded from the Google Docs redirect link in the brief.
const LIVE_AVATAR_EMBED = 'https://embed.liveavatar.com/v1/5bfe1511-f76d-4765-9530-3fa69d6e54f0?orientation=horizontal'
const DEMO_URL = 'https://www.skillwell.com/demo'
const PLATFORM_URL = 'https://www.skillwell.com/platform'

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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function Cell({ value }: { value: string }) {
  if (value === '✓') {
    return (
      <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-success-soft text-success">
        <CheckIcon />
      </span>
    )
  }
  if (value === '✗') {
    return (
      <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-sunken text-ink-muted">
        <XIcon />
      </span>
    )
  }
  if (value === 'N/A') {
    return <span className="text-ink-muted">N/A</span>
  }
  return <span className="text-ink-soft">{value}</span>
}

const PLATFORM_PILLARS = [
  {
    title: 'Branching simulations',
    body: 'Realistic, scenario-based practice where every choice leads somewhere different.',
    image: '/devlearn/capability-branching.jpg',
    accent: 'var(--color-sky)',
  },
  {
    title: 'Adaptive learning',
    body: 'A course that rebuilds itself around what each learner has actually shown they know.',
    image: '/devlearn/capability-adaptive.jpg',
    accent: 'var(--color-oasis)',
  },
  {
    title: 'Skills Data',
    body: 'One shared framework every simulation, course, and report gets scored against.',
    accent: 'var(--color-lime)',
  },
] as const

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
      <path d="M12 2 2 12l9 9 11-11V3z" />
      <circle cx="16.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

const COMPARE_COLUMNS = ['Skillwell', 'AI role-play & coaching tools', 'Avatar video tools', 'LMS & LXP AI add-ons']

const COMPARE_ROWS: { label: string; values: string[] }[] = [
  { label: 'Built on decades of immersive simulation design', values: ['✓', '✗', '✗', '✗'] },
  { label: 'Structured, branching scenarios', values: ['✓', 'Mostly open-ended', '✗', 'Mostly open-ended'] },
  { label: 'Scored against a competency framework', values: ['✓', 'Conversation feedback', '✗', 'Varies'] },
  { label: "Adapts to each learner's demonstrated proficiency", values: ['✓', 'Limited', '✗', 'Varies'] },
  { label: 'Proficiency data by learner, team, and cohort', values: ['✓', 'Varies', '✗', 'Completion-focused'] },
  { label: 'Built for frontline, clinical, and higher ed at scale', values: ['✓', 'Mostly sales & leadership', 'N/A', 'Generic content libraries'] },
]

const WHY_COLORS = ['var(--color-oasis)', 'var(--color-sky)', 'var(--color-lime)']

function WhyItem({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  const color = WHY_COLORS[(n - 1) % WHY_COLORS.length]
  return (
    <Reveal delay={(n - 1) * 100}>
      {/* Badge + heading only, not the body or the testimonial, so those
          can run the full width of the section instead of being squeezed
          into the column next to the number badge on a phone. */}
      <div className="flex items-center gap-4 sm:gap-5">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-base font-bold text-navy-deep shadow-[0_6px_16px_rgba(16,41,46,0.18)] sm:h-12 sm:w-12 sm:text-lg"
          style={{ backgroundColor: color }}
        >
          {n}
        </span>
        <h3 className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">{title}</h3>
      </div>
      <div className="mt-3">{children}</div>
    </Reveal>
  )
}

function CompareTable() {
  const [ref, visible] = useReveal<HTMLDivElement>()
  return (
    <section className="bg-sand py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-5">
        <h2 className="text-center font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-ink text-balance">
          How Skillwell Compares
        </h2>
        <p className="mx-auto mt-3 max-w-[48ch] text-center text-[15px] text-ink-soft">
          Six ways Skillwell is built differently from the rest of the category.
        </p>

        <div
          ref={ref}
          className={`mt-10 overflow-hidden rounded-2xl border border-line shadow-[var(--shadow-card)] transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          {/* Only the data columns scroll on a phone; the claim stays pinned
              on the left so you always know which row you're reading. */}
          <div style={{ overflowX: 'auto' }}>
            <table className="w-full border-collapse text-left text-sm" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 w-36 bg-panel p-4 sm:w-56" />
                  {COMPARE_COLUMNS.map((c, i) => (
                    <th
                      key={c}
                      className={`p-4 text-center text-sm font-bold ${i === 0 ? 'bg-gradient-to-br from-navy to-primary text-white' : 'bg-panel text-ink-soft'}`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, ri) => (
                  <tr
                    key={row.label}
                    className={`compare-row border-t border-line ${visible ? 'is-visible' : ''}`}
                    style={{ animationDelay: `${ri * 80}ms` }}
                  >
                    <td className="sticky left-0 z-10 w-36 bg-panel p-4 text-[13px] font-semibold leading-snug text-ink sm:w-56 sm:text-sm">
                      {row.label}
                    </td>
                    {row.values.map((v, i) => (
                      <td key={i} className={`p-4 text-center ${i === 0 ? 'bg-primary-soft/50' : 'bg-panel'}`}>
                        <span className="inline-flex items-center justify-center">
                          <Cell value={v} />
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function Testimonial({ quote, name, title, logo }: { quote: string; name: string; title: string; logo: string }) {
  return (
    <Reveal className="mt-6 rounded-2xl border border-line bg-panel p-6 shadow-[var(--shadow-card)]">
      <img src={logo} alt="" className="h-6 w-auto max-w-[130px] object-contain object-left opacity-90" />
      <p className="mt-4 text-[15px] italic leading-relaxed text-ink">&ldquo;{quote}&rdquo;</p>
      <p className="mt-3 text-sm text-ink-muted">
        <span className="font-semibold text-ink">{name}</span> · {title}
      </p>
    </Reveal>
  )
}

export default function ConversationalSimsPage() {
  useEffect(() => {
    if (document.querySelector('script[src*="player.vimeo.com/api/player.js"]')) return
    const script = document.createElement('script')
    script.src = 'https://player.vimeo.com/api/player.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

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
        <div className="mx-auto max-w-5xl px-5 pb-10 pt-8 lg:pb-16 lg:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold text-primary">AI Coaching & Conversational Simulations</p>
            <h1 className="mx-auto mt-3 max-w-[20ch] font-display text-[clamp(32px,4.6vw,52px)] font-bold leading-[1.06] tracking-tight text-ink text-balance">
              From conversation practice to verified skill.
            </h1>
            <p className="mx-auto mt-3 max-w-[52ch] text-[16px] leading-relaxed text-ink-soft">
              Skillwell puts every AI conversation inside a structured simulation scored against real competencies, so practice turns into proof.
            </p>
          </div>

          <div className="mx-auto mt-8 aspect-video max-w-3xl overflow-hidden rounded-2xl border border-line bg-navy-deep shadow-[var(--shadow-overlay)]">
            <iframe
              src={LIVE_AVATAR_EMBED}
              title="Talk to a Skillwell conversational sim"
              className="h-full w-full"
              allow="camera; microphone; autoplay; fullscreen"
              allowFullScreen
            />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#demo"
              className="flex w-full items-center justify-center gap-2 rounded-btn bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover sm:w-auto"
            >
              See it live <Arrow />
            </a>
            <a
              href={DEMO_URL}
              className="flex w-full items-center justify-center gap-2 rounded-btn border border-line bg-panel px-6 py-3 text-sm font-semibold text-ink transition-all hover:border-primary hover:bg-primary-soft hover:text-primary sm:w-auto"
            >
              Book a demo
            </a>
          </div>
        </div>
      </section>

      {/* See It in Action */}
      <section id="demo" className="scroll-mt-16 border-y border-line bg-panel py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-ink text-balance">
              One conversation. Every decision scored.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              Watch a learner talk through a high-stakes moment with an AI avatar while Skillwell tracks each decision point, maps it to a competency, and adapts what comes next.
            </p>
          </div>
          <div className="mx-auto mt-8 aspect-[4/3] max-w-3xl overflow-hidden rounded-2xl border border-line bg-navy-deep shadow-[var(--shadow-card)]">
            <iframe
              src="https://player.vimeo.com/video/1245203371?h=390e7f14cb&badge=0&autopause=0&player_id=0&app_id=58479"
              className="h-full w-full"
              frameBorder={0}
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Conversational Sims"
            />
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="text-center font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-ink text-balance">
            Why It Matters
          </h2>

          <div className="mt-10 flex flex-col gap-10">
            <WhyItem n={1} title="Science-backed skills training creates verified behavior change.">
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                An avatar that talks back is impressive. But without structure, learners don't know what good looks like, and you can't compare one learner's performance to another's. Skillwell builds every conversation on our years of expertise in simulation design: defined decision points, realistic consequences, and guidance at the moments that matter.
              </p>
              <Testimonial
                logo="/logos/ochsner.png"
                quote="Skillwell simulations gave Ochsner healthcare leaders the opportunity to practice applying their Leader Commitments in real-world scenarios while receiving real-time feedback on their decisions."
                name="Natalia Isupova"
                title="AVP for Talent and Learning, Ochsner Health"
              />
            </WhyItem>

            <WhyItem n={2} title="Feedback isn't the same as proficiency.">
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Most AI role-play tells a learner how a conversation went. Skillwell tells you whether they're competent. Every response is mapped to a competency framework, building a proficiency record for each learner, team, cohort, or program that you can take to leadership, accreditors, or regulators.
              </p>
            </WhyItem>

            <WhyItem n={3} title="Your best learner and your newest one need different conversations.">
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                With thousands of learners, single scenario training isn't realistic. Skillwell's adaptive engine adjusts difficulty, pathways, and support based on what each person has actually demonstrated, for frontline teams, clinical staff, and students alike.
              </p>
              <Testimonial
                logo="/logos/merck.png"
                quote="We needed to transform our annual Code of Conduct training from a passive, check-the-box exercise into an engaging experience that truly prepared employees for real-world ethical dilemmas."
                name="Theresa Zeller"
                title="Global Head of Integrated Learning Experiences, Merck"
              />
            </WhyItem>
          </div>
        </div>
      </section>

      {/* How Skillwell Compares: a real table (aligned columns, scannable
          down as well as across), not a stack of disconnected cards. The
          first column stays pinned while the rest scrolls horizontally on a
          phone, and rows rise in with a stagger the first time the table
          comes into view. */}
      <CompareTable />

      {/* Part of the Skillwell Platform */}
      <section className="bg-navy py-12 sm:py-16 text-white">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-balance">
            Build your learning engine on Skillwell to verify skills at scale.
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed text-white/80">
            The new conversational simulations are built on the same foundation as everything else in Skillwell: verifying skills.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {PLATFORM_PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 100} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
                {'image' in p ? (
                  <img src={p.image} alt="" className="h-28 w-full rounded-xl object-cover" />
                ) : (
                  <div className="grid h-28 w-full place-items-center rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: p.accent }}>
                    <TagIcon />
                  </div>
                )}
                <p className="mt-4 text-[11px] font-bold uppercase tracking-wide" style={{ color: p.accent }}>
                  {p.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/75">{p.body}</p>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-[52ch] text-[15px] leading-relaxed text-white/80">
            Every conversation feeds the same skills profile, adaptive pathways, and reporting as your branching simulations and adaptive courses.
          </p>

          <p className="mx-auto mt-6 max-w-[36ch] font-display text-xl font-bold leading-snug tracking-tight text-balance sm:text-2xl">
            You're not adding another point tool. You're adding another way to <span style={{ color: 'var(--color-oasis)' }}>prove skills</span>.
          </p>

          <div className="mt-8">
            <a
              href={PLATFORM_URL}
              className="inline-flex items-center justify-center gap-2 rounded-btn bg-white px-6 py-3 text-sm font-bold text-navy transition-colors hover:bg-white/90"
            >
              Explore the platform <Arrow />
            </a>
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
