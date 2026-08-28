import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { LearningMap } from './LearningMap'
import { SAMPLE_MAP } from '../lib/mapData'
import { trackStartPreview } from '../lib/posthog'
import '../reel.css'

// Real report data (matches the product's Auto-Insights report, "leadership").
const SKILLS = [
  'Overall Performance',
  'Set Clear Expectations',
  'Deliver Constructive Feedback',
  'Coach and Develop Others',
  'Adapt Your Leadership Style',
  'Navigate Difficult Conversations',
  'Put the Customer First',
]
const FIRST = [67.6, 69.6, 72.3, 56.8, 65.0, 68.4, 67.0]
const IMPROVE = [
  { first: 75.0, last: 75.0, delta: '0.0%', cls: 'flat' },
  { first: 80.0, last: 90.0, delta: '+10.0%', cls: 'up' },
  { first: 77.8, last: 77.8, delta: '0.0%', cls: 'flat' },
  { first: 62.5, last: 87.5, delta: '+25.0%', cls: 'up' },
  { first: 75.0, last: 66.7, delta: '−8.3%', cls: 'down' },
  { first: 66.7, last: 66.7, delta: '0.0%', cls: 'flat' },
  { first: 66.7, last: 66.7, delta: '0.0%', cls: 'flat' },
]

const TIME = [
  { label: 'All Attempts', mins: 18.7, w: 5 },
  { label: '1 Attempt', mins: 18.7, w: 5 },
  { label: '2 Attempts', mins: 65.1, w: 19 },
  { label: '3 Attempts', mins: 316.1, w: 93 },
  { label: '4+ Attempts', mins: 341.1, w: 100 },
]

const LABELS = ['Adaptive learning map', 'Drop in your content', 'Immersive simulations', 'Skills that prove ROI']
// Per-scene durations (ms). The avatar (index 2) holds longer.
const DUR = [4600, 4600, 6200, 4600]
const v = (w: number) => ({ '--w': `${w}%` } as CSSProperties)

