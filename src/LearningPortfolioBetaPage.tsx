import { useEffect, useRef } from 'react'

// Rebuild of the "Short-form · Multiple courses and assessments" design
// artifact (a Skillwell Verify skills report). Markup and inline styles are
// copied verbatim from the design export so colors, spacing, radii and
// typography match exactly; only the templating layer (the original design
// tool's {{...}}/<sc-if>/<sc-for> syntax) is replaced with plain JS string
// building, and the toggle/carousel behavior is reimplemented in React state.

const SHOW_GROWTH = true

type Dim = [name: string, note: string, after: number, before: number]

interface CompetencyRaw {
  id: string
  icon: number
  name: string
  desc: string
  courses: string[]
  dims: Dim[]
}

// dims: [name, note, verified score after courses, starting self-assessment before courses]
const COMPETENCIES: CompetencyRaw[] = [
  {
    id: 'career', icon: 1, name: 'Career & Self-Development',
    desc: 'Builds the self-awareness, learning habits and professional networks that keep a career moving. Skillwell tracks how learners set goals, act on feedback and seek out new opportunities, turning growth into evidence they can share.',
    courses: ['Career Mapping Lab', 'Networking in Practice'],
    dims: [
      ['Awareness of Strengths and Challenges', 'Shows awareness of own strengths and areas for development', 2.8, 1.8],
      ['Professional Development', 'Seeks and embraces development opportunities', 3.0, 2.2],
      ['Networking', 'Builds relationships with people who can help one professionally', 3.2, 2.0],
    ],
  },
  {
    id: 'comm', icon: 2, name: 'Communication',
    desc: 'Shares ideas, information and perspectives clearly with any audience. Course projects and simulations measure how learners write, present, listen and ask for guidance in real workplace scenarios.',
    courses: ['Business Communication Essentials', 'Presenting with Impact'],
    dims: [
      ['Verbal and Written Communication', 'Communicates in a clear and organized manner', 3.5, 2.6],
      ['Active Listening', 'Employs active listening, persuasion and influencing skills', 3.4, 2.4],
      ['Asking for Guidance', 'Asks appropriate questions and informs others when needing guidance', 3.3, 2.8],
    ],
  },
  {
    id: 'critical', icon: 3, name: 'Critical Thinking',
    desc: 'Analyzes information in context to solve problems and make sound decisions. Adaptive scenarios adjust to each learner’s performance, measuring how they gather evidence, weigh options and prioritize next steps.',
    courses: ['Problem Solving Simulations', 'Data Literacy Foundations'],
    dims: [
      ['Problem Solving', 'Makes decisions using sound, inclusive reasoning and judgment', 3.6, 2.5],
      ['Information Analysis', 'Gathers and analyzes information from diverse sources', 3.5, 2.2],
      ['Prioritization', 'Anticipates needs and prioritizes action steps', 3.4, 2.6],
    ],
  },
  {
    id: 'equity', icon: 4, name: 'Equity & Inclusion',
    desc: 'Engages and includes people from different cultures and backgrounds. Learners demonstrate how they seek out diverse perspectives, adapt to new environments and contribute to fair, inclusive teams.',
    courses: ['Inclusive Workplaces'],
    dims: [
      ['Inclusive Decision-Making', 'Uses feedback from multiple perspectives to make decisions', 3.0, 2.6],
      ['Openness to Diverse Ideas', 'Keeps an open mind to new ways of thinking', 3.3, 3.0],
      ['Adaptability', 'Adapts to diverse environments', 3.0, 2.4],
    ],
  },
  {
    id: 'lead', icon: 5, name: 'Leadership',
    desc: 'Recognizes and builds on personal and team strengths to reach shared goals. Learners show how they motivate others, think creatively and manage projects from plan to delivery.',
    courses: ['Leading Small Teams', 'Presenting with Impact'],
    dims: [
      ['Motivating Others', 'Inspires and encourages others, building mutual trust', 2.8, 2.4],
      ['Innovative Thinking', 'Goes beyond traditional methods', 3.0, 2.0],
      ['Project Management', 'Plans, initiates, manages and evaluates projects', 2.9, 1.9],
    ],
  },
  {
    id: 'prof', icon: 6, name: 'Professionalism',
    desc: 'Demonstrates the work habits every workplace counts on. Skillwell measures dependability, attention to detail and accountability across every assignment, giving employers a clear view of consistency over time.',
    courses: ['Workplace Foundations', 'Career Mapping Lab'],
    dims: [
      ['Dependability', 'Is present, prepared and consistent', 3.8, 3.2],
      ['Attention to Detail', 'Produces work with few if any errors', 3.6, 2.8],
      ['Integrity and Accountability', 'Acts with integrity toward self, others and the organization', 3.7, 3.3],
    ],
  },
  {
    id: 'team', icon: 7, name: 'Teamwork',
    desc: 'Builds collaborative relationships that move shared work forward. Group projects and peer reviews capture how learners collaborate, resolve conflict and own their part of the outcome.',
    courses: ['Leading Small Teams', 'Problem Solving Simulations'],
    dims: [
      ['Collaboration', 'Works with others to achieve common goals', 3.7, 2.9],
      ['Conflict Management', 'Manages conflict and meets ambiguity with resilience', 3.4, 2.2],
      ['Shared Accountability', 'Owns individual and team deliverables', 3.7, 2.8],
    ],
  },
  {
    id: 'tech', icon: 8, name: 'Technology',
    desc: 'Uses technology effectively and responsibly to work smarter and reach goals. Learners show how quickly they adopt new tools and use data to make timely, informed decisions.',
    courses: ['Data Literacy Foundations'],
    dims: [
      ['Learning New Tools', 'Quickly adapts to new or unfamiliar technologies', 3.4, 2.4],
      ['Productivity with Technology', 'Uses technology to improve efficiency', 3.1, 2.5],
      ['Data-Informed Decisions', 'Integrates information to support timely decisions', 3.1, 2.0],
    ],
  },
]

