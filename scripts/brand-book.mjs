#!/usr/bin/env node
// brand-book.mjs: brand.json + logo files + mockups → one brand-guidelines page (brand-book.html) and a PNG of it.
//   node scripts/brand-book.mjs <brand dir> [--mockups=mockups] [--no-png]
// brand.json: name, tagline, story, audience, personality[], colors[{name,hex,use}], fonts{display,text},
//             logo{mark,primary,stacked} (SVG) and {mark_png,primary_png,stacked_png} (from render-svg.mjs; an SVG used
//             as an <img> cannot load web fonts, so the page shows the PNGs), voice{do[],dont[]}
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { flags } from './hiapi.mjs';

const f = flags(), dir = f._[0];
if (!dir) { console.error('usage: brand-book.mjs <brand dir> [--mockups=mockups] [--no-png]'); process.exit(1); }
const B = JSON.parse(readFileSync(join(dir, 'brand.json'), 'utf8')), mdir = f.mockups || 'mockups';
const M = existsSync(join(dir, mdir, 'manifest.json')) ? JSON.parse(readFileSync(join(dir, mdir, 'manifest.json'), 'utf8')).assets : {};
const shots = Object.entries(M).filter(([, a]) => a.type === 'image').map(([id, a]) => ({ id, src: `${mdir}/${a.file}` }));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const lum = h => { const n = parseInt(h.slice(1), 16); return (.3 * (n >> 16 & 255) + .59 * (n >> 8 & 255) + .11 * (n & 255)) / 255; };
const [bg, ink, accent] = [B.colors.find(c => lum(c.hex) > .8)?.hex || '#fafafa', B.colors.reduce((a, c) => lum(c.hex) < lum(a.hex) ? c : a).hex, B.colors[0].hex];
const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(B.fonts.display)}:wght@400;600&family=${encodeURIComponent(B.fonts.text)}:wght@400;500;700&display=swap`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(B.name)} · Brand guidelines</title><link rel="stylesheet" href="${fontUrl}">
<style>
:root{--bg:${bg};--ink:${ink};--accent:${accent}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:400 17px/1.55 "${B.fonts.text}",system-ui,sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:0 40px}
h1,h2,.display{font-family:"${B.fonts.display}",Georgia,serif;font-weight:600;letter-spacing:-.01em;margin:0}
h2{font-size:40px;margin:0 0 24px}.eyebrow{font-size:13px;letter-spacing:.2em;text-transform:uppercase;opacity:.6;margin:0 0 10px}
section{padding:72px 0;border-top:1px solid color-mix(in srgb,var(--ink) 15%,transparent)}
.hero{padding:80px 0 64px;display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center}
.hero img{width:100%}.tag{font-family:"${B.fonts.display}",serif;font-size:34px;line-height:1.2;margin:28px 0 16px}
.grid{display:grid;gap:20px}.g2{grid-template-columns:1fr 1fr}.g3{grid-template-columns:repeat(3,1fr)}.g5{grid-template-columns:repeat(5,1fr)}
.logo-tile{border-radius:18px;padding:44px;display:flex;align-items:center;justify-content:center;min-height:260px}
.logo-tile img{max-width:100%;max-height:200px}.light{background:#fff}.dark{background:var(--ink)}.accent{background:var(--accent)}
.sw{border-radius:16px;overflow:hidden;border:1px solid color-mix(in srgb,var(--ink) 12%,transparent)}.sw div:first-child{height:140px}
.sw div:last-child{padding:14px 16px;font-size:14px;background:#fff8}.sw b{display:block;font-size:16px}
.type{display:grid;grid-template-columns:1fr 1fr;gap:28px}.type .big{font-size:76px;line-height:1}.pill{display:inline-block;border:1px solid currentColor;border-radius:99px;padding:4px 14px;margin:0 8px 8px 0;font-size:14px}
.mock{border-radius:18px;overflow:hidden;background:#0001}.mock img{width:100%;display:block}.hero .mock img{aspect-ratio:4/3;object-fit:cover}.wall{columns:3;column-gap:20px}.wall .mock{break-inside:avoid;margin-bottom:20px}
ul{margin:0;padding-left:20px}footer{padding:40px 0 60px;font-size:13px;opacity:.6}
.wall{}@media(max-width:820px){.wall{columns:1}.hero,.g2,.g3,.type{grid-template-columns:1fr}.g5{grid-template-columns:repeat(2,1fr)}.wrap{padding:0 18px}}
</style></head><body><div class="wrap">
<header class="hero"><div><p class="eyebrow">Brand guidelines</p><img src="${B.logo.primary_png || B.logo.primary}" alt="${esc(B.name)} logo" style="max-width:560px">
<p class="tag">${esc(B.tagline)}</p><p>${esc(B.story)}</p></div>
${shots[0] ? `<div class="mock"><img src="${shots[0].src}" alt=""></div>` : ''}</header>
<section><p class="eyebrow">01</p><h2>Logo</h2><div class="grid g3">
<div class="logo-tile light"><img src="${B.logo.primary_png || B.logo.primary}" alt=""></div><div class="logo-tile dark"><img src="${B.logo.mark_png || B.logo.mark}" alt=""></div><div class="logo-tile accent" style="background:${bg}"><img src="${B.logo.stacked_png || B.logo.stacked}" alt=""></div></div>
<p style="margin-top:18px">Keep clear space of at least the height of the mark's stem around the logo. Never recolour, stretch, outline or rotate it.</p></section>
<section><p class="eyebrow">02</p><h2>Colour</h2><div class="grid g5">${B.colors.map(c => `<div class="sw"><div style="background:${c.hex}"></div><div><b>${esc(c.name)}</b>${c.hex}<br>${esc(c.use)}</div></div>`).join('')}</div></section>
<section><p class="eyebrow">03</p><h2>Type</h2><div class="type"><div><p class="eyebrow">Display · ${esc(B.fonts.display)}</p><p class="display big">${esc(B.name)}</p></div>
<div><p class="eyebrow">Text · ${esc(B.fonts.text)}</p><p style="font-size:22px">${esc(B.story)}</p></div></div></section>
<section><p class="eyebrow">04</p><h2>Personality & voice</h2><p>${B.personality.map(p => `<span class="pill">${esc(p)}</span>`).join('')}</p>
<div class="grid g2" style="margin-top:20px"><div><b>Do</b><ul>${B.voice.do.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div><b>Don't</b><ul>${B.voice.dont.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div></section>
${shots.length ? `<section><p class="eyebrow">05</p><h2>In the world</h2><div class="wall">${shots.map(s => `<div class="mock"><img src="${s.src}" alt="${esc(s.id)}"></div>`).join('')}</div></section>` : ''}
<footer>${esc(B.name)} brand guidelines · mockups generated through HiAPI</footer></div></body></html>`;
writeFileSync(join(dir, 'brand-book.html'), html);
console.log('wrote', join(dir, 'brand-book.html'));
if (!f['no-png']) {
  const CHROME = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => p && existsSync(p));
  if (!CHROME) { console.log('Chrome not found: skipped the PNG'); process.exit(0); }
  const out = resolve(dir, f.png || 'brand-book.png'), h = 2780 + Math.ceil(shots.length / 3) * 470;
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--window-size=1280,${h}`, '--virtual-time-budget=6000', `--screenshot=${out}`, `file://${resolve(dir, 'brand-book.html')}`], { stdio: 'ignore' });
  console.log('wrote', out);
}
