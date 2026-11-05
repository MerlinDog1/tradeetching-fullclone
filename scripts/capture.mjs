import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--disable-dev-shm-usage']});
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:4210/',{waitUntil:'networkidle'});
 await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
 await page.screenshot({path:`review/screenshots/home-${name}.png`,fullPage:true});
 await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
 await page.screenshot({path:`review/screenshots/home-${name}-first-screen.png`});
 for(const [slug,label] of [['large-format-chemical-etching-for-architecture','architecture'],['Contact','contact'],['etching-gallery','gallery']]){
  await page.goto('http://127.0.0.1:4210/'+slug,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
 await page.screenshot({path:`review/screenshots/${label}-${name}.png`,fullPage:true});
 }
 await page.close();
}
await browser.close();
console.log('8 full-page screenshots + 2 first screens captured');
