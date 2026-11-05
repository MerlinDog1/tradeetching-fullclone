// No <source>, video src or video poster in HTML: the browser can only fetch
// the selected orientation, and reduced-motion visits do not download a film.
const portrait = matchMedia('(max-width: 767px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
for (const figure of document.querySelectorAll('[data-film]')) {
 const video = figure.querySelector('[data-film-video]');
 const button = figure.querySelector('[data-film-toggle]');
 const poster = figure.querySelector('img');
 let near = false, visible = false, userPaused = false, userRequested = false;
 let generation = 0, pending = false;
 const format = () => portrait.matches ? 'portrait' : 'landscape';
 const eligible = () => !document.hidden && visible && !userPaused && (!reduced.matches || userRequested);
 const update = () => {
  const playing = !video.paused && !video.ended;
  figure.toggleAttribute('data-playing', playing && video.readyState >= 2);
  button.setAttribute('aria-label', playing ? 'Pause hero film' : 'Play hero film');
  button.setAttribute('aria-pressed', String(playing));
  button.querySelector('[data-film-label]').textContent = playing ? 'Pause film' : 'Play film';
  button.querySelector('[data-film-symbol]').textContent = playing ? 'Ⅱ' : '▶';
 };
 const sync = async () => {
  if (!eligible()) { video.pause(); return; }
  if (!video.getAttribute('src') || pending) return;
  pending = true;
  try { await video.play(); } catch { /* Autoplay refusal leaves a working Play button and poster. */ }
  finally { pending = false; if (!eligible()) video.pause(); update(); }
 };
 const load = async () => {
  if (!near || document.hidden || (reduced.matches && !userRequested)) return;
  if (video.getAttribute('src')) { sync(); return; }
  const ticket = ++generation;
  // Give the eager high-priority poster the first render and network slot.
  await poster.decode().catch(() => {});
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  if (ticket !== generation || !near || document.hidden || (reduced.matches && !userRequested)) return;
  video.muted = true;
  video.src = `${figure.dataset.filmBase}/${format()}-web.mp4`;
  video.load();
  sync();
 };
 const reset = () => {
  ++generation;
  video.pause();
  video.removeAttribute('src');
  video.load();
  update();
 };
 button.hidden = false;
 for (const event of ['playing','pause','ended','error','loadeddata']) video.addEventListener(event, update);
 button.addEventListener('click', () => {
  if (!video.paused) { userPaused = true; userRequested = false; video.pause(); }
  else { userPaused = false; userRequested = true; near = true; load(); }
  update();
 });
 new IntersectionObserver(([entry]) => {
  near = entry.isIntersecting;
  if (near) load();
 }, {rootMargin:'160px 0px'}).observe(figure);
 new IntersectionObserver(([entry]) => {
  visible = entry.isIntersecting;
  if (visible) load();
  sync();
 }, {threshold:0}).observe(figure);
 document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else { load(); sync(); } });
 portrait.addEventListener('change', () => { reset(); load(); });
 reduced.addEventListener('change', () => {
  userRequested = false;
  if (reduced.matches) reset(); else load();
 });
}
