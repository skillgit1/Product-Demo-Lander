// Record one full loop of the chrome-free reel as a .webm (run on CI, where a
// real browser is allowed). The GitHub Actions workflow then uses ffmpeg to
// turn the .webm into a GIF and an MP4.
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const URL = 'file://' + join(here, 'clean-reel.html')

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 720, height: 405 }, // the reel's design size (exact proportions)
  deviceScaleFactor: 2,                   // render at 2x for crispness (1440x810)
  recordVideo: { dir: join(here, 'video'), size: { width: 1440, height: 810 } },
})
const page = await context.newPage()
await page.goto(URL, { waitUntil: 'load' })
// Make the reel fill the frame exactly (drop the page's grey margin + rounding).
await page.addStyleTag({
  content:
    'body{margin:0!important;padding:0!important;background:#f6f7f8!important;display:block!important}' +
    '.player{max-width:none!important;width:100vw!important;height:100vh!important;border-radius:0!important;margin:0!important;box-shadow:none!important}',
})
await page.waitForTimeout(700) // let fonts + avatar.gif load
await page.waitForTimeout(20000) // one full loop: 4600 + 4600 + 6200 + 4600
await context.close() // finalizes the .webm
await browser.close()
console.log('Recorded one loop ->', join(here, 'video'))