export function HeroReel() {
  const rootRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const scenes = Array.from(root.querySelectorAll<HTMLElement>('.scene'))
    const fills = Array.from(root.querySelectorAll<HTMLElement>('.reel-bars-nav i'))
    const tag = root.querySelector<HTMLElement>('.reel-tag')
    const scroll = root.querySelector<HTMLElement>('.rep-scroll')
    const reportBody = root.querySelector<HTMLElement>('.sc-report .win-body')
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let i = 0
    let timer = 0

    function show(n: number) {
      scenes.forEach((s, k) => s.classList.toggle('is-active', k === n))
      if (tag) tag.textContent = LABELS[n]
      fills.forEach((f, k) => {
        f.style.transition = 'none'
        f.style.width = k < n ? '100%' : '0%'
        if (k === n && !reduce) {
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              f.style.transition = `width ${DUR[n]}ms linear`
              f.style.width = '100%'
            }),
          )
        } else if (k === n) {
          f.style.width = '100%'
        }
      })
      // Screen-scroll through the full report inside its browser window.
      if (scroll && reportBody) {
        scroll.style.transition = 'none'
        scroll.style.transform = 'translateY(0)'
        if (n === 3 && !reduce) {
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              const dist = Math.max(0, scroll.scrollHeight - reportBody.clientHeight)
              scroll.style.transition = `transform ${DUR[3] - 300}ms cubic-bezier(.4,0,.5,1)`
              scroll.style.transform = `translateY(${-dist}px)`
            }),
          )
        }
      }
    }

    function schedule() {
      timer = window.setTimeout(() => {
        i = (i + 1) % scenes.length
        show(i)
        schedule()
      }, DUR[i])
    }

    show(0)
    if (reduce) return
    schedule()
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <a ref={rootRef} className="player" href="https://www.skillwell.com/take-a-tour" onClick={() => trackStartPreview()} aria-label="Start the preview">
      <div className="reel">
        {/* Scene 1: the real learning-map component, in a browser window */}
        <div className="scene sc-map is-active">
          <div className="win-stage">
            <div className="win">
              <div className="win-bar"><i /><i /><i /><span className="url">app.skillwell.com/map</span></div>
              <div className="win-body">
                <div className="map-holder">
                  <LearningMap content={SAMPLE_MAP} showPopover initialTransform={{ x: 40, y: 34, scale: 0.46 }} className="h-full w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scene 2: drop in your content, in a browser window */}
        <div className="scene sc-upload">
          <div className="win-stage">
            <div className="win">
              <div className="win-bar"><i /><i /><i /><span className="url">app.skillwell.com/build</span></div>
              <div className="win-body up-screen">
                <div className="up-card">
                  <span className="up-eyebrow">Optional, but this is the magic</span>
                  <span className="up-title">Have existing training content?</span>
                  <div className="up-zone">
                    <span className="up-zicon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                    </span>
                    <span className="up-ztext main">Drop your document here or click to browse</span>
                    <span className="up-ztext done">Got it. Building your learning map</span>
                  </div>
                </div>
                <div className="filecard">
                  <div className="sheet">
                    <div className="lines"><span /><span /><span /></div>
                    <span className="badge">PDF</span>
                  </div>
                  <div className="fname">Leadership-Handbook.pdf</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scene 3: simulation GIF (already a laptop-in-office shot), on a desk */}
        <div className="scene sc-sim">
          <div className="sim-stage">
            <div className="sim-frame">
              <img className="sim-vid" src="./avatar.gif" alt="Skillwell immersive simulation" />
            </div>
          </div>
        </div>

        {/* Scene 4: skills report — screen scrolls through it, in a browser window */}
        <div className="scene sc-report">
          <div className="win-stage">
            <div className="win">
              <div className="win-bar"><i /><i /><i /><span className="url">app.skillwell.com/insights</span></div>
              <div className="win-body">
                <div className="rep-scroll">
                  <span className="rep-ey">Auto-Insights</span>
            <span className="rep-h">Skills Performance</span>
            <span className="rep-meta">Meridian Health · Introduction to Management</span>
            <div className="rep-stats">
              <div className="rep-tile"><b>35</b><span>Learners engaged</span></div>
              <div className="rep-tile"><b>24</b><span>Completed</span></div>
              <div className="rep-donut">
                <svg viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-sunken)" strokeWidth="4" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-oasis)" strokeWidth="4" strokeDasharray="68.6 100" strokeLinecap="round" transform="rotate(-90 18 18)" />
                </svg>
                <div className="dl"><b>68.6%</b><span>Completion</span></div>
              </div>
            </div>
            <div className="rep-block">
              <span className="rep-blocktitle">Average score, first attempt</span>
              {SKILLS.map((s, k) => (
                <div className="rep-row" key={s}>
                  <span className="rep-label">{s}</span>
                  <div className="rep-track"><i style={v(FIRST[k])} /></div>
                  <span className="rep-val">{FIRST[k].toFixed(1)}</span>
                </div>
              ))}
            </div>
            <div className="rep-block">
              <span className="rep-blocktitle">Score improvements: first vs last attempt</span>
              {IMPROVE.map((r, k) => (
                <div className="rep-row2" key={SKILLS[k]}>
                  <span className="rep-label">{SKILLS[k]}</span>
                  <div className="rep-bars">
                    <i className="bar-first" style={v(r.first)} />
                    <i className="bar-last" style={v(r.last)} />
                  </div>
                  <span className={`rep-delta ${r.cls}`}>{r.delta}</span>
                </div>
              ))}
                  </div>
                  <div className="rep-block">
                    <span className="rep-blocktitle">Time on task, by attempts (minutes)</span>
                    {TIME.map((t) => (
                      <div className="rep-row" key={t.label}>
                        <span className="rep-label">{t.label}</span>
                        <div className="rep-track"><i style={v(t.w)} /></div>
                        <span className="rep-val">{t.mins.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <span className="reel-chrome">
        <span className="reel-tag">Adaptive learning map</span>
        <span className="reel-bars reel-bars-nav">
          <span><i /></span><span><i /></span><span><i /></span><span><i /></span>
        </span>
      </span>
      <span className="reel-cta">Start the Preview &rsaquo;</span>
    </a>
  )
}