const VERIFIERS = [
  { name: '[Verifier Name]', role: 'Course Instructor, Skillwell', date: '10/21/2026', type: 'Instructor-graded capstone project', course: 'Business Communication Essentials' },
  { name: '[Assessment Name]', role: 'Scored scenario assessment', date: '10/14/2026', type: 'Immersive workplace simulation', course: 'Problem Solving Simulations' },
  { name: '[Verifier Name]', role: 'Peer Reviewer, Cohort 12', date: '09/30/2026', type: 'Structured peer review', course: 'Leading Small Teams' },
  { name: '[Verifier Name]', role: 'Employer Mentor, Co-op', date: '09/12/2026', type: 'Workplace observation', course: 'Workplace Foundations' },
]

const ICON_PATHS: Record<number, string> = {
  1: '<path d="M2 9l10-5 10 5-10 5z"></path><path d="M6 11v5c3 2 9 2 12 0v-5"></path><path d="M22 9v6"></path>',
  2: '<path d="M4 5h12v9H9l-5 4z"></path><path d="M16 9h4v9l-3-2h-6v-2"></path>',
  3: '<path d="M9 18h6"></path><path d="M10 21h4"></path><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"></path>',
  4: '<circle cx="9" cy="8" r="3"></circle><circle cx="17" cy="9" r="2.5"></circle><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"></path><path d="M15 14.5c3 0 6 2 6 5"></path>',
  5: '<path d="M3 20l7-11 4 6 2-3 5 8z"></path><path d="M10 9V3l4 1.5-4 1.5"></path>',
  6: '<rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M9 7V5h6v2"></path><path d="M3 12h18"></path><path d="M11 12v2h2v-2"></path>',
  7: '<path d="M2 11l4-4 4 2"></path><path d="M22 11l-4-4-6 3-3 3 2 1 3-2 5 4"></path><path d="M6 7l-2 8 5 4 2-1"></path><path d="M14 18l-2 1"></path>',
  8: '<rect x="4" y="5" width="16" height="11" rx="1"></rect><path d="M2 19h20"></path>',
}

