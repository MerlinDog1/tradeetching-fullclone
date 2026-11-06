import {readFile} from 'node:fs/promises';
// Browser-only doubles: existing real TED media is intercepted in memory.
// Never write substitutes to public/ or describe this as final visual proof.
export async function pageFilmFixtures(context) {
 const [poster,film]=await Promise.all([
  readFile('public/media/flat-cut-letters-poster.webp'),
  readFile('public/media/flat-cut-letters.mp4')
 ]);
 await context.route('**/media/page-films/**',route=>{
  const video=route.request().url().endsWith('.mp4');
  return route.fulfill({status:200,contentType:video?'video/mp4':'image/webp',body:video?film:poster});
 });
}
