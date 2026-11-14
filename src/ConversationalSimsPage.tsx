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
    image: '/devlearn/skills-data.jpg',
    accent: 'var(--color-lime)',
  },
] as const

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.01" />
    </svg>
  )
}

function MinusCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </svg>
  )
}

function TriangleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
      <path d="M12 3 22 20H2z" />
    </svg>
  )
}

// ---- Outcome Report: a faithful recreation of the real product screen,
// not a screenshot, so it's crisp at any size and themed with our own
// tokens. Content (scores, feedback, transcript) comes from a real sample
// report Austin supplied; coach feedback and the transcript are trimmed to
// a representative excerpt (counts shown below each) so the card stays
// scannable on a phone instead of running the full multi-screen report.
const OUTCOME_SCENARIO = 'Pricing negotiation with a skeptical executive'
const OVERALL_SCORE = 50
const PASS_LEVEL = 70

const SKILL_BARS = [
  { label: 'Value articulation', pct: 52 },
  { label: 'Negotiation', pct: 44 },
  { label: 'Objection handling', pct: 55 },
  { label: 'Composure', pct: 48 },
]

const COACH_FEEDBACK = [
  "Your value articulation stayed surface-level. Mentioning a senior account executive and a personalized build-out is a start, but you need to anchor those points to measurable outcomes (time saved, error rates, ROI) so the buyer can see the tangible difference from competitors.",
  "Your composure visibly wavered when you were cut off, resulting in fragmented responses. Build a habit of pausing briefly and restarting calmly with a clear, confident opener to signal that you're in control of the conversation.",
]
const COACH_FEEDBACK_MORE_COUNT = 3

type Turn =
  | { speaker: 'buyer' | 'learner'; text: string }
  | { speaker: 'note'; level: 'partial' | 'incorrect'; skill: string; text: string }

const TRANSCRIPT: Turn[] = [
  {
    speaker: 'buyer',
    text: "Look, I've got your revised proposal up here, and the number is still the number. I'm not seeing anything that explains why we should be paying a premium when two other vendors are sitting in the same ballpark for what looks like the same thing. So help me understand what I'm actually getting for the",
  },
  { speaker: 'learner', text: 'premium.' },
  { speaker: 'note', level: 'partial', skill: 'Composure', text: "Repeating the avatar's word back is a fair start, but follow it with a calm, complete answer rather than a fragment." },
  { speaker: 'learner', text: "Yeah, you're getting" },
  { speaker: 'note', level: 'incorrect', skill: 'Value articulation', text: 'The sentence trails off before naming any concrete value, so state the specific benefit you deliver in one clear line.' },
]
const TRANSCRIPT_MORE_TURNS = 11

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function ScoreTrack({
  pct,
  fillColor,
  marker,
}: {
  pct: number
  fillColor: string
  marker?: { pct: number; label: string }
}) {
  return (
    <div className="relative mt-6 h-2 rounded-full bg-sunken">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: fillColor }} />
      <span
        className="absolute -top-7 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-panel px-2 py-0.5 text-xs font-bold text-ink shadow-[var(--shadow-card)]"
        style={{ left: `${pct}%` }}
      >
        {pct}%
      </span>
      {marker && (
        <>
          <span
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-panel bg-success"
            style={{ left: `${marker.pct}%` }}
          />
          <span
            className="absolute -top-7 -translate-x-1/2 whitespace-nowrap rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success"
            style={{ left: `${marker.pct}%` }}
          >
            {marker.label}
          </span>
        </>
      )}
    </div>
  )
}

