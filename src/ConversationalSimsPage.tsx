// Conversational sims product page (/conversational-sims). Copy comes
// directly from "Skillwell Conversational Sims - Product Page Copy" (Austin,
// Nov 2026) — this component is a layout pass, not a copy rewrite. Two spots
// in that doc were marked as not yet written: a differentiator callout
// (covered well enough by the comparison table below, so it's omitted here
// rather than inventing filler) and two testimonials with real company names
// but no quote text yet (rendered as clearly-labeled placeholders, never
// invented words attributed to a real customer).

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

const COMPARE_COLUMNS = ['Skillwell', 'AI role-play & coaching tools', 'Avatar video tools', 'LMS & LXP AI add-ons']

const COMPARE_ROWS: { label: string; values: string[] }[] = [
  { label: 'Built on decades of immersive simulation design', values: ['✓', '✗', '✗', '✗'] },
  { label: 'Structured, branching scenarios', values: ['✓', 'Mostly open-ended', '✗', 'Mostly open-ended'] },
  { label: 'Scored against a competency framework', values: ['✓', 'Conversation feedback', '✗', 'Varies'] },
  { label: "Adapts to each learner's demonstrated proficiency", values: ['✓', 'Limited', '✗', 'Varies'] },
  { label: 'Proficiency data by learner, team, and cohort', values: ['✓', 'Varies', '✗', 'Completion-focused'] },
  { label: 'Built for frontline, clinical, and higher ed at scale', values: ['✓', 'Mostly sales & leadership', 'N/A', 'Generic content libraries'] },
]

function TestimonialSlot({ company, context, logo }: { company: string; context: string; logo?: string }) {
  return (
    <div className="mt-6 flex flex-col items-start gap-3 rounded-xl border border-dashed border-line-strong bg-sunken/40 p-5 sm:flex-row sm:items-center sm:gap-4">
      {logo ? (
        <img src={logo} alt={company} className="h-6 w-auto max-w-[140px] shrink-0 object-contain object-left opacity-80" />
      ) : (
        <span className="shrink-0 text-sm font-bold text-ink">{company}</span>
      )}
      <p className="text-sm italic leading-relaxed text-ink-muted">{context}</p>
    </div>
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

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#demo"
              className="flex items-center justify-center gap-2 rounded-btn bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
            >
              See it live <Arrow />
            </a>
            <a
              href={DEMO_URL}
              className="flex items-center justify-center gap-2 rounded-btn border border-line bg-panel px-6 py-3 text-sm font-semibold text-ink transition-all hover:border-primary hover:bg-primary-soft hover:text-primary"
            >
              Book a demo
            </a>
          </div>
        </div>
      </section>

      {/* See It in Action */}
      <section id="demo" className="scroll-mt-16 border-y border-line bg-panel py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-ink text-balance">
              One conversation. Every decision scored.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              Watch a learner talk through a high-stakes moment with an AI avatar while Skillwell tracks each decision point, maps it to a competency, and adapts what comes next.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-line bg-navy-deep shadow-[var(--shadow-card)]">
            <img src="/devlearn/capability-conversational.jpg" alt="A learner in a Skillwell conversational simulation" className="aspect-video w-full object-cover" />
          </div>
          <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-ink-muted">
            Placeholder image. Swap in the 60 to 90 second recorded demo when it's ready.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="text-center font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-ink text-balance">
            Why It Matters
          </h2>

          <div className="mt-10 flex flex-col gap-10">
            <div>
              <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                1. Science-backed skills training creates verified behavior change.
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                An avatar that talks back is impressive. But without structure, learners don't know what good looks like, and you can't compare one learner's performance to another's. Skillwell builds every conversation on our years of expertise in simulation design: defined decision points, realistic consequences, and guidance at the moments that matter.
              </p>
              <TestimonialSlot company="Ochsner Health" logo="/logos/ochsner.png" context="Mini case study or testimonial from Ochsner Health goes here." />
            </div>

            <div>
              <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                2. Feedback isn't the same as proficiency.
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Most AI role-play tells a learner how a conversation went. Skillwell tells you whether they're competent. Every response is mapped to a competency framework, building a proficiency record for each learner, team, cohort, or program that you can take to leadership, accreditors, or regulators.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                3. Your best learner and your newest one need different conversations.
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                With thousands of learners, single scenario training isn't realistic. Skillwell's adaptive engine adjusts difficulty, pathways, and support based on what each person has actually demonstrated, for frontline teams, clinical staff, and students alike.
              </p>
              <TestimonialSlot company="Valterra" context="Mini testimonial from Valterra on compliance and onboarding goes here." />
            </div>
          </div>
        </div>
      </section>

      {/* How Skillwell Compares */}
      <section className="bg-sand py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-ink text-balance">
            How Skillwell Compares
          </h2>

          <div className="mt-8 rounded-2xl border border-line bg-panel shadow-[var(--shadow-card)]" style={{ overflowX: 'auto' }}>
            <table className="w-full border-collapse text-left text-sm" style={{ minWidth: 720 }}>
              <thead>
                <tr className="border-b border-line">
                  <th className="p-4 font-semibold text-ink-soft"></th>
                  {COMPARE_COLUMNS.map((c, i) => (
                    <th
                      key={c}
                      className={`p-4 font-bold ${i === 0 ? 'bg-primary-soft text-primary' : 'text-ink'}`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, ri) => (
                  <tr key={row.label} className={ri < COMPARE_ROWS.length - 1 ? 'border-b border-line' : ''}>
                    <td className="p-4 font-semibold text-ink">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className={`p-4 ${i === 0 ? 'bg-primary-soft/40' : ''}`}>
                        <Cell value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Part of the Skillwell Platform */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-display text-[clamp(24px,3vw,34px)] font-bold tracking-tight text-balance">
            Build your learning engine on Skillwell to verify skills at scale.
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-[15px] leading-relaxed text-white/80">
            The new conversational simulations in Skillwell are built on the foundation of what matters most: verifying skills. They work alongside our branching simulations, adaptive learning, and skills taxonomy. Every conversation feeds the same skills profile and adaptive pathways and rolls up into comprehensive reporting, so you're not adding another point tool. You're adding another way to prove skill.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <img src="/devlearn/capability-adaptive.jpg" alt="Adaptive learning map" className="h-20 w-32 rounded-lg object-cover opacity-90 sm:h-24 sm:w-40" />
            <img src="/devlearn/capability-branching.jpg" alt="Branching simulation" className="h-20 w-32 rounded-lg object-cover opacity-90 sm:h-24 sm:w-40" />
          </div>
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
