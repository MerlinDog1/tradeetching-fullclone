// Deliberately opt-in: the other ten page heroes keep their existing HTML/assets.
export const heroFilms = {
 '/flat-cut-metal-letters-brass-stainless-steel': {
  key:'flat-cut', caption:'Material visualisation · Solid brass & stainless steel',
  alt:'Material visualisation of flat-cut metal lettering in brass and stainless steel'
 },
 '/large-format-chemical-etching-for-architecture': {
  key:'architecture', caption:'A Cunard Journey · Queen Anne · Photo © Tobias Lange-Rüb / CRUCERO',
  alt:'Etched and patinated brass panels in the Grand Lobby of Cunard’s Queen Anne'
 },
 '/metal-patination': {
  key:'patination', webm:true, caption:'Genuine finish photography · Light study',
  alt:'Genuine metal patina finish photography, explored through a light study'
 }
};
export function filmHero(page, {e,kicker,link,facts}) {
 const film=heroFilms[page.path];
 const base=`/media/hero-films/${film.key}`;
 return `<section class="film-hero" aria-labelledby="film-heading">
 <div class="wrap"><div class="breadcrumbs"><a href="/">Home</a><span aria-hidden="true">/</span><span>${e(page.eyebrow.split(' / ')[0])}</span></div></div>
 <div class="film-hero-stage">
 <div class="film-hero-copy"><div>${kicker(e(page.eyebrow))}<h1 id="film-heading">${e(page.title)}</h1><p class="film-hero-intro">${e(page.intro)}</p>${link('/Contact','Discuss your project')}</div></div>
 <figure class="film-hero-media" data-film="${film.key}" data-film-base="${base}" data-film-webm="${film.webm?'true':'false'}">
 <picture class="film-hero-poster">
 <source media="(max-width: 767px)" type="image/webp" srcset="${base}/portrait-poster.webp" width="1080" height="1920">
 <source media="(max-width: 767px)" srcset="${base}/portrait-poster.jpg" width="1080" height="1920">
 <source type="image/webp" srcset="${base}/landscape-poster.webp" width="1920" height="1080">
 <img src="${base}/landscape-poster.jpg" width="1920" height="1080" alt="${e(film.alt)}" loading="eager" fetchpriority="high" decoding="async">
 </picture>
 <video muted playsinline loop preload="none" aria-hidden="true" tabindex="-1" disablepictureinpicture data-film-video></video>
 <button type="button" class="film-toggle" data-film-toggle aria-label="Play hero film" aria-pressed="false" hidden><span data-film-symbol aria-hidden="true">▶</span><span data-film-label>Play film</span></button>
 </figure>
 </div>
 <div class="wrap film-hero-meta"><p>${e(film.caption)}</p><span aria-hidden="true">Material / Detail / Finish</span></div>
 <div class="wrap">${page.facts?facts(page.facts):''}</div></section>`;
}
