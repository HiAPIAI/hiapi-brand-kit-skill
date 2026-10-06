#!/usr/bin/env node
// render-svg.mjs: SVG → PNG with headless Chrome (web fonts in the SVG load first). Transparent background.
//   node scripts/render-svg.mjs logo.svg logo.png [--width=1600]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { flags } from './hiapi.mjs';
const f = flags(), [src, dst] = f._;
if (!src || !dst) { console.error('usage: render-svg.mjs in.svg out.png [--width=1600]'); process.exit(1); }
const svg = readFileSync(src, 'utf8'), vb = (svg.match(/viewBox="([\d.\s-]+)"/) || [])[1]?.trim().split(/\s+/).map(Number) || [0, 0, 1000, 1000];
const w = +(f.width || 1600), h = Math.round(w * vb[3] / vb[2]);
const CHROME = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(p => p && existsSync(p));
if (!CHROME) { console.error('Chrome/Chromium not found: set CHROME_PATH'); process.exit(1); }
const dir = mkdtempSync(join(tmpdir(), 'svg-')), page = join(dir, 'p.html');
writeFileSync(page, `<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${w}px;height:${h}px}</style>${svg}`);
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--default-background-color=00000000', `--window-size=${w},${h}`, '--virtual-time-budget=4000', `--screenshot=${resolve(dst)}`, `file://${page}`], { stdio: 'ignore' });
console.log(`wrote ${dst} (${w}×${h})`);
