import {chromium} from 'playwright-core';
import {mkdir,writeFile} from 'node:fs/promises';
import {pageFilms} from '../src/page-films.mjs';
const origin=process.env.PREVIEW_URL||'http://127.0.0.1:4226';
const out=process.env.CAPTURE_DIR||'review/page-film-captures';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--disable-dev-shm-usage']});
const results=[];
try {
 for(const [label,width] of [['desktop',1440],['phone',390]]) {
  const context=await browser.newContext({viewport:{width,height:width<768?1400:1000},reducedMotion:'reduce'});
  const page=await context.newPage();
  for(const [route,film] of Object.entries(pageFilms)) {
   await page.goto(origin+route,{waitUntil:'networkidle'});
   const section=page.locator('[data-page-film]');
   await section.scrollIntoViewIfNeeded();
   await page.locator('.page-film-poster img').evaluate(img=>img.decode());
   const file=`${out}/${film.key}-${label}.jpg`;
   await section.screenshot({path:file,type:'jpeg',quality:85,animations:'disabled'});
   results.push({route,key:film.key,viewport:label,file});
  }
  await context.close();
 }
} finally {await browser.close();}
await writeFile(`${out}/captures.json`,JSON.stringify(results,null,2));
console.log(`Captured ${results.length} bounded film sections`);
