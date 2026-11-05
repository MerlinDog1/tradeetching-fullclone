import {rm,mkdir,writeFile,cp} from 'node:fs/promises';
import {original,source,pages,paths} from '../src/content.mjs';
import {layout,home,detailPage,galleryPage,contactPage,notFound} from '../src/templates.mjs';
const preview = !process.argv.includes('--production');
const out = new URL('../dist/', import.meta.url);
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
await cp(new URL('../public/',import.meta.url),out,{recursive:true});
const entries = [
 {path:'/',body:home()},
 ...pages.map(page=>({path:page.path,body:detailPage(page)})),
 {path:paths.gallery,body:galleryPage()},
 {path:paths.contact,body:contactPage()}
];
for (const page of entries) {
 const meta=original(page.path);
 const content=layout({...page,title:meta.title,description:meta.description,preview});
 if(page.path==='/'){await writeFile(new URL('index.html',out),content);}
 else{
  const path=page.path.slice(1);
  await mkdir(new URL(path+'/',out),{recursive:true});
  await writeFile(new URL(path+'/index.html',out),content);
  await writeFile(new URL(path+'.html',out),content);
 }
}
// Preserve the previously mirrored addresses without introducing duplicate SEO pages.
const aliases={'page-1':'/','page-2':'/','index':'/','metal-patinationb8754569':paths.patina};
for(const [alias,path] of Object.entries(aliases)){
 const body=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Trade Etching Direct</title><meta name="robots" content="noindex"><link rel="canonical" href="https://www.tradeetching.com${path}"><meta http-equiv="refresh" content="0;url=${path}"></head><body><p>This page is now at <a href="${path}">Trade Etching Direct</a>.</p></body></html>`;
 await mkdir(new URL(alias+'/',out),{recursive:true});
 await writeFile(new URL(alias+'/index.html',out),body);
 if(alias!=='index')await writeFile(new URL(alias+'.html',out),body);
}
await writeFile(new URL('404.html',out),layout({path:'/404',title:'Page not found | Trade Etching Direct',description:'Explore Trade Etching Direct’s chemical etching and metal finishing services.',body:notFound(),preview:true}));
await writeFile(new URL('robots.txt',out),preview?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nSitemap: https://www.tradeetching.com/sitemap.xml\n');
await writeFile(new URL('sitemap.xml',out),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${source.map(p=>`<url><loc>https://www.tradeetching.com${p.route==='/'?'':p.route}</loc></url>`).join('')}</urlset>`);
await writeFile(new URL('routes.json',out),JSON.stringify({mode:preview?'review-preview':'production',routes:entries.map(p=>p.path),aliases},null,2));
console.log(`Built ${entries.length} pages, extensionless routes and legacy .html aliases (${preview?'NOINDEX / ENQUIRIES DISABLED':'production — original provider required'}).`);
