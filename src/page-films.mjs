// One self-contained, silent film per existing route. Text summaries remain
// available without playback, JavaScript or motion. The page retains its H1.
export const pageFilms = {
 '/': {key:'home', label:'Made for the trade', summary:'Trade Etching Direct brings etching, cutting and metal finishing together for sign makers, architects and designers.'},
 '/flat-cut-metal-letters-brass-stainless-steel': {key:'flat-cut', label:'Letters with substance', summary:'Flat-cut lettering in solid brass and stainless steel, with finishes for architectural signs and wayfinding.'},
 '/large-format-chemical-etching-for-architecture': {key:'architecture', label:'Detail on an architectural scale', summary:'Etched and patinated brass panels for Ian Kirkpatrick’s “A Cunard Journey” in the Grand Lobby of Cunard’s Queen Anne.', credit:'© Tobias Lange-Rüb / CRUCERO'},
 '/metal-patination': {key:'patination', label:'Colour. Character. Patina.', summary:'Metal patination adds colour and surface character, combined with etched detail and lettering.'},
 '/etched-metal-signs-nameplates': {key:'signs', label:'A lasting impression', summary:'Etched metal signs, plaques and nameplates, with detailed lettering and carefully finished surfaces.'},
 '/chemical-milling': {key:'milling', label:'Precision through metal', summary:'Photo chemical milling produces intricate thin-metal components by selectively etching through the sheet.'},
 '/etching-gallery': {key:'gallery', label:'A closer look at the work', summary:'A selection of TED’s signs, decorative metalwork and industrial plates, showing etching, cutting and finishing.'},
 '/metal-etching-concepts': {key:'concepts', label:'Ideas made in metal', summary:'Explore combinations of laser cutting, reverse etching, patination and colour in metalwork concepts.'},
 '/chemical-etching-services': {key:'etching', label:'Your artwork. Etched in metal.', summary:'Chemical etching brings permanent lettering, patterns and fine detail to metal signs and surfaces.'},
 '/new-page-2': {key:'middle-east', label:'Architectural ideas, made in metal', summary:'Chemical etching and metal finishing for architectural projects in the Middle East, from custom patterns to detailed surfaces.'},
 '/etched-industrial-labels-control-panels': {key:'industrial', label:'Information that lasts', summary:'Etched industrial labels, identification plates and control panels make essential information clear and durable.'},
 '/signage-for-theme-parks-film-tv-props': {key:'themed', label:'Metalwork with a story', summary:'Specialist signage, props and aged metal finishes for themed environments, film and television.'},
 '/Contact': {key:'contact', label:'Let’s make your next project', summary:'Discuss your metalwork with TED. Send your artwork, material, dimensions, quantity and deadline to request a trade quote.'}
};
export function pageFilm(path, e) {
 const film=pageFilms[path];
 if(!film) return '';
 const base=`/media/page-films/${film.key}`;
 return `<section class="page-film section" aria-labelledby="page-film-heading" data-page-film data-film-base="${base}">
 <div class="wrap page-film-grid"><div class="page-film-copy"><p class="eyebrow">The short film / 12 seconds / Silent</p><h2 id="page-film-heading">${e(film.label)}</h2><p id="page-film-summary">${e(film.summary)}</p>${film.credit?`<p class="page-film-credit">${e(film.credit)}</p><p class="page-film-clearance">Private preview only. Queen Anne photography requires clearance before public use.</p>`:''}</div>
 <figure class="page-film-card"><div class="page-film-stage">
 <picture class="page-film-poster"><source media="(max-width: 767px)" type="image/webp" srcset="${base}/portrait-poster.webp" width="1080" height="1920"><source media="(max-width: 767px)" srcset="${base}/portrait-poster.jpg" width="1080" height="1920"><source type="image/webp" srcset="${base}/landscape-poster.webp" width="1920" height="1080"><img src="${base}/landscape-poster.jpg" width="1920" height="1080" alt="${e(film.label)} — film still" loading="lazy" decoding="async"></picture>
 <video controls muted playsinline preload="none" aria-label="${e(film.label)} — silent film" aria-describedby="page-film-summary" data-page-film-video hidden></video></div>
 <figcaption><button type="button" class="page-film-toggle" data-page-film-toggle aria-label="Play ${e(film.label)} film" hidden>Play film <span aria-hidden="true">▶</span></button><p class="page-film-status" role="status" data-page-film-status>Play when you’re ready. No sound.</p><noscript><p>Enable JavaScript to play the film. Its summary is above.</p></noscript></figcaption></figure></div></section>`;
}
