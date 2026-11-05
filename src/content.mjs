import { readFileSync } from 'node:fs';
export const source = JSON.parse(readFileSync(new URL('./source-content.json', import.meta.url), 'utf8'));
export const original = (route) => source.find(page => page.route === route);
export const photos = (route) => original(route).images;
export const photo = (route, index = 0, alt) => ({ ...photos(route)[index], ...(alt ? { alt } : {}) });
export const filmPhoto = (name, alt) => ({src:`/media/${name}-960.webp`, small:`/media/${name}-480.webp`, large:`/media/${name}-1600.webp`, width:1200, height:900, alt});
export const paths = {
  etching:'/chemical-etching-services', milling:'/chemical-milling', patina:'/metal-patination', architecture:'/large-format-chemical-etching-for-architecture', letters:'/flat-cut-metal-letters-brass-stainless-steel', signs:'/etched-metal-signs-nameplates', industrial:'/etched-industrial-labels-control-panels', concepts:'/metal-etching-concepts', film:'/signage-for-theme-parks-film-tv-props', gallery:'/etching-gallery', contact:'/Contact'
};
export const materials = ['Stainless steel','Brass','Bronze','Copper','Nickel','Zinc','Aluminium','Mild steel','Rimex Metals® incl. T22™'];
export const applications = ['Hotel & office signage','Wayfinding signage','Industrial nameplates & labels','Identification products','Architectural panels','Plaques & memorials','Interpretation boards','Corporate awards','Safety & compliance signs','Promotional items','Thin metal components'];
export const faqs = [
  ['Who are Trade Etching Direct?', 'We are a chemical etching company based in Corby, UK, offering a dedicated trade-only service to the UK sign industry. Founded in 2012, we operate from a 4,000 sq. ft facility with capacity for orders running to many thousands of pieces.'],
  ['What can you make?', 'Hotel and office signage, wayfinding signs, industrial nameplates and labels, architectural panels, plaques, memorials, interpretation boards, corporate awards, safety signs, promotional items and thin metal components.'],
  ['Which metals can you etch?', 'Stainless steel, brass, bronze, copper, nickel, zinc, aluminium, mild steel and Rimex Metals® including the T22™ range. Other materials are available on request.'],
  ['What size panels can you process?', 'Our in-house etching facilities can process panels up to 4m × 2m. Send us your material, dimensions and artwork to discuss the requirements of your project.'],
  ['What other processes do you offer?', 'In-house services include patination, photo chemical milling, laser cutting, CNC routing, colour infilling and direct-to-metal UV printing.'],
  ['Can you help with an urgent job?', 'We offer express turnaround services, including same-day and next-day delivery. Contact the team to check availability for your job.']
];
export const services = [
 {title:'Chemical etching',path:paths.etching,number:'01',text:'Permanent detail in metal. Signs, plaques and nameplates.',image:filmPhoto('product-brass-plaque','Detail of etched and patinated brass signage')},
 {title:'Flat cut letters',path:paths.letters,number:'02',text:'Laser-cut solid brass and stainless steel lettering.',image:photo(paths.letters,6,'Flat cut metal room numbers')},
 {title:'Metal patination',path:paths.patina,number:'03',text:'In-house patina finishes for signage and architectural metal.',image:photo(paths.patina,9,'A selection of metal patina finishes')},
 {title:'Architectural metal',path:paths.architecture,number:'04',text:'Custom-etched patterns and finishes on a larger scale.',image:photo(paths.architecture,1,'Etched brass panels in the Grand Lobby of Cunard’s Queen Anne')},
 {title:'Industrial nameplates',path:paths.industrial,number:'05',text:'Etched labels, tags and precision-cut control panels.',image:photo(paths.industrial,0,'Etched industrial identification plates')},
 {title:'Chemical milling',path:paths.milling,number:'06',text:'Burr-free thin metal components and rapid prototypes.',image:photo(paths.milling,0,'A selection of chemically milled metal components')}
];
export const pages = [
 {
  path:paths.etching, title:'Chemical etching.', eyebrow:'Our services / 01',
  intro:'Etched signs, nameplates and components. Made in-house, for the trade.',
  image:filmPhoto('opening-patina-letter','Deep-etched lettering in patinated brass'), facts:[['4m × 2m','Maximum panel size'],['4,000 sq. ft','Etching facility'],['Trade only','Dedicated service']],
  sections:[
   {title:'Chemical etching facilities',text:['Our 4,000 sq. ft etching facility has the capacity to handle orders running to many thousands of pieces, as well as large panels up to 4m × 2m.','Advanced photo-etching techniques reproduce exceptionally detailed artwork, with high-quality infilling and a choice of finishes. Fast turnaround services are available.'],list:['High-volume production','In-house research & development','Wide range of materials','High-quality colour infilling']},
   {title:'What is chemical etching?',text:['The metal is cleaned and laminated with a UV-sensitive photoresist. A photographic tool transfers your artwork onto the resist, which is developed to expose the areas to be etched.','A high-pressure, temperature-regulated chemical spray dissolves the exposed metal atom by atom. The resist is then stripped away, leaving a smooth, burr-free etched surface ready for finishing.','There is no heat distortion associated with laser processing and no tool wear as with mechanical engraving. The material’s grain structure is unaffected.']},
   {title:'Materials',text:['We chemically etch most metals in-house. Other materials are available on request.'],list:materials},
   {title:'Applications',list:applications},
   {title:'Supporting processes',text:['Chemical milling produces complex thin metal components by etching both sides of the sheet simultaneously, with low tooling costs and burr-free, stress-free results.','Our patination service offers finishes from flamed copper to antiqued brass. CNC routing produces custom-shaped plaques and awards.','UV printing can be applied directly to virtually any surface. We also combine full-colour UV printing with chemical etching.']}
  ], gallery:[photo(paths.signs,7),photo(paths.signs,8)],related:['milling','patina','signs']
 },
 {
  path:paths.milling,title:'Photo chemical milling.',eyebrow:'Our services / 02',intro:'Precision thin metal components. From rapid prototypes to short and medium production runs.',image:photo(paths.milling,0),facts:[['0.012–1.5mm','Material thickness'],['Burr-free','Stress-free components'],['Low tooling costs','Flexible production']],
  sections:[
   {title:'Thin metal. Fine detail.',text:['We offer manufacturers a chemical milling service with an emphasis on fast turnarounds and short to medium production runs. Chemically milled elements can also be incorporated into signage projects.'],list:['Research & development / proof of concept','Rapid prototyping','Short to medium production runs','Wide variety of metals']},
   {title:'Advantages of chemical milling',text:['Chemical milling suits complex designs and produces burr-free components without changing the material’s properties through heat or stress.'],list:['Low tooling costs','Easy to accommodate design changes','Burr-free, stress-free components','Metal properties unaltered','Fast turnaround times']},
   {title:'Applications',text:['Chemical milling is used for thin metal components in electronics, automotive and medical industries.'],list:['Filters, shims & washers','EMI/RFI shielding','SMT stencils','Model kits','Speaker grilles']},
   {title:'Materials suitable for milling',specs:[['Stainless steels','301, 302, 304, 316, S526, S527, 430, 321, 410, 420, 17/7, 309, 310, duplex and super duplex steels'],['Other steels','Mild, carbon, tool and spring steels'],['Nickel alloys','Mu Metal, nickel copper (70/30), Inconel, nickel brazing foil'],['Nickel / iron alloys','Invar, Alloy 42, Kovar, Radio Metal'],['Copper','Tough Pitch 101; oxygen-free, high-conductivity copper'],['Copper alloys','Brass, phosphor bronze, beryllium copper, nickel silver'],['Aluminium','Aluminium and aluminium alloys — all grades'],['Other materials','Molybdenum; polyimide metallised film']]}
  ], gallery:photos(paths.milling),related:['etching','signs','patina']
 },
 {
  path:paths.patina,title:'Metal patination.',eyebrow:'Our services / 03',intro:'An in-house patina service for signs, architectural metal and bespoke projects.',image:photo(paths.patina,9),facts:[['In-house','Patination & finishing'],['Combined processes','Etching & patina'],['Made to your brief','A range of finishes']],
  sections:[
   {title:'Finishes with character.',text:['We combine our experience in chemical etching and metal patination to produce a wide range of finishes, from flamed copper to antiqued brass.','Our patina work includes signs and plaques, memorials, cladding, splashbacks, architectural projects, railings, restoration, interiors and film or TV props.']},
   {title:'Metals we work with',list:['Brass','Bronze','Copper','Zinc','Aluminium','Stainless steel','Corten steel']},
   {title:'Etching and finishing, together.',text:['A patina can be combined with etched textures, lettering, photographic detail and colour infill. The examples below show the range of work produced in-house.'],image:filmPhoto('opening-patina-letter','Etched brass lettering with a mottled patina')}
  ],gallery:photos(paths.patina).slice(1),related:['etching','architecture','concepts']
 },
 {
  path:paths.architecture,title:'Chemical etching for architecture.',eyebrow:'Architectural metal',intro:'Custom patterns, etched detail and patina finishes for architectural metal surfaces.',image:photo(paths.architecture,1),imageCredit:'Photo © Tobias Lange-Rüb / CRUCERO',facts:[['2500 × 1250mm','Architectural sheet size'],['Custom artwork','Patterns, logos & images'],['In-house','Etching, patination & cutting']],
  sections:[
   {title:'Your design, in metal.',text:['From vector artwork, we can etch shapes, patterns, logos and images into metal sheets up to 2500 × 1250mm. We combine chemical etching and patination to produce custom architectural surfaces.','Materials include brass, bronze, Rimex Metals®, stainless and mirrored steel, Corten, aluminium and copper. In-house CNC routing, laser cutting and digital printing support the finished project.'],image:photo(paths.architecture,0)},
   {title:'A Cunard Journey',kicker:'Project / Queen Anne',text:['We etched and patinated the 97 brass panels in Canadian artist Ian Kirkpatrick’s “A Cunard Journey”, in the Grand Lobby of Cunard’s Queen Anne.','The Art Deco mural celebrates the golden age of liner travel. Covering an area of 391 sq. m, the etched panels were bent and assembled into a lenticular installation, revealing three different artworks as guests move through the space.','Changing light brings out different qualities in the brass throughout the day.'],image:photo(paths.architecture,2),credit:'All Queen Anne photos © Tobias Lange-Rüb / CRUCERO',facts:[['97','Etched & patinated brass panels'],['Ian Kirkpatrick','Artist']]}
  ],gallery:photos(paths.architecture),related:['patina','letters','concepts']
 },
 {
  path:paths.letters,title:'Flat cut metal letters.',eyebrow:'Architectural signage',intro:'Precision laser-cut lettering in solid brass and stainless steel, for interior and exterior signage.',image:photo(paths.letters,6,'Flat cut stainless steel room numbers'),facts:[['Solid metal','Brass & stainless steel'],['304 / 316','Stainless steel grades'],['In-house','Cutting, etching & patination']],
  sections:[
   {title:'Solid brass lettering',text:['Brass lettering is available in polished, brushed and patinated finishes. Our in-house patination process produces aged, oxidised and oil-rubbed effects for heritage and contemporary projects.'],specs:[['Polished brass','A mirror-like, light-reflective finish'],['Brushed / satin brass','A fine, unidirectional grain with a softer sheen'],['Antique & patinated brass','Aged and oxidised finishes, produced in-house']],image:photo(paths.letters,0,'Polished brass flat cut lettering')},
   {title:'Stainless steel lettering',text:['Choose polished stainless steel for a bright mirror finish, or brushed stainless for a subtle satin surface.','We use 304 grade stainless steel as standard. For coastal locations and more demanding exterior environments, we recommend and supply 316 marine grade stainless steel.'],image:photo(paths.letters,2,'Flat cut stainless steel architectural lettering')},
   {title:'Surface etching & bespoke detail',text:['We can chemically etch patterns and decorative motifs into the face of laser-cut letters, combining lettering with custom surface detail.','Architectural signage can also incorporate tactile elements and Braille, including room-number signs. Contact us to discuss the detail and requirements of your project.'],image:photo(paths.letters,3,'Architectural room number with tactile details')}
  ],gallery:photos(paths.letters),related:['patina','architecture','signs']
 },
 {
  path:paths.signs,title:'Etched metal signs & nameplates.',eyebrow:'Trade signage',intro:'Signs, plaques and nameplates. Etched, finished and supplied to the trade.',image:filmPhoto('product-brass-plaque','Patinated brass sign with etched lettering'),facts:[['Since 2012','Serving the UK sign industry'],['Indoor & outdoor','Etched metal signage'],['Trade only','Confidential service']],
  sections:[
   {title:'Your trade etching partner.',text:['Trade Etching Direct is a dedicated trade supplier of chemically etched signs and nameplates. We work with sign companies, architects and designers from our 4,000 sq. ft facility in Corby.','We handle one-off signs through to high-volume orders, with a choice of metals, colour infills, patinas and fixing options. Express turnaround services are available.']},
   {title:'Signs for a wide range of uses',list:applications},
   {title:'Materials & finishing',text:['Chemical etching reproduces detailed artwork as a permanent image in metal. Choose a finish and infill to suit your design and installation.'],list:materials,image:photo(paths.signs,7)},
   {title:'Like having your own etching department.',text:['Add etched metal signage to your range without investing in equipment and specialist staff. We offer a 100% quality guarantee and treat all enquiries in the strictest confidence.']}
  ],gallery:photos(paths.signs),faq:true,related:['etching','letters','industrial']
 },
 {
  path:paths.industrial,title:'Industrial plates & control panels.',eyebrow:'Industrial applications',intro:'Etched nameplates, data plates and tags. Precision laser-cut control panels and components.',image:photo(paths.industrial,0,'Industrial identification plates ready for supply'),facts:[['Permanent detail','Chemically etched labels'],['Precision cut','Fascias & backplates'],['Colour infill','Clear, legible information']],
  sections:[
   {title:'Identification that stays legible.',text:['Etched stainless steel and brass nameplates carry branding, OEM identification, model and serial numbers, and operational information on machinery and equipment.','Labels are permanently etched into the panel surface, with a wide range of infill colours for clear, high-contrast detail.'],list:['Operator control panels','Mimic diagrams','Industrial HMI fascias','Instructional panels']},
   {title:'Laser-cut components',specs:[['Control panel fascias & backplates','Precise openings for switches, dials, LEDs and displays'],['Custom tags & nameplates','Intricate, non-standard and bespoke shapes'],['Stencils & templates','Durable metal stencils'],['Industrial components','Custom-designed, precision-cut parts']]},
   {title:'In-house capabilities',list:['Large-volume etching','Precision laser cutting','Direct-to-metal full-colour UV printing','Drilled holes, adhesives, studs and other fixing options']},
   {title:'Industries we serve',list:['Manufacturing & engineering','Aerospace & defence','Automotive','Electronics & electrical','Medical technology & devices','Oil & gas','Marine','Rail & transportation','Energy & utilities','Process control & automation','Architectural & construction']}
  ],gallery:[filmPhoto('product-industrial-plates','Etched industrial nameplates and safety signage'),photo(paths.signs,8)],related:['etching','milling','signs']
 },
 {
  path:paths.film,title:'Theme parks, film & TV.',eyebrow:'Specialist signage',intro:'Etched metal signs, props and components for attractions, production sets and close-up detail.',image:photo(paths.film,0,'A selection of metal street signs made for film and television'),facts:[['Bespoke','Signs & props'],['Fine detail','Graphics, lettering & textures'],['Aged finishes','In-house patination']],
  sections:[
   {title:'Theme parks & attractions',text:['Etched metal signage combines permanent detail with a tactile surface. Applications include themed shopfronts, directional signs, ride warnings, information panels and control-panel overlays.','Stainless steel, brass and copper can be etched with fine graphics and finished to suit the setting.']},
   {title:'Film & television props',text:['We can reproduce designs, logos, fictional lettering and technical drawings in metal for props and set dressing.','From period-style dog tags and aged metal labels to contemporary data plates, etched details and patina finishes help match the production brief.'],image:photo(paths.film,1,'Etched metal signs and props')},
   {title:'Design & application',text:['Bespoke control panels, metal components, plaques and branded merchandise can be made with brushed, polished, aged or patinated surfaces. We combine etching, cutting and finishing to suit your project.']}
  ],gallery:photos(paths.film),related:['patina','signs','etching']
 },
 {
  path:paths.concepts,title:'Etching & finishing concepts.',eyebrow:'Ideas in metal',intro:'A closer look at combinations of etching, laser cutting and patination.',image:filmPhoto('opening-celtic-metal','Laser-cut, reverse-etched stainless steel Celtic cross'),
  sections:[
   {title:'Laser-cut & reverse-etched stainless',text:['A Celtic cross, laser cut from 3mm mirror stainless steel and reverse etched to a depth of 0.8mm, with a smooth, uniform etched surface.'],image:filmPhoto('opening-celtic-metal','Detail of the reverse-etched stainless steel Celtic cross')},
   {title:'Penrose tile patina',text:['Several patina finishes are combined in brass to highlight a Penrose tile pattern. The non-repeating tiling gives the surface a detailed, irregular rhythm.'],image:photo(paths.concepts,1)},
   {title:'Peacock patina',text:['Etched and patinated brass signage concepts, combining detailed patterns with coloured patina finishes.'],image:photo(paths.concepts,8)},
   {title:'4mm etched bronze with patina',text:['We produced 17 etched and patinated bronze plaques for the Garda Monument of Remembrance at Phoenix Park, Dublin. Each plaque measures 1400 × 920mm and is 4mm thick.','The refurbished monument carries the names of more than 1,800 Garda personnel who died in service since the organisation was founded in 1922.'],image:photo(paths.concepts,11,'Etched bronze plaques at the Garda Monument of Remembrance')},
   {title:'5mm reverse-etched brass',text:['A reverse-etched brass piece with a patina finish, combining deep detail and contrasting surfaces.'],image:photo(paths.concepts,12)},
   {title:'Laser-cut 3mm polished brass',text:['Clean, polished edges with an aged, textured patina. Close-up images show the contrast between the two finishes.'],image:photo(paths.concepts,15)}
  ],gallery:photos(paths.concepts),related:['patina','letters','architecture']
 },
 {
  path:'/new-page-2',title:'شركات الحفر الكيميائي الرائدة لخدمة مشاريعكم في الشرق الأوسط',eyebrow:'Architectural metal',intro:'Chemical etching for architectural projects.',image:photo('/new-page-2',0),arabic:true,
  sections:[{title:'Chemical etching for architecture',text:[original('/new-page-2').blocks[1]],list:['Brass & bronze','Rimex Metals®','Stainless, mirrored & Corten steel','Aluminium & copper'],specs:[['Sheet size','Up to 2500 × 1250mm'],['In-house processes','Chemical etching, patination, CNC routing, laser cutting and digital printing']]}],related:['architecture','patina','etching']
 }
];