function pct(n: number) { return (n / 4 * 100).toFixed(1) + '%' }
function fmt(n: number) { return n.toFixed(1) }
function r1(n: number) { return Math.round(n * 10) / 10 }
function sign(n: number) { return (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toFixed(1) }
function avg(xs: number[]) { return xs.reduce((a, b) => a + b, 0) / xs.length }
function level(n: number) {
  return n >= 4 ? 'Advanced Application' : n >= 3 ? 'Early Application' : n >= 2 ? 'Comprehension' : 'Emerging Knowledge'
}

function progressRow(fillColor: string, pctVal: string, trackHeight: number, radius: number, valueStyle: string, value: string, label: string) {
  return `
<div style="display: grid; grid-template-columns: minmax(0, 1fr) 132px; gap: 16px; align-items: center">
  <div class="sw-track" style="background: #BDE4F9; height: ${trackHeight}px; border-radius: ${radius}px"><div class="sw-fill" style="background: ${fillColor}; border-radius: ${radius}px; width: ${pctVal}"></div></div>
  <span style="font-size: 15px"><strong style="${valueStyle}">${value}</strong> ${label}</span>
</div>`
}

function compactProgressRow(fillColor: string, pctVal: string, value: string, label: string) {
  return `
<div style="display: grid; grid-template-columns: minmax(0, 1fr) 132px; gap: 16px; align-items: center">
  <div class="sw-track" style="background: #BDE4F9; height: 10px; border-radius: 5px"><div class="sw-fill" style="background: ${fillColor}; border-radius: 5px; width: ${pctVal}"></div></div>
  <span style="font-size: 14px"><strong style="font-size: 17px">${value}</strong> ${label}</span>
</div>`
}

interface EngineState {
  open: Record<string, boolean>
  vi: number
}

function computeComps(state: EngineState) {
  return COMPETENCIES.map((c) => {
    const v = r1(avg(c.dims.map((d) => d[2])))
    const s = r1(avg(c.dims.map((d) => d[3])))
    const g = r1(v - s)
    const lf = level(s)
    const lt = level(v)
    const open = !!state.open[c.id]
    return {
      id: c.id,
      icon: c.icon,
      name: c.name,
      desc: c.desc,
      courses: c.courses,
      v: fmt(v), s: fmt(s), vNum: v, sNum: s, gNum: g, growth: sign(g),
      vPct: pct(v), sPct: pct(s),
      levelChange: lf === lt ? lt : `${lf} → ${lt}`,
      open,
      toggleLabel: open ? 'Hide skill dimensions' : 'Show skill dimensions',
      dims: c.dims.map((d) => ({
        name: d[0], note: d[1], v: fmt(d[2]), s: fmt(d[3]),
        vPct: pct(d[2]), sPct: pct(d[3]), growth: sign(r1(d[2] - d[3])),
      })),
    }
  })
}

function competencyHtml(c: ReturnType<typeof computeComps>[number]) {
  return `
<section style="background: #FFFFFF; border: 1.5px solid #BDE4F9; border-radius: 20px; padding: 28px; display: flex; flex-direction: column; gap: 20px">
  <div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start">
    <div style="flex: 1 1 380px; min-width: 0; display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 14px">
        <span style="width: 48px; height: 48px; border-radius: 12px; background: #BDE4F9; display: flex; align-items: center; justify-content: center; flex: none">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0E4854" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[c.icon]}</svg>
        </span>
        <h3 style="margin: 0; font-family: 'Lora', 'Cambria', serif; font-size: 24px; font-weight: 700">${c.name}</h3>
        <span style="padding: 4px 10px; border-radius: 999px; background: #BDE4F9; font-size: 13px; font-weight: 600">${c.levelChange}</span>
        ${SHOW_GROWTH ? `<span style="padding: 4px 10px; border-radius: 999px; background: #AFCB37; font-size: 13px; font-weight: 700">${c.growth} growth</span>` : ''}
      </div>
      <p style="margin: 0; font-size: 15px; line-height: 1.6">${c.desc}</p>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center">
        <span style="font-size: 13px; font-weight: 600; color: #0E4854">Verified through</span>
        ${c.courses.map((course) => `<span style="padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(14,72,84,0.22); font-size: 13px">${course}</span>`).join('')}
      </div>
      <div>
        <button type="button" class="sw-linkbtn" data-toggle="${c.id}" aria-expanded="${c.open ? 'true' : 'false'}" style="font-weight: 600; font-size: 15px; min-height: 44px">${c.toggleLabel}</button>
      </div>
    </div>
    <div style="flex: 1.25 1 480px; min-width: 0; display: flex; flex-direction: column; gap: 10px; padding-top: 6px">
      ${progressRow('#00BF80', c.sPct, 18, 9, "font-family: 'Lora', 'Cambria', serif; font-size: 22px", c.s, 'Before')}
      ${progressRow('#0E4854', c.vPct, 18, 9, "font-family: 'Lora', 'Cambria', serif; font-size: 22px", c.v, 'Verified')}
    </div>
  </div>

  ${c.open ? `
  <div style="border-top: 1px solid rgba(14,72,84,0.12); padding-top: 4px; display: flex; flex-direction: column">
    ${c.dims.map((d) => `
    <div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: center; padding: 18px 0 18px 24px; border-bottom: 1px solid rgba(14,72,84,0.08)">
      <div style="flex: 1 1 356px; min-width: 0; display: flex; flex-direction: column; gap: 4px">
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px">
          <span style="font-size: 16px; font-weight: 600">${d.name}</span>
          ${SHOW_GROWTH ? `<span style="padding: 2px 8px; border-radius: 999px; background: #AFCB37; font-size: 13px; font-weight: 700">${d.growth}</span>` : ''}
        </div>
        <span style="font-size: 14px; color: #0E4854">${d.note}</span>
      </div>
      <div style="flex: 1.25 1 480px; min-width: 0; display: flex; flex-direction: column; gap: 8px">
        ${compactProgressRow('#00BF80', d.sPct, d.s, 'Before')}
        ${compactProgressRow('#0E4854', d.vPct, d.v, 'Verified')}
      </div>
    </div>`).join('')}
  </div>` : ''}
</section>`
}

function renderReport(state: EngineState): string {
  const comps = computeComps(state)
  const oV = r1(avg(comps.map((c) => c.vNum)))
  const oS = r1(avg(comps.map((c) => c.sNum)))
  const overallG = sign(r1(oV - oS))
  const overallLevelChange = `${level(oS)} → ${level(oV)}`
  const top = [...comps].sort((a, b) => b.gNum - a.gNum).slice(0, 3)
  const verifier = VERIFIERS[state.vi]

  return `
  <!-- Top bar -->
  <header style="background: #FFFFFF; border-bottom: 1px solid rgba(14,72,84,0.12)">
    <div style="max-width: 1240px; margin: 0 auto; padding: 16px 32px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px">
      <div style="display: flex; align-items: center; gap: 10px">
        <span style="font-family: 'Lora', 'Cambria', serif; font-weight: 700; font-size: 22px">Skillwell Verify</span>
      </div>
      <nav aria-label="Report actions" style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
        <a href="#" style="display: inline-flex; align-items: center; min-height: 44px; padding: 0 18px; border-radius: 10px; border: 1.5px solid #0E4854; color: #0E4854; text-decoration: none; font-weight: 600; font-size: 15px">Download PDF</a>
        <a href="#" style="display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 20px; border-radius: 10px; background: #0E4854; color: #FFFFFF; text-decoration: none; font-weight: 600; font-size: 15px">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"></path><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"></path></svg>
          Share link
        </a>
      </nav>
    </div>
  </header>

  <!-- Hero -->
  <section style="position: relative; overflow: hidden; background: #0E4854; color: #FFFFFF">
    <svg viewBox="0 0 600 320" preserveAspectRatio="xMaxYMid slice" aria-hidden="true" style="position: absolute; right: -40px; top: 0; height: 100%; width: 560px; max-width: 70%">
      <path d="M120 360 C 200 180, 360 60, 640 20" stroke="#00BF80" stroke-width="56" fill="none" stroke-linecap="round" opacity="0.9"></path>
      <path d="M300 380 C 360 250, 470 160, 640 130" stroke="#0DC9FE" stroke-width="40" fill="none" stroke-linecap="round" opacity="0.85"></path>
      <path d="M450 380 C 490 300, 560 250, 640 235" stroke="#AFCB37" stroke-width="28" fill="none" stroke-linecap="round"></path>
    </svg>
    <div style="position: relative; max-width: 1240px; margin: 0 auto; padding: 48px 32px 56px; display: flex; flex-wrap: wrap; align-items: center; gap: 24px">
      <div style="width: 88px; height: 88px; border-radius: 50%; background: #BDE4F9; color: #0E4854; display: flex; align-items: center; justify-content: center; flex: none"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0E4854" stroke-width="1.8" stroke-linecap="round" role="img" aria-label="Learner photo placeholder"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"></path></svg></div>
      <div style="display: flex; flex-direction: column; gap: 8px; min-width: 0; flex: 1 1 420px">
        <p style="margin: 0; font-size: 15px; letter-spacing: 0.4px; color: #BDE4F9">Verified Skills Growth Report · Before and After Skillwell</p>
        <h1 style="margin: 0; font-family: 'Lora', 'Cambria', serif; font-weight: 700; font-size: 48px; line-height: 1.1">[Learner Name]</h1>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px">
          <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; background: #AFCB37; color: #0E4854; font-weight: 700; font-size: 14px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l4 4 10-10"></path></svg>
            Skillwell Verified
          </span>
          <span style="padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.45); font-size: 14px">Credential ID SW-2026-04817</span>
          <span style="padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.45); font-size: 14px">6 courses · 18 assessments</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; text-align: right; margin-left: auto">
        <span style="font-size: 14px; color: #BDE4F9">Last updated</span>
        <span style="font-family: 'Lora', 'Cambria', serif; font-weight: 600; font-size: 28px">10/21/2026</span>
      </div>
    </div>
  </section>

  <main style="max-width: 1240px; margin: 0 auto; padding: 40px 32px 64px; display: flex; flex-direction: column; gap: 24px">

    <!-- Overview row -->
    <div style="display: flex; flex-wrap: wrap; gap: 24px">
      <section aria-labelledby="lvl-h" style="flex: 1 1 520px; min-width: 0; background: #FFFFFF; border: 1.5px solid #BDE4F9; border-radius: 20px; overflow: hidden">
        <div style="padding: 20px 28px; border-bottom: 1px solid rgba(14,72,84,0.12); display: flex; align-items: center; gap: 8px">
          <h2 id="lvl-h" style="margin: 0; font-family: 'Lora', 'Cambria', serif; font-size: 22px; font-weight: 700">Your Skill Growth</h2>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14"></path><path d="M12 17h.01"></path></svg>
        </div>
        <div style="padding: 28px; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px">
          <div style="background: #FFFFFF; color: #0E4854; border: 3px solid #00BF80; border-radius: 16px; padding: 24px 16px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center">
            <span style="font-size: 13px; font-weight: 600; letter-spacing: 0.3px">BEFORE</span>
            <span style="font-family: 'Lora', 'Cambria', serif; font-weight: 700; font-size: 72px; line-height: 1">${fmt(oS)}</span>
            <span style="font-size: 14px">out of 4</span>
            <span style="font-weight: 700; font-size: 17px">Starting Self-Assessment</span>
            <span style="font-size: 13px">Taken 08/04/2026</span>
          </div>
          <div style="background: #0E4854; color: #FFFFFF; border-radius: 16px; padding: 24px 16px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center">
            <span style="font-size: 13px; font-weight: 600; letter-spacing: 0.3px; color: #BDE4F9">AFTER</span>
            <span style="font-family: 'Lora', 'Cambria', serif; font-weight: 700; font-size: 72px; line-height: 1">${fmt(oV)}</span>
            <span style="font-size: 14px; color: #BDE4F9">out of 4</span>
            <span style="font-weight: 700; font-size: 17px; display: inline-flex; align-items: center; gap: 6px">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00BF80" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l4 4 10-10"></path></svg>
              Verified Score
            </span>
            <span style="font-size: 13px; color: #BDE4F9">Verified 10/21/2026</span>
          </div>
          ${SHOW_GROWTH ? `
          <div style="background: #AFCB37; color: #0E4854; border-radius: 16px; padding: 24px 16px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center">
            <span style="font-size: 13px; font-weight: 600; letter-spacing: 0.3px">GROWTH</span>
            <span style="font-family: 'Lora', 'Cambria', serif; font-weight: 700; font-size: 72px; line-height: 1">${overallG}</span>
            <span style="font-size: 14px">points</span>
            <span style="font-weight: 700; font-size: 17px">Verified Growth</span>
            <span style="font-size: 13px">Across 6 courses</span>
          </div>` : ''}
        </div>
      </section>

      <section aria-labelledby="ver-h" style="flex: 1 1 440px; min-width: 0; background: #FFFFFF; border: 1.5px solid #BDE4F9; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column">
        <div style="padding: 20px 28px; border-bottom: 1px solid rgba(14,72,84,0.12); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px">
          <h2 id="ver-h" style="margin: 0; font-family: 'Lora', 'Cambria', serif; font-size: 22px; font-weight: 700">Verified by</h2>
          <a href="#" style="font-weight: 600; font-size: 15px">View feedback</a>
        </div>
        <div style="padding: 24px 28px; display: flex; flex-direction: column; gap: 18px; flex: 1">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; align-items: flex-start">
            <div style="display: flex; flex-direction: column; gap: 2px">
              <span style="font-weight: 700; font-size: 20px">${verifier.name}</span>
              <span style="font-size: 16px">${verifier.role}</span>
            </div>
            <span style="padding: 6px 12px; border-radius: 999px; background: #BDE4F9; color: #0E4854; font-weight: 600; font-size: 13px">Verified ${verifier.date}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px">
            <div style="display: flex; flex-direction: column; gap: 2px">
              <span style="font-size: 13px; font-weight: 600; letter-spacing: 0.3px; color: #0E4854">EVIDENCE TYPE</span>
              <span style="font-size: 16px">${verifier.type}</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px">
              <span style="font-size: 13px; font-weight: 600; letter-spacing: 0.3px; color: #0E4854">COURSE</span>
              <span style="font-size: 16px">${verifier.course}</span>
            </div>
          </div>
          <div style="margin-top: auto; display: flex; align-items: center; justify-content: center; gap: 12px">
            <button type="button" aria-label="Previous verifier" data-verifier-nav="prev" style="width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid rgba(14,72,84,0.25); background: #FFFFFF; color: #0E4854; cursor: pointer; display: flex; align-items: center; justify-content: center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"></path></svg>
            </button>
            <span style="font-weight: 700; font-size: 15px; min-width: 48px; text-align: center">${state.vi + 1} / ${VERIFIERS.length}</span>
            <button type="button" aria-label="Next verifier" data-verifier-nav="next" style="width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid rgba(14,72,84,0.25); background: #FFFFFF; color: #0E4854; cursor: pointer; display: flex; align-items: center; justify-content: center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"></path></svg>
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Scale header -->
    <div style="display: flex; flex-wrap: wrap; align-items: flex-end; gap: 24px; padding: 8px 28px 0">
      <div style="flex: 1 1 380px; display: flex; flex-wrap: wrap; gap: 18px; align-items: center; font-size: 14px">
        <span style="display: inline-flex; align-items: center; gap: 8px"><span style="width: 22px; height: 10px; border-radius: 5px; background: #00BF80"></span>Before: starting self-assessment</span>
        <span style="display: inline-flex; align-items: center; gap: 8px"><span style="width: 22px; height: 10px; border-radius: 5px; background: #0E4854"></span>Verified: after course completion</span>
      </div>
      <div class="sw-scale" style="flex: 1.25 1 480px; display: grid; grid-template-columns: minmax(0, 1fr) 132px; gap: 16px">
        <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr))">
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; text-align: right; font-size: 13px; font-weight: 600; width: 142px"><span>Emerging Knowledge</span><span style="width: 26px; height: 26px; border-radius: 50%; border: 2px solid #0E4854; display: flex; align-items: center; justify-content: center; font-size: 13px">1</span></div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; text-align: right; font-size: 13px; font-weight: 600"><span>Comprehension</span><span style="width: 26px; height: 26px; border-radius: 50%; border: 2px solid #0E4854; display: flex; align-items: center; justify-content: center; font-size: 13px">2</span></div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; text-align: right; font-size: 13px; font-weight: 600"><span>Early Application&nbsp;&nbsp;</span><span style="width: 26px; height: 26px; border-radius: 50%; border: 2px solid rgb(14, 72, 84); display: flex; align-items: center; justify-content: center; font-size: 13px">3</span></div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; text-align: right; font-size: 13px; font-weight: 600; width: 141px"><span>Advanced Application</span><span style="width: 26px; height: 26px; border-radius: 50%; border: 2px solid #0E4854; display: flex; align-items: center; justify-content: center; font-size: 13px">4</span></div>
        </div>
        <div></div>
      </div>
    </div>

    <!-- Overall -->
    <section aria-labelledby="ov-h" style="background: #FFFFFF; border: 1.5px solid #BDE4F9; border-radius: 20px; padding: 32px 28px; display: flex; flex-wrap: wrap; gap: 24px; align-items: center">
      <div style="flex: 1 1 380px; min-width: 0; display: flex; flex-direction: column; gap: 12px">
        <div style="display: flex; align-items: center; gap: 14px">
          <span style="width: 52px; height: 52px; border-radius: 12px; background: #BDE4F9; display: flex; align-items: center; justify-content: center; flex: none">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0E4854" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V11"></path><path d="M10 20V6"></path><path d="M16 20v-7"></path><path d="M20 4l-4 4-3-2-4 4"></path></svg>
          </span>
          <h2 id="ov-h" style="margin: 0; font-family: 'Lora', 'Cambria', serif; font-size: 32px; font-weight: 700">Overall Skill Growth</h2>
        </div>
        <p style="margin: 0; font-size: 16px; line-height: 1.6">Before your first Skillwell course, you rated yourself on eight core workforce competencies. After completing your courses, assessors verified your skills on the same scale, using the real work you produced. Comparing the two shows exactly where you grew, backed by evidence that faculty and employers can trust.</p>
        <span style="align-self: flex-start; padding: 6px 12px; border-radius: 999px; background: #BDE4F9; font-size: 14px; font-weight: 600">${overallLevelChange}</span>
      </div>
      <div style="flex: 1.25 1 480px; min-width: 0; display: flex; flex-direction: column; gap: 10px">
        ${progressRow('#00BF80', pct(oS), 22, 11, "font-family: 'Lora', 'Cambria', serif; font-size: 26px", fmt(oS), 'Before')}
        ${progressRow('#0E4854', pct(oV), 22, 11, "font-family: 'Lora', 'Cambria', serif; font-size: 26px", fmt(oV), 'Verified')}
      </div>
    </section>

    <!-- Top growth -->
    ${SHOW_GROWTH ? `
    <section aria-labelledby="top-h" style="display: flex; flex-direction: column; gap: 16px">
      <h2 id="top-h" style="margin: 0; font-family: 'Lora', 'Cambria', serif; font-size: 26px; font-weight: 700">Where you grew most</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px">
        ${top.map((t) => `
        <div style="background: #FFFFFF; border: 1.5px solid #BDE4F9; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 12px">
          <span style="font-size: 17px; font-weight: 700">${t.name}</span>
          <div style="display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap">
            <span style="font-family: 'Lora', 'Cambria', serif; font-size: 30px; font-weight: 700; color: #0E4854">${t.s}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00BF80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16"></path><path d="M14 6l6 6-6 6"></path></svg>
            <span style="font-family: 'Lora', 'Cambria', serif; font-size: 30px; font-weight: 700; color: #0E4854">${t.v}</span>
            <span style="margin-left: auto; padding: 4px 10px; border-radius: 999px; background: #AFCB37; font-size: 15px; font-weight: 700">${t.growth}</span>
          </div>
          <span style="font-size: 14px">${t.levelChange}</span>
        </div>`).join('')}
      </div>
    </section>` : ''}

    <!-- Competencies -->
    ${comps.map((c) => competencyHtml(c)).join('')}

    <!-- Verification footer -->
    <section style="background: #0E4854; color: #FFFFFF; border-radius: 20px; padding: 32px 28px; display: flex; flex-wrap: wrap; gap: 24px; align-items: center; justify-content: space-between">
      <div style="flex: 1 1 420px; display: flex; flex-direction: column; gap: 8px">
        <h2 style="margin: 0; font-family: 'Lora', 'Cambria', serif; font-size: 26px; font-weight: 700">How this report is verified</h2>
        <p style="margin: 0; font-size: 16px; line-height: 1.6">Every learner starts with a self-assessment before their first course. As they complete coursework, Skillwell verifies their skills through instructor-graded projects, adaptive simulations and reviewed practice, scored on the same four-level scale from Emerging Knowledge to Advanced Application. The result is a clear before-and-after view: verified proof of growth for learners, and immediate insight for faculty and employers.</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px; padding: 18px 22px; border-radius: 14px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); width: 349px"><span style="font-size: 13px; color: rgb(189, 228, 249)">Confirm this credential at</span>
        <span style="font-weight: 700; font-size: 16px">[verification URL]&nbsp;</span>
      </div>
    </section>
  </main>`
}

export default function LearningPortfolioBetaPage() {
  const engineRef = useRef<EngineState>({ open: { career: true }, vi: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = renderReport(engineRef.current)

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const toggleEl = target.closest<HTMLElement>('[data-toggle]')
      if (toggleEl) {
        const id = toggleEl.dataset.toggle!
        engineRef.current = { ...engineRef.current, open: { ...engineRef.current.open, [id]: !engineRef.current.open[id] } }
        container!.innerHTML = renderReport(engineRef.current)
        return
      }
      const navEl = target.closest<HTMLElement>('[data-verifier-nav]')
      if (navEl) {
        const dir = navEl.dataset.verifierNav
        const n = VERIFIERS.length
        engineRef.current = {
          ...engineRef.current,
          vi: dir === 'prev' ? (engineRef.current.vi - 1 + n) % n : (engineRef.current.vi + 1) % n,
        }
        container!.innerHTML = renderReport(engineRef.current)
        return
      }
    }

    container.addEventListener('click', handleClick)
    return () => container.removeEventListener('click', handleClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: "'Krub', 'Calibri', system-ui, sans-serif", color: '#0E4854', background: '#FFFFFF', minHeight: '100vh' }}
    />
  )
}
