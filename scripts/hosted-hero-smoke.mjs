import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {heroFilms} from '../src/hero-films.mjs';
const origin=process.env.PREVIEW_URL||'http://127.0.0.1:4216';
const out=process.env.HERO_SMOKE_OUTPUT||'review/hosted-hero-films';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--disable-dev-shm-usage']});
const results=[];
try{
 for(const [route,film] of Object.entries(heroFilms)){
  if(process.env.HERO_PAGES&&!process.env.HERO_PAGES.split(',').includes(film.key))continue;
  for(const [label,width,height] of [['desktop',1440,900],['mobile',390,844]]){
   const opts={viewport:{width,height},reducedMotion:'no-preference',...(process.env.HERO_STORAGE_STATE?{storageState:process.env.HERO_STORAGE_STATE}:{})};
   const context=await browser.newContext(opts);const page=await context.newPage();const requests=[];const errors=[];
   page.on('request',r=>{if(r.url().includes('/media/hero-films/')&&/\.(mp4|webm)$/.test(r.url()))requests.push(r.url())});page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>{window.__vitals={lcp:null,cls:0};new PerformanceObserver(l=>{for(const e of l.getEntries())window.__vitals.lcp={ms:e.startTime,url:e.url,element:e.element?.tagName}}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__vitals.cls+=e.value}).observe({type:'layout-shift',buffered:true})});
   const response=await page.goto(origin+route,{waitUntil:'networkidle'});assert.equal(response.status(),200);
   await page.waitForFunction(()=>{const v=document.querySelector('[data-film-video]');return v&&!v.paused&&v.readyState>=2});
   assert.ok(requests.length>0);assert.ok(requests.every(x=>x.includes(`/${width<768?'portrait':'landscape'}-web.${film.webm?'webm':'mp4'}`)));
   assert.equal(await page.locator('video').evaluate(v=>v.muted),true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:`${out}/${film.key}-${label}-opening.png`});
   await page.locator('[data-film-toggle]').focus();await page.keyboard.press('Space');await page.waitForFunction(()=>document.querySelector('video').paused);
   const pausedAt=await page.locator('video').evaluate(v=>v.currentTime);await page.waitForTimeout(200);assert.equal(await page.locator('video').evaluate(v=>v.currentTime),pausedAt);
   assert.equal(await page.locator('video').evaluate(v=>getComputedStyle(v).opacity),'1');
   await page.locator('video').evaluate(v=>new Promise(resolve=>{v.addEventListener('seeked',resolve,{once:true});v.currentTime=6}));
   await page.screenshot({path:`${out}/${film.key}-${label}-mid.png`});
   const vitals=await page.evaluate(()=>({...window.__vitals,transferredBytes:performance.getEntriesByType('resource').reduce((a,r)=>a+r.transferSize,0)}));
   assert.deepEqual(errors,[]);results.push({page:film.key,label,status:response.status(),requests:[...new Set(requests)],vitals,pausedFrameRetained:true,errors});await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',...(process.env.HERO_STORAGE_STATE?{storageState:process.env.HERO_STORAGE_STATE}:{})});const page=await context.newPage();const requests=[];page.on('request',r=>{if(/\.(mp4|webm)$/.test(r.url()))requests.push(r.url())});await page.goto(origin+route,{waitUntil:'networkidle'});assert.equal(await page.locator('video').getAttribute('src'),null);assert.equal(requests.length,0);results.push({page:film.key,reducedMotion:true,videoRequests:0});await context.close();
 }
 await writeFile(`${out}/report.json`,JSON.stringify({origin,checkedAt:new Date().toISOString(),results},null,2));console.log(JSON.stringify({origin,cases:results.length,passed:true}));
}finally{await browser.close()}