function OutcomeReportCard() {
  return (
    <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-line bg-panel shadow-[var(--shadow-overlay)]">
      {/* Browser chrome, matching the "real interface" framing used
          elsewhere on the site, so this reads as the actual product. */}
      <div className="flex items-center gap-1.5 border-b border-line bg-sunken px-4 py-2.5">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate rounded-md bg-panel px-2.5 py-1 text-[11px] font-medium text-ink-muted">
          app.skillwell.com/reports/example
        </span>
      </div>

      <div className="p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-ink-muted">{OUTCOME_SCENARIO}</p>
          <span className="rounded-full bg-sunken px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-muted">
            Example report
          </span>
        </div>
        <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Outcome Report</h3>
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-warning-soft px-3.5 py-2">
          <span className="text-warning">
            <MinusCircleIcon />
          </span>
          <p className="text-sm font-bold text-warning">Not Passed Yet</p>
        </div>
      </div>

      <div className="border-t border-line px-5 py-5 sm:px-8 sm:py-6">
        <p className="text-[15px] leading-relaxed text-ink-soft">
          You did not pass this attempt. There are a few areas where you can strengthen your skills. Please review the feedback below and try again.
        </p>
      </div>

      <div className="mx-5 rounded-xl bg-sunken p-4 sm:mx-8 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-ink">Skills Performance</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <LegendDot color="var(--color-warning)" label="Not Passed" />
            <LegendDot color="var(--color-success)" label="Passed" />
            <LegendDot color="var(--color-primary)" label="Non Scored" />
          </div>
        </div>

        {/* Side by side from sm up so the panel doesn't run so tall; a
            single column on a phone, where there isn't width to spare. */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[1fr_1.3fr] sm:gap-8">
          <div className="rounded-lg bg-panel p-5 shadow-[var(--shadow-card)]">
            <ScoreTrack pct={OVERALL_SCORE} fillColor="var(--color-warning)" marker={{ pct: PASS_LEVEL, label: `Pass level ${PASS_LEVEL}%` }} />
            <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
              Overall Score
              <span className="text-ink-muted">
                <InfoIcon />
              </span>
            </p>
          </div>

          <div className="flex flex-col justify-center gap-6">
            {SKILL_BARS.map((s) => (
              <div key={s.label}>
                <ScoreTrack pct={s.pct} fillColor="var(--color-primary)" />
                <p className="mt-3 text-sm font-semibold text-ink">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-8 sm:py-8">
        <p className="text-sm font-bold text-ink">Coach feedback</p>
        <ul className="mt-3 flex flex-col gap-3">
          {COACH_FEEDBACK.map((f) => (
            <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-muted" />
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-muted">+ {COACH_FEEDBACK_MORE_COUNT} more skill areas scored in the full report.</p>
      </div>

      <div className="border-t border-line px-5 py-5 sm:px-8 sm:py-8">
        <p className="text-sm font-bold text-ink">Conversation Recap</p>
        <div className="mt-5 flex flex-col gap-3">
          {TRANSCRIPT.map((turn, i) => {
            if (turn.speaker === 'note') {
              const isPartial = turn.level === 'partial'
              return (
                <div
                  key={i}
                  className={`ml-3 rounded-lg border-l-4 py-2.5 pl-3.5 pr-3 sm:ml-10 ${isPartial ? 'border-warning bg-warning-soft' : 'border-danger bg-danger/10'}`}
                >
                  <p className={`flex items-center gap-1.5 text-xs font-bold ${isPartial ? 'text-warning' : 'text-danger'}`}>
                    {isPartial ? <TriangleIcon /> : <XIcon />}
                    {isPartial ? 'Partially Correct' : 'Incorrect'} · {turn.skill}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{turn.text}</p>
                </div>
              )
            }
            const isLearner = turn.speaker === 'learner'
            return (
              <div key={i} className={`flex flex-col ${isLearner ? 'items-end' : 'items-start'}`}>
                <span className="mb-1 text-[11px] font-semibold text-ink-muted">{isLearner ? 'You' : 'Marcus Teel'}</span>
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
                    isLearner ? 'rounded-br-sm bg-navy text-white' : 'rounded-bl-sm bg-sunken text-ink'
                  }`}
                >
                  {turn.text}
                </div>
              </div>
            )
          })}
          <p className="mt-1 text-center text-xs text-ink-muted">+ {TRANSCRIPT_MORE_TURNS} more turns, scored the same way.</p>
        </div>
      </div>

      <div className="border-t border-line px-5 py-4 text-center text-[11px] text-ink-muted sm:px-8">
        © 2026 Skillwell. All rights reserved. Access is granted to authorized users only.
      </div>
    </div>
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
              href={DEMO_URL}
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
              This is an example of the outcome report a learner gets after a single conversational sim: scored against real competencies, coached line by line on what to say differently next time.
            </p>
          </div>
          <OutcomeReportCard />
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
                <img src={p.image} alt="" className="h-28 w-full rounded-xl object-cover" />
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
              href={DEMO_URL}
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
