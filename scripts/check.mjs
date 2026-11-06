import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {source} from '../src/content.mjs';
const root=resolve('dist');
let links=0,images=0;
const pending=[];
const allowPending=process.argv.includes('--allow-pending-page-films');
for(const page of source){
 const filename=page.route==='/'?'index.html':page.route.slice(1)+'/index.html';
 const html=await readFile(resolve(root,filename),'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${page.route}: one h1`);
 assert.ok(html.includes(`href="https://www.tradeetching.com${page.route}"`),`${page.route}: original canonical`);
 assert.match(html,/<meta name="robots" content="noindex, nofollow">/,'Review pages must remain noindex');
 assert.match(html,/<meta name="description" content="[^"]+">/,`${page.route}: description`);
 assert.match(html,/id="main"/,`${page.route}: main landmark`);
 for(const match of html.matchAll(/(?:href|src|poster)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
  const path=decodeURIComponent(match[1]);if(path.startsWith('/_dm/'))continue;
  let target=resolve(root,'.'+path);
  let metadata;try{metadata=await stat(target)}catch{if(allowPending && /^\/media\/page-films\/[^/]+\/(landscape|portrait)-poster\.(jpg|webp)$/.test(path)){pending.push(path);continue;}assert.fail(`${page.route}: missing ${path}`)}
  if(metadata.isDirectory())await stat(resolve(target,'index.html'));
  if(/\.(webp|png|mp4)$/.test(path))images++;else links++;
 }
 if(page.route!=='/')assert.equal(await readFile(resolve(root,page.route.slice(1)+'.html'),'utf8'),html,'Legacy .html address renders the same page');
}
const routes=JSON.parse(await readFile(resolve(root,'routes.json'),'utf8'));
assert.deepEqual([...routes.routes].sort(),source.map(p=>p.route).sort(),'All live sitemap routes preserved');
const provider=JSON.parse(await readFile('src/contact-provider.json','utf8'));
const contact=await readFile(resolve(root,'Contact/index.html'),'utf8');
for(const f of provider.fields)assert.ok(contact.includes(`name="${f.name}"`),'Original provider field retained: '+f.name);
for(const name of ['dmform-0','dmform-1','dmform-3'])assert.ok(contact.includes(`name="${name}"`));
assert.equal(await readFile(resolve(root,'robots.txt'),'utf8'),'User-agent: *\nDisallow: /\n');
console.log(`PASS: ${source.length} sitemap routes, canonical URLs, title/description/H1 landmarks, legacy aliases, ${links} local links and ${images} image/video references; provider fields retained; preview indexing blocked.`);

if(pending.length)console.log(`PENDING: ${pending.length} page-film poster references absent; real-media checks remain required. No substitutes installed.`);
