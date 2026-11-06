import {chromium} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {source} from '../src/content.mjs';
import {pageFilmFixtures} from './page-films-fixtures.mjs';
const fixtures=process.env.PAGE_FILM_FIXTURES==='1';
const origin=process.env.PREVIEW_URL || 'http://127.0.0.1:4210';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--disable-dev-shm-usage']});
const report={mediaMode:fixtures?'BROWSER FIXTURES ONLY':'real',pages:[],interactions:[],errors:[],failedRequests:[],cancelledRequests:[],axeViolations:[]};
try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  if(fixtures)await pageFilmFixtures(context);
  const page=await context.newPage();
  page.on('pageerror',err=>report.errors.push({viewport:name,error:err.message}));
  page.on('requestfailed',req=>{
    const failure={url:req.url(),error:req.failure()?.errorText};
    // A navigation or a quick lightbox change can cancel an obsolete request.
    // All page images and opened lightbox images are independently decoded, and
    // video playback is asserted below. Genuine network errors still fail.
    if(failure.error==='net::ERR_ABORTED')report.cancelledRequests.push({...failure,resourceType:req.resourceType()});
    else report.failedRequests.push(failure);
  });
  for(const entry of source){
   const response=await page.goto(origin+entry.route,{waitUntil:'networkidle'});
   assert.equal(response.status(),200,entry.route);
   await page.evaluate(async()=>{
    document.querySelectorAll('img').forEach(img=>img.loading='eager');
    await Promise.all([...document.images].filter(img=>img.getAttribute('src')).map(img=>img.decode().catch(()=>{})));
   });
   const dimensions=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(dimensions.scroll<=dimensions.width,`${entry.route} ${name}: horizontal overflow ${JSON.stringify(dimensions)}`);
   const broken=await page.locator('img[src]').evaluateAll(images=>images.filter(img=>!img.complete||!img.naturalWidth).map(img=>img.src));
   assert.deepEqual(broken,[],`${entry.route}: images load`);
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),`https://www.tradeetching.com${entry.route}`);
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   if(axe.violations.length)report.axeViolations.push({page:entry.route,viewport:name,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
   report.pages.push({path:entry.route,viewport:name,status:response.status(),images:await page.locator('img[src]').count(),horizontalOverflow:false,axeViolations:axe.violations.length});
   console.log(`${name} ${entry.route}: OK / axe ${axe.violations.length}`);
  }
  await page.goto(origin,{waitUntil:'networkidle'});
  // Video respects reduced motion, but remains user-operable.
  assert.ok(await page.locator('[data-page-film-video]').evaluate(v=>v.paused));
  await page.locator('[data-page-film-toggle]').click();
  await page.waitForFunction(()=>!document.querySelector('[data-page-film-video]').paused);
  await page.locator('[data-page-film-toggle]').click();
  assert.ok(await page.locator('[data-page-film-video]').evaluate(v=>v.paused));
  report.interactions.push(`${name}: reduced-motion poster + manual video play/pause`);
  if(name==='mobile'){
   await page.getByRole('button',{name:'Menu',exact:true}).click();
   assert.equal(await page.getByRole('button',{name:'Menu',exact:true}).getAttribute('aria-expanded'),'true');
   await page.locator('#mobile-nav summary').click();
   await page.locator('#mobile-nav a[href="/chemical-milling"]').click();
   await page.waitForURL('**/chemical-milling');
   assert.equal(await page.getByRole('button',{name:'Menu',exact:true}).getAttribute('aria-expanded'),'false');
   await page.getByRole('button',{name:'Menu',exact:true}).click();
   await page.keyboard.press('Escape');
   assert.ok(await page.locator('#mobile-nav').isHidden());
   report.interactions.push('Mobile: menu expansion, service navigation, Escape close');
  } else {
   await page.locator('.services-menu summary').click();
   await page.locator('.services-dropdown a[href="/chemical-milling"]').click();
   await page.waitForURL('**/chemical-milling');
   report.interactions.push('Desktop: services dropdown + link navigation');
  }
  await page.goto(origin+'/#faq',{waitUntil:'networkidle'});
  const question=page.locator('.faq-list summary').first();
  await question.click();
  assert.ok(await page.locator('.faq-list details').first().evaluate(el=>el.open));
  assert.ok(await page.locator('.faq-list details').first().locator('p').isVisible());
  await question.focus();await page.keyboard.press('Enter');
  assert.ok(await page.locator('.faq-list details').first().evaluate(el=>!el.open));
  report.interactions.push(`${name}: FAQ pointer + keyboard operation`);
  await page.goto(origin+'/etching-gallery',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.gallery-item:visible').count(),18);
  await page.getByRole('button',{name:'Industrial',exact:true}).click();
  assert.equal(await page.locator('.gallery-item:visible').count(),6);
  assert.match(await page.locator('[data-gallery-count]').innerText(),/6 of 6/);
  await page.getByRole('button',{name:'All work',exact:true}).click();
  await page.getByRole('button',{name:'Show more work'}).click();
  assert.equal(await page.locator('.gallery-item:visible').count(),36);
  report.interactions.push(`${name}: gallery category filtering, counts and show-more focus`);
  const first=page.locator('[data-gallery-image]').first();
  await first.click();
  assert.ok(await page.locator('.lightbox').isVisible());
  await page.locator('.lightbox-image img').evaluate(img=>img.decode());
  const before=await page.locator('.lightbox-image img').getAttribute('src');
  await page.keyboard.press('ArrowRight');
  await page.locator('.lightbox-image img').evaluate(img=>img.decode());
  assert.notEqual(await page.locator('.lightbox-image img').getAttribute('src'),before);
  await page.keyboard.press('ArrowLeft');
  await page.locator('.lightbox-image img').evaluate(img=>img.decode());
  assert.equal(await page.locator('.lightbox-image img').getAttribute('src'),before);
  await page.keyboard.press('Escape');
  assert.ok(await page.locator('.lightbox').isHidden());
  assert.ok(await first.evaluate(el=>el===document.activeElement));
  report.interactions.push(`${name}: gallery open, next/previous, Escape, focus restoration`);
  await page.goto(origin+'/Contact',{waitUntil:'networkidle'});
  let postAttempts=0;
  page.on('request',req=>{if(req.method()==='POST')postAttempts++});
  await page.getByRole('button',{name:'Send enquiry'}).click();
  assert.ok(await page.locator('#enquiry-name').evaluate(el=>!el.validity.valid));
  await page.locator('#enquiry-name').fill('Preview check');
  await page.locator('#enquiry-email').fill('not-an-email');
  await page.getByRole('button',{name:'Send enquiry'}).click();
  assert.ok(await page.locator('#enquiry-email').evaluate(el=>!el.validity.valid));
  await page.locator('#enquiry-email').fill('preview@example.invalid');
  await page.locator('#enquiry-message').fill('Local review only — no message should be sent.');
  await page.getByRole('button',{name:'Send enquiry'}).click();
  assert.match(await page.locator('.form-status').innerText(),/has not been sent/);
  assert.equal(postAttempts,0,'Preview must never send a real message');
  report.interactions.push(`${name}: form required/email validation, clear preview response, zero POSTs`);
  await context.close();
 }
 const boundaryContext=await browser.newContext({reducedMotion:'reduce'});
 if(fixtures)await pageFilmFixtures(boundaryContext);
 const page=await boundaryContext.newPage();
 for(const width of [320,360,650,768,1024,1920]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/Contact','/chemical-milling','/new-page-2']){
   await page.goto(origin+route,{waitUntil:'networkidle'});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} overflow at ${width}px`);
  }
  report.interactions.push(`Responsive boundary checks: ${width}px`);
 }
 await page.goto(origin+'/definitely-missing');
 assert.match(await page.locator('h1').innerText(),/Not at this address/);
 report.interactions.push('Real 404 page');
 assert.deepEqual(report.errors,[],'No JS exceptions');
 assert.deepEqual(report.failedRequests,[],'No failed requests');
 assert.equal(report.axeViolations.length,0,'No WCAG A/AA axe violations — details in review/browser-report.json');
 console.log('PASS',JSON.stringify({pages:report.pages.length,interactions:report.interactions.length,errors:report.errors.length,axeViolations:report.axeViolations.length}));
}finally{
 await writeFile('review/browser-report.json',JSON.stringify(report,null,2));
 await browser.close();
}
