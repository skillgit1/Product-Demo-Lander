# Skillwell Preview Lander — Rebuild Brief

Everything needed to rebuild, run, and redeploy this project fast. Hand this to a fresh Claude Code chat.

---

## 1. What this is

A single-page, paid-traffic (Google Ads) landing page for **Skillwell** (enterprise adaptive/immersive learning platform). Cold-traffic, conversion-focused, mobile-first. One job: get an L&D leader to opt in to a "2-minute preview."

- **Live at:** `https://preview.tryskillwell.com`
- **Repo (canonical/deploy):** `github.com/skillgit1/Product-Demo-Lander` → local `~/Documents/GitHub/Product-Demo-Lander`
- **Working/preview copy:** `~/skillwell-landing` (this is where the local Vite dev server runs; keep it in sync)
- **Source design kit:** `~/Downloads/skillwell-design-kit` (theme.css + real LearningMap component + assets; "copy, don't redesign")
- **Product demo repo (serves tryskillwell.com apex):** `~/skillwell-interactive-demo` (`github.com/skillgit1/skillwell-interactive-demo`). Do NOT deploy into this unless you specifically want the `/preview` path; we used a subdomain instead.

## 2. Stack

Vite 8 + React 19 + TypeScript + Tailwind v4 (`@tailwindcss/vite`, tokens via `@theme` in `src/theme.css`). No router, no framer-motion, no recharts. `posthog-js` for analytics. Font: **DM Sans** (per the design kit's theme.css; the brand book's Lora/Krub was considered but the kit's DM Sans is what shipped).

## 3. Page structure (`src/App.tsx`)

Header (Skillwell logo) → **Hero** (centered: eyebrow, headline, subhead, the animated `HeroReel`, then the opt-in `BookingCard`) → moving **logo bar** → **benefits** (3 cards, sand band) → **FAQ** (3 Q&A) → **closing CTA** + second `BookingCard` → footer.

### Current live copy
- Eyebrow: `For L&D leaders at Fortune 1000 companies`
- Headline: `Prove your training builds real, on-the-job skills`
- Subhead: `See how Skillwell's AI learning platform makes this easy. Explore the 2-minute preview below.`
- Booking card: "Explore the 2-minute platform preview" / step chips "Fill out the form → Explore the preview" / button "Explore the preview"
- Closing: `See a mini preview of the Skillwell platform` / `Verify competency, close skill gaps, and deploy immersive and adaptive training to your workforce today.`

## 4. The hero reel (`src/components/HeroReel.tsx` + `src/reel.css`)

A looping "product video" in a 16:9 card, scaled with container-query units (`cqw`). Four scenes cycle (durations in `DUR = [4600, 4600, 6200, 4600]` ms; the avatar holds longer). A stories-style progress bar + rotating label + hover "Take the tour ↓" CTA. **Clicking the reel scroll-jumps to the form** (`href="#tour-form"`, `scroll-behavior:smooth`).

1. **Learning map** — the REAL `<LearningMap content={SAMPLE_MAP} showPopover initialTransform={{x:40,y:34,scale:0.46}} />` from the design kit, rendered non-interactive **inside a tilted floating browser-window mockup** (mac dots + `app.skillwell.com/map` URL bar) on a cool studio gradient.
2. **Drop in your content** — same browser mockup; a portrait Mac-style PDF file drops into a dashed zone, then "Got it. Building your learning map."
3. **Immersive simulation** — `public/avatar.gif` (user-cropped ~16:9 GIF that already shows a laptop-in-office) shown on a warm "desk" gradient with a contact shadow (NOT in a browser — it's already a laptop). `object-fit:cover`, no zoom.
4. **Skills report** — a faithful recreation of the product's Auto-Insights report using the real data (leadership skills, first-attempt scores, first-vs-last improvements with +10/+25/−8.3% deltas, time-on-task), inside a browser mockup, **auto-scrolling** the full report (JS measures `scrollHeight - winBody.clientHeight`).

The three software screens get the browser-mockup treatment; the GIF (a laptop shot) sits on a desk. Zoom levels are tuned (map `scale:0.46`, sim frame `width:60%`).

## 5. Assets (`public/`)

`avatar.gif` (sim), `sim-thumbnail.jpg`, `skillwell-logo-horizontal.svg`, `skillwell-logo.png`, `favicon.png`, `team/expert-1..6.jpg`, `logos/{capgemini,merck,amazon,ochsner,microsoft}.png` (trimmed to bounding box + per-logo heights in `LOGO_H` for optical balance; Amazon is the full wordmark, Ochsner sized larger), `CNAME` (= `preview.tryskillwell.com`).

## 6. Form → HubSpot + PostHog (`src/App.tsx`, `src/lib/posthog.ts`, `index.html`)

Both `BookingCard`s share one handler. Fields: **firstname, lastname, email** (single-line; phone removed).

On submit (in order):
1. `optInAndIdentify()` — PostHog `opt_in_capturing()` + `identify(email, {email, first_name, last_name})`.
2. `submitToHubSpot()` — POST to the **unauthenticated Forms API**:
   `https://api.hsforms.com/submissions/v3/integration/submit/2593232/83eab7f8-7224-4895-9bcc-26c94d915c6f`
   payload `fields: [{email},{firstname},{lastname}]`, `context: {pageUri, pageName, hutk (if cookie present)}`.
3. Redirect to `https://www.skillwell.com/take-a-tour`.

- **HubSpot tracking code** in `index.html` before `</body>`: `//js.hs-scripts.com/2593232.js` (sets the `hubspotutk` cookie so submissions carry attribution).
- **PostHog** (`initPostHog()` in `main.tsx`): project `530617`, key `phc_r5XK...`, host `us.i.posthog.com`, autocapture off, pageview off, `identified_only`, **opt_out_capturing_by_default: true** (captures nothing until submit).

## 7. Deployment (GitHub Pages + Cloudflare subdomain)

- Repo must be **Public** (free Pages) with **Settings → Pages → Source = "GitHub Actions."**
- `.github/workflows/deploy.yml`: `npm install --legacy-peer-deps` → `npx vite build --base=./` → upload `./dist` → deploy-pages. Relative base serves fine at the subdomain root.
- `public/CNAME` = `preview.tryskillwell.com` (sets the custom domain in the Pages output).
- **Cloudflare DNS** (tryskillwell.com is on Cloudflare): CNAME record **`preview` → `skillgit1.github.io`**, **Proxy status = DNS only (grey cloud)**. The apex is already DNS-only pointing at GitHub's Pages IPs.
- To update: edit in `~/Documents/GitHub/Product-Demo-Lander`, commit, **push from GitHub Desktop** (the CLI here has no git credentials).

## 8. Hard-won gotchas (read these — they cost hours)

1. **Node is OOM-killed in this sandbox** (exit 137, even `node -v`). You cannot reliably `npm install` or build locally. Rely on CI for builds; run the preview via the existing `~/skillwell-landing` symlinked `node_modules` (a symlink to the demo's `node_modules`).
2. **No committed lockfile + `npm install` fresh = ERESOLVE build failure.** Fix: **pin EXACT dep versions** (no `^`) copied from the demo's `package-lock.json`, and use `npm install --legacy-peer-deps` in CI. Exact versions currently: react/react-dom 19.2.7, vite 8.1.5, @vitejs/plugin-react 6.0.3, tailwindcss + @tailwindcss/vite 4.3.3, typescript 6.0.3, @types/node 24.13.3, @types/react 19.2.17, @types/react-dom 19.2.3, posthog-js 1.404.0, @fontsource-variable/dm-sans 5.3.0.
3. **Cloudflare proxy must be OFF (grey cloud)** for the Pages custom domain, or GitHub can't verify the domain or issue the HTTPS cert.
4. **First deploy 404s "Site not found" until the domain is verified.** If the deploy ran before the DNS check went green, **re-run the deploy** (Actions → Run workflow) so it binds to the verified domain. Test with a cache-buster (`?cb=123`) because GitHub/Fastly caches 404s (`x-cache: HIT`) even in incognito.
5. **A custom domain can live on only one repo.** `tryskillwell.com` (apex) is on the demo repo, so the lander uses the **`preview.` subdomain** on its own repo. `/preview` as a path would require integrating into the demo repo (we chose not to).
6. **HubSpot flags submissions from unregistered domains as spam** ("Unregistered Site Domain", a May 2024 change). Fix (Super Admin): **Settings → Tracking & Analytics → Tracking Code → Advanced Tracking → Additional site domains → add `preview.tryskillwell.com` + `tryskillwell.com`.** Never enable reCAPTCHA on an API-submitted form. Recover flagged leads: Marketing → Forms → form → Spam Submissions → Release (auto-deleted after 90 days).
7. **Two local copies exist** (`~/skillwell-landing` runs the preview; `~/Documents/GitHub/Product-Demo-Lander` deploys). Make app edits in both, or edit the deploy repo and re-sync. The deploy repo is canonical.

## 9. Run / deploy quickref

- **Preview locally:** the `skillwell-landing` preview server (launch.json config, port 5199) — uses the symlinked node_modules.
- **Ship a change:** edit `~/Documents/GitHub/Product-Demo-Lander`, commit, GitHub Desktop → Push origin → Actions builds+deploys → live in ~1–2 min (+ cache).

## 10. Still open / next steps

- **[Admin]** Add the domains as HubSpot Additional site domains (stops spam flagging).
- **[Admin]** Same GA4 + HubSpot tracking on both domains + cross-domain config for unified reporting.
- EU/UK: consent-gate the HubSpot + PostHog scripts before load.
- Optional: `posthog.capture('tour_form_submitted')` for a countable conversion event.
- Confirm the six named customer logos (Capgemini, Merck, Amazon, Ochsner, Microsoft) are approved for public display.
