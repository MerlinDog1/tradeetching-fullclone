// A source is attached only inside the explicit Play action. Scroll, resize,
// visibility and motion preferences can pause/unload, but never start a film.
for (const card of document.querySelectorAll('[data-page-film]')) {
 const video=card.querySelector('[data-page-film-video]');
 const toggle=card.querySelector('[data-page-film-toggle]');
 const status=card.querySelector('[data-page-film-status]');
 const mobile=matchMedia('(max-width: 767px)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const label=video.getAttribute('aria-label').replace(' — silent film','');
 let generation=0;
 const sync=()=>{
  const playing=!video.paused;
  toggle.textContent=playing?'Pause film Ⅱ':'Play film ▶';
  toggle.setAttribute('aria-label',`${playing?'Pause':'Play'} ${label} film`);
 };
 const reset=()=>{
  generation++;
  video.pause();
  video.removeAttribute('src');
  video.load();
  video.hidden=true;
  sync();
 };
 const unavailable=()=>{
  reset();
  status.textContent='The film could not be played. You can try Play again; the summary above is always available.';
 };
 toggle.hidden=false;
 toggle.addEventListener('click',async()=>{
  if(!video.paused){video.pause();return;}
  const attempt=++generation;
  if(!video.getAttribute('src'))video.src=`${card.dataset.filmBase}/${mobile.matches?'portrait':'landscape'}-web.mp4`;
  video.muted=true;
  video.hidden=false;
  status.textContent='Loading film…';
  try {await video.play();}
  catch {if(attempt===generation)unavailable();}
 });
 video.addEventListener('play',sync);
 video.addEventListener('playing',()=>{status.textContent='Playing · Silent film';sync();});
 video.addEventListener('pause',()=>{status.textContent=video.ended?'Film finished. Play to watch again.':'Paused. Play to continue.';sync();});
 video.addEventListener('ended',()=>{status.textContent='Film finished. Play to watch again.';sync();});
 video.addEventListener('error',()=>{if(video.getAttribute('src'))unavailable();});
 mobile.addEventListener('change',()=>{reset();status.textContent='Film resized. Play when you’re ready.';});
 reduced.addEventListener('change',event=>{if(event.matches){reset();status.textContent='Motion reduced. Play only when you choose.';}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.pause();},{threshold:0}).observe(card.querySelector('.page-film-stage'));
}
