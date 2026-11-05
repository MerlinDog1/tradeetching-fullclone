import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,stat,cp} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {chromium} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import {heroFilms} from '../src/hero-films.mjs';
import {source,original,pages,paths} from '../src/content.mjs';

const fixtures=process.argv.includes('--fixtures');
const origin=process.env.PREVIEW_URL || 'http://127.0.0.1:4216';
const mode=fixtures?'fixtures':'final';
const out=resolve(`review/hero-films-${mode}`);
await mkdir(out,{recursive:true});
const report={mode,origin,generatedAt:new Date().toISOString(),assets:[],pages:[],reducedMotion:[],regression:[],extra:[],errors:[]};
const viewports=[[1440,900],[1920,1080],[390,844],[360,800]];

// Recover only small source files into ignored review/ for repeatable, byte-for-byte
// proof that the ten non-film pages still render their original HTML.
const baseline=resolve('review/hero-baseline');
await mkdir(baseline,{recursive:true});
await cp('src',`${baseline}/src`,{recursive:true});
await writeFile(`${baseline}/src/templates.mjs`,execFileSync('git',['show','1a32325:src/templates.mjs']));
const old=await import(pathToFileURL(`${baseline}/src/templates.mjs`));
for(const item of source.filter(p=>!heroFilms[p.route])) {
 const route=item.route;
 const body=route==='/'?old.home():route===paths.gallery?old.galleryPage():route===paths.contact?old.contactPage():old.detailPage(pages.find(p=>p.path===route));
 const expected=old.layout({path:route,body,title:original(route).title,description:original(route).description});
 const actual=await readFile(`dist/${route==='/'?'index.html':route.slice(1)+'/index.html'}`,'utf8');
 assert.equal(actual,expected,`${route}: unrelated HTML changed`);
 report.regression.push(route);
}
assert.equal(JSON.parse(await readFile('vercel.json','utf8')).git.deploymentEnabled,false);
for(const [route,film] of Object.entries(heroFilms)) {
 const html=await readFile(`dist/${route.slice(1)}/index.html`,'utf8');
 assert.match(html,/<video muted playsinline loop preload="none"[^>]*><\/video>/);
 assert.ok(!/<video[^>]*(?:\ssrc|poster)=/.test(html),'No eager video fetch');
 assert.ok(html.includes('fetchpriority="high"'));
 assert.ok(html.includes(film.caption.replaceAll('&','&amp;')));
 for(const format of ['landscape','portrait']) for(const extension of ['web.mp4','poster.webp','poster.jpg',...(film.webm?['web.webm']:[])]) {
  const file=`public/media/hero-films/${film.key}/${format}-${extension}`;
  if(!fixtures) {
   const bytes=(await stat(file)).size;
   assert.ok(bytes>0,`${file}: nonempty`);
   report.assets.push({file,bytes});
  }
 }
}
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--disable-dev-shm-usage']});
async function contextFor(viewport,reducedMotion='no-preference',javaScriptEnabled=true) {
 const context=await browser.newContext({viewport,reducedMotion,javaScriptEnabled});
 if(fixtures) await context.route('**/media/hero-films/**',async route=>{
  // Explicit test doubles, never written to public/ or used as final visual evidence.
  const mp4=/\.(mp4|webm)$/.test(route.request().url());
  await route.fulfill({status:200,contentType:mp4?'video/mp4':'image/webp',body:await readFile(mp4?'public/media/flat-cut-letters.mp4':'public/media/flat-cut-letters-poster.webp')});
 });
 return context;
}
async function instrument(page) {
 const requests=[];
 page.on('request',req=>{if(req.url().includes('/media/hero-films/'))requests.push(req.url());});
 page.on('pageerror',err=>report.errors.push(err.message));
 page.on('response',res=>{if(res.status()>=400)report.errors.push(`${res.status()} ${res.url()}`);});
 await page.addInitScript(()=>{
  window.__filmVitals={lcp:null,posterLcp:null,cls:0};
  new PerformanceObserver(list=>{for(const e of list.getEntries()){const item={ms:e.startTime,url:e.url,element:e.element?.tagName};window.__filmVitals.lcp=item;if(e.url?.includes('-poster'))window.__filmVitals.posterLcp??=item;}}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__filmVitals.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
 });
 return requests;
}
async function posterReady(page) {
 await page.locator('.film-hero-poster img').evaluate(img=>img.decode());
 assert.ok(await page.locator('.film-hero-poster img').evaluate(img=>img.naturalWidth>0));
}
function checkOrientation(requests,format) {
 assert.ok(requests.some(url=>url.includes(`${format}-poster`)),'Selected poster requested');
 assert.ok(requests.every(url=>url.includes(`/${format}-`)),`Other orientation fetched: ${requests.join(', ')}`);
}
try {
 for(const [route,film] of Object.entries(heroFilms)) {
  for(const [width,height] of viewports) {
   const format=width<=767?'portrait':'landscape';
   const context=await contextFor({width,height});
   const page=await context.newPage();
   const requests=await instrument(page);
   await page.goto(origin+route,{waitUntil:'networkidle'});
   // Prevent smooth-scroll compositing from capturing an intermediate viewport.
   await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
   await posterReady(page);
   const video=page.locator('[data-film-video]');
   const button=page.locator('[data-film-toggle]');
   await page.waitForFunction(()=>{const v=document.querySelector('[data-film-video]');return !v.paused&&v.readyState>=2;});
   await page.waitForTimeout(500);
   const metrics=await page.evaluate(()=>({
    ...window.__filmVitals,
    transferredBytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0),
    encodedResourceBytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.encodedBodySize,0),
    navigationBytes:performance.getEntriesByType('navigation')[0].transferSize,
    resources:performance.getEntriesByType('resource').map(r=>({url:r.name,bytes:r.encodedBodySize,startMs:r.startTime,endMs:r.responseEnd})),
    overflow:document.documentElement.scrollWidth>innerWidth,
    poster:document.querySelector('.film-hero-poster img').currentSrc,
    video:document.querySelector('[data-film-video]').currentSrc,
    muted:document.querySelector('[data-film-video]').muted
   }));
   assert.equal(metrics.overflow,false,`${route}/${width}: overflow`);
   assert.equal(metrics.muted,true);
   if(!metrics.posterLcp?.url.includes(`${format}-poster`))report.failureMetrics=metrics;
   assert.ok(metrics.posterLcp?.url.includes(`${format}-poster`),'The decoded poster must paint as an initial LCP candidate: '+JSON.stringify(metrics));
   assert.ok(metrics.posterLcp.ms<=metrics.lcp.ms,'Poster is visible no later than playing video');
   const toggleBox=await button.boundingBox();
   assert.ok(toggleBox.y>=0 && toggleBox.y+toggleBox.height<=height,'Playback control visible in initial viewport');
   assert.ok(metrics.cls<0.01,`${route}/${width}: layout shift ${metrics.cls}`);
   checkOrientation(requests,format);
   assert.ok(requests.some(url=>url.endsWith(`/${format}-web.${film.webm?'webm':'mp4'}`)));
   const copy=await page.locator('.film-hero-copy').boundingBox();
   const media=await page.locator('.film-hero-media').boundingBox();
   if(format==='portrait')assert.ok(copy.y+copy.height<=media.y+1,'Mobile heading + enquiry must precede film');
   assert.ok(Math.abs(media.width/media.height-(format==='portrait'?9/16:16/9))<0.01,'Film reserves correct aspect ratio');
   // Pause through keyboard; the native button must be in the CTA's tab order.
   await page.locator('.film-hero-copy .button').focus();
   await page.keyboard.press('Tab');
   assert.equal(await button.evaluate(b=>b===document.activeElement),true);
   assert.notEqual(await button.evaluate(b=>getComputedStyle(b).outlineStyle),'none');
   await page.keyboard.press('Space');
   await page.waitForFunction(()=>document.querySelector('[data-film-video]').paused);
   assert.equal(await video.evaluate(v=>getComputedStyle(v).opacity),'1','Pause retains the actual frozen video frame');
   await page.waitForFunction(()=>document.querySelector('[data-film-toggle]').getAttribute('aria-label')==='Play hero film');
   assert.equal(await button.getAttribute('aria-pressed'),'false');
   await page.keyboard.press('Enter');
   await page.waitForFunction(()=>!document.querySelector('[data-film-video]').paused);
   await page.waitForFunction(()=>document.querySelector('[data-film-toggle]').getAttribute('aria-label')==='Pause hero film');
   assert.equal(await button.getAttribute('aria-pressed'),'true');
   await page.locator('footer').scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>document.querySelector('[data-film-video]').paused);
   await page.locator('.film-hero-media').scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>!document.querySelector('[data-film-video]').paused);
   // User pause persists across scroll-out / scroll-in.
   await button.click();
   await page.locator('footer').scrollIntoViewIfNeeded();
   await page.locator('.film-hero-media').scrollIntoViewIfNeeded();
   await page.waitForTimeout(200);
   assert.equal(await video.evaluate(v=>v.paused),true);
   // Load below-fold image details only after initial performance measurements.
   await page.evaluate(async()=>{
    document.querySelectorAll('img').forEach(img=>img.loading='eager');
    await Promise.all([...document.images].filter(img=>img.getAttribute('src')).map(img=>img.decode()));
   });
   // Poster-state screenshots are reproducible; full-page and requested viewport.
   await page.evaluate(()=>{document.activeElement?.blur();scrollTo({top:0,behavior:'instant'});});
   await page.waitForFunction(()=>scrollY===0);
   await page.waitForTimeout(150);
   await page.screenshot({path:`${out}/${film.key}-${width}x${height}.png`});
   await page.screenshot({path:`${out}/${film.key}-${width}x${height}-full.png`,fullPage:true});
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`${route}/${width}: axe`);
   report.pages.push({route,width,height,format,metrics,requests,axeViolations:0,keyboard:true,offscreenPause:true});
   console.log(`PASS ${film.key} ${width}x${height}: orientation, poster, keyboard, pause, axe; LCP ${metrics.lcp?.ms.toFixed(0)}ms`);
   await context.close();

   const reducedContext=await contextFor({width,height},'reduce');
   const reducedPage=await reducedContext.newPage();
   const reducedRequests=await instrument(reducedPage);
   await reducedPage.goto(origin+route,{waitUntil:'networkidle'});
   await posterReady(reducedPage);
   await reducedPage.locator('.film-hero-media').scrollIntoViewIfNeeded();
   await reducedPage.waitForTimeout(250);
   assert.ok(reducedRequests.every(url=>!/\.(mp4|webm)$/.test(url)),'Reduced motion must not request video');
   assert.equal(await reducedPage.locator('[data-film-video]').getAttribute('src'),null);
   assert.equal(await reducedPage.locator('[data-film-video]').evaluate(v=>v.paused),true);
   checkOrientation(reducedRequests,format);
   await reducedPage.locator('[data-film-toggle]').focus();
   await reducedPage.keyboard.press('Enter');
   await reducedPage.waitForFunction(()=>!document.querySelector('[data-film-video]').paused);
   report.reducedMotion.push({route,width,height,noAutomaticVideoRequest:true,manualPlay:true});
   await reducedContext.close();
  }
 }
 // Resize: only fetch the newly selected source; enabling reduced motion clears it.
 const context=await contextFor({width:1440,height:900});
 const page=await context.newPage();
 await page.goto(origin+Object.keys(heroFilms)[0],{waitUntil:'networkidle'});
 await page.setViewportSize({width:390,height:844});
 await page.waitForFunction(()=>document.querySelector('[data-film-video]').currentSrc.includes('portrait-web.mp4'));
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForFunction(()=>!document.querySelector('[data-film-video]').getAttribute('src'));
 report.extra.push('Viewport resize changes source; live reduced-motion preference pauses/unloads');
 await context.close();
 // A refused/failed autoplay must keep the poster and user control usable.
 const failedContext=await contextFor({width:1440,height:900});
 const failedPage=await failedContext.newPage();
 await failedPage.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Autoplay blocked','NotAllowedError'));};});
 await failedPage.goto(origin+Object.keys(heroFilms)[0],{waitUntil:'networkidle'});
 await posterReady(failedPage);
 assert.equal(await failedPage.locator('[data-film-video]').evaluate(v=>v.paused),true);
 assert.equal(await failedPage.locator('[data-film]').getAttribute('data-playing'),null);
 assert.equal(await failedPage.locator('[data-film-toggle]').getAttribute('aria-label'),'Play hero film');
 assert.equal(await failedPage.locator('[data-film-toggle]').isVisible(),true);
 report.extra.push('Autoplay refusal leaves immediate poster and visible Play control');
 await failedContext.close();
 const noJS=await contextFor({width:390,height:844},'reduce',false);
 const noJSPage=await noJS.newPage();
 const noJSRequests=[];
 noJSPage.on('request',r=>noJSRequests.push(r.url()));
 await noJSPage.goto(origin+Object.keys(heroFilms)[0],{waitUntil:'networkidle'});
 await posterReady(noJSPage);
 assert.equal(await noJSPage.locator('[data-film-toggle]').isVisible(),false);
 assert.equal(noJSRequests.some(url=>/\.(mp4|webm)$/.test(url)),false);
 assert.equal(await noJSPage.locator('.film-hero-copy .button').getAttribute('href'),'/Contact');
 report.extra.push('No JavaScript: picture and enquiry remain usable; no video request or dead control');
 await noJS.close();
 assert.deepEqual(report.errors,[],'Browser errors or failed HTTP responses');
 console.log(`PASS: ${report.pages.length} film viewports, ${report.reducedMotion.length} reduced-motion cases, ${report.regression.length} untouched pages. ${fixtures?'FIXTURE media only; final film visual/performance verification still required.':'REAL media verified.'}`);
} catch(error) {
 report.failure=error.stack;
 throw error;
} finally {
 await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
 await browser.close();
}
