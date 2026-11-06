import assert from 'node:assert/strict';
import {mkdir,readFile,stat,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import {pageFilms} from '../src/page-films.mjs';
import {source} from '../src/content.mjs';
import {pageFilmFixtures} from './page-films-fixtures.mjs';
const fixtures=process.argv.includes('--fixtures');
const origin=process.env.PREVIEW_URL||'http://127.0.0.1:4226';
const out=`review/page-films-${fixtures?'fixtures':'real'}`;
await mkdir(out,{recursive:true});
const report={mode:fixtures?'BROWSER FIXTURES ONLY — final media unverified':'real',origin,pages:[],assets:[],extras:[],errors:[]};
assert.deepEqual(Object.keys(pageFilms).sort(),source.map(p=>p.route).sort());
assert.equal(JSON.parse(await readFile('vercel.json','utf8')).git.deploymentEnabled,false);
for(const [route,film] of Object.entries(pageFilms)) {
 const html=await readFile(`dist/${route==='/'?'index.html':route.slice(1)+'/index.html'}`,'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.equal((html.match(/data-page-film /g)||[]).length,1);
 assert.ok(!html.includes('hero-films.js')&&!html.includes('data-hero-video'));
 assert.ok(!/<video[^>]*\s(?:src|autoplay|poster)=?/.test(html),'No eager source, autoplay or duplicate poster');
 assert.match(html,/<video controls muted playsinline preload="none"/);
 assert.ok(html.indexOf('data-page-film ')>html.indexOf('</section>'),'Card follows hero');
 if(film.key!=='architecture')assert.ok(!/Queen Anne|CRUCERO/.test(html),'Queen Anne restricted to architecture');
 else assert.match(html,/Private preview only/);
 if(!fixtures)for(const format of ['landscape','portrait']) {
  for(const extension of ['poster.webp','poster.jpg','web.mp4']) {
   const file=`public/media/page-films/${film.key}/${format}-${extension}`;
   report.assets.push({file,bytes:(await stat(file)).size});
  }
  const file=`public/media/page-films/${film.key}/${format}-web.mp4`;
  const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));
  assert.equal(probe.streams.filter(s=>s.codec_type==='audio').length,0,`${file}: silent`);
  const stream=probe.streams.find(s=>s.codec_type==='video');
  assert.ok(Math.abs(stream.width/stream.height-(format==='portrait'?9/16:16/9))<.01);
  assert.ok(Math.abs(Number(probe.format.duration)-12)<.2,`${file}: 12 seconds`);
 }
}
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--disable-dev-shm-usage']});
const sel='[data-page-film-video]';
async function create(width,reducedMotion='no-preference',javaScriptEnabled=true) {
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion,javaScriptEnabled});
 if(fixtures)await pageFilmFixtures(context);
 const page=await context.newPage();
 page.setDefaultTimeout(10000);
 const requests=[];
 page.on('request',req=>requests.push(req.url()));
 page.on('pageerror',err=>report.errors.push(err.message));
 page.on('response',res=>{if(res.status()>=400)report.errors.push(`${res.status()} ${res.url()}`);});
 page.on('requestfailed',req=>{if(req.failure()?.errorText!=='net::ERR_ABORTED')report.errors.push(req.failure()?.errorText+' '+req.url());});
 await page.addInitScript(()=>new MutationObserver(()=>{if(document.documentElement)document.documentElement.style.scrollBehavior='auto';}).observe(document,{childList:true}));
 return {context,page,requests};
}
async function posterReady(page) {
 await page.locator('.page-film-card').scrollIntoViewIfNeeded();
 await page.locator('.page-film-poster img').evaluate(img=>img.decode());
}
async function play(page) {
 await page.locator('[data-page-film-toggle]').click();
 await page.waitForFunction(()=>{const v=document.querySelector('[data-page-film-video]');return !v.paused&&v.readyState>=2;});
}
try {
 for(const [route,film] of Object.entries(pageFilms))for(const width of [1440,390]) {
  for(const reduced of ['no-preference','reduce']) {
   const {context,page,requests}=await create(width,reduced);
   await page.goto(origin+route,{waitUntil:'networkidle'});
   await posterReady(page);
   assert.ok(requests.every(url=>! /\.(mp4|webm)(?:\?|$)/.test(url)),'No video requests before Play, even after scroll');
   const orientation=width<=767?'portrait':'landscape';
   const posters=requests.filter(url=>url.includes('/page-films/'));
   assert.ok(posters.length>0&&posters.every(url=>url.includes(`/${orientation}-poster`)),'Only selected poster downloaded');
   assert.equal(await page.locator(sel).getAttribute('src'),null);
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   const box=await page.locator('.page-film-stage').boundingBox();
   assert.ok(Math.abs(box.width/box.height-(width<=767?9/16:16/9))<.01);
   if(reduced==='no-preference') {
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    assert.deepEqual(axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],`${route}/${width}: axe`);
    if(['home','architecture','contact'].includes(film.key))await page.screenshot({path:`${out}/${film.key}-${width}-poster.png`});
   }
   const button=page.locator('[data-page-film-toggle]');
   await button.focus();await page.keyboard.press('Enter');
   await page.waitForFunction(()=>{const v=document.querySelector('[data-page-film-video]');return !v.paused&&v.readyState>=2;});
   assert.ok((await page.locator(sel).evaluate(v=>v.currentSrc)).endsWith(`/${orientation}-web.mp4`));
   assert.ok(await page.locator(sel).evaluate(v=>v.controls&&v.muted&&!v.hidden));
   await button.focus();await page.keyboard.press('Space');
   await page.waitForFunction(()=>document.querySelector('[data-page-film-video]').paused);
   await play(page);
   await page.locator('footer').scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>document.querySelector('[data-page-film-video]').paused);
   await posterReady(page);
   await page.waitForTimeout(100);
   assert.ok(await page.locator(sel).evaluate(v=>v.paused),'Returning onscreen does not restart');
   report.pages.push({route,width,reducedMotion:reduced,noAutoload:true,orientation,keyboard:true,nativeControls:true,offscreenPause:true});
   await context.close();
  }
  console.log(`PASS ${film.key} ${width}: poster, no pre-play video, keyboard, native controls, offscreen, reduced motion`);
 }
 const {context,page,requests}=await create(1440);
 await page.goto(origin,{waitUntil:'networkidle'});await play(page);
 await page.setViewportSize({width:390,height:900});await posterReady(page);
 assert.equal(await page.locator(sel).getAttribute('src'),null);
 assert.ok(!requests.some(url=>url.endsWith('portrait-web.mp4')),'Resize cannot initiate new download');
 await play(page);
 assert.ok((await page.locator(sel).evaluate(v=>v.currentSrc)).endsWith('/portrait-web.mp4'));
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForFunction(()=>!document.querySelector('[data-page-film-video]').getAttribute('src'));
 assert.ok(await page.locator(sel).isHidden());
 await play(page);
 // Simulate tab visibility so this lifecycle rule is deterministic in headless Chrome.
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 await page.waitForFunction(()=>document.querySelector('[data-page-film-video]').paused);
 report.extras.push('Resize pauses/unloads without downloading; next Play selects portrait; live reduced-motion unloads; hidden tab pauses');
 await context.close();
 // Browser decoding errors and rejected play promises must recover to the real poster.
 for(const failure of ['decode','rejected-play']) {
  const {context,page}=await create(390);
  if(failure==='decode')await context.route('**/media/page-films/**/*.mp4',route=>route.fulfill({status:200,contentType:'video/mp4',body:'invalid media — deliberate browser test'}));
  else await page.addInitScript(()=>{HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('Denied for test','NotAllowedError'));});
  await page.goto(origin,{waitUntil:'networkidle'});await posterReady(page);
  await page.locator('[data-page-film-toggle]').click();
  await page.waitForFunction(()=>document.querySelector('[data-page-film-status]').textContent.includes('could not be played'));
  assert.ok(await page.locator(sel).isHidden());
  assert.ok(await page.locator('[data-page-film-toggle]').isEnabled());
  assert.equal(await page.locator(sel).getAttribute('src'),null);
  report.extras.push(`${failure}: visible poster, summary and retry`);
  await context.close();
 }
 const noJS=await create(390,'reduce',false);
 await noJS.page.goto(origin,{waitUntil:'networkidle'});await posterReady(noJS.page);
 assert.ok(await noJS.page.locator('[data-page-film-toggle]').isHidden());
 assert.ok(await noJS.page.locator('#page-film-summary').isVisible());
 assert.ok(noJS.requests.every(url=>!url.endsWith('.mp4')));
 report.extras.push('No JavaScript: poster and accessible summary, no dead control or video download');
 await noJS.context.close();
 assert.deepEqual(report.errors,[]);
 console.log(`PASS ${report.pages.length} page/viewport/motion cases; ${report.mode}`);
} catch(error) {
 report.failure=error.stack;throw error;
} finally {
 await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
 await browser.close();
}
