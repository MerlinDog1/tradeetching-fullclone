# Route and content inventory

Read-only live-site capture: 22 September 2026. Source: `https://www.tradeetching.com/sitemap.xml` and the listed pages. Original mirror repository: `MerlinDog1/tradeetching-fullclone`, base `master`.

| Existing URL | Retained core content / redesigned layout |
| --- | --- |
| `/` | Trade-only supplier, founded 2012, Corby facility, etching/cutting/finishing, six service links, 97-panel Queen Anne project, 4m × 2m capacity, materials, production process, British Sign Awards trophies, Sign Update issue 189, FAQs and contact paths |
| `/chemical-etching-services` | Chemical/photo etching process, 4,000 sq. ft facility, 4m × 2m capacity, all listed material types and applications, chemical milling/patination/CNC/UV supporting processes |
| `/chemical-milling` | 0.012–1.5mm thickness, short/medium runs, rapid prototypes, process advantages, applications, detailed original metals/alloys and eight examples |
| `/metal-patination` | In-house patination, range of applications/materials and original patina examples |
| `/large-format-chemical-etching-for-architecture` | Architectural patterns, 2500 × 1250mm sheets, materials/processes, 97-panel / 391 sq. m Ian Kirkpatrick Queen Anne project and photography credit |
| `/flat-cut-metal-letters-brass-stainless-steel` | Solid brass and stainless lettering, polished/brushed/patinated finishes, 304 standard / 316 marine grade, surface etching, tactile/Braille capability and examples |
| `/etched-metal-signs-nameplates` | Trade supplier, signs/nameplates/plaques, materials, finishes, applications, 100% quality guarantee, confidential enquiries, FAQs and examples |
| `/etched-industrial-labels-control-panels` | Etched identification plates/tags, OEM data, control panels, infills, laser-cut fascias/backplates, stencils, fixings, UV print and all listed industry sectors |
| `/signage-for-theme-parks-film-tv-props` | Attraction signage, film/TV props and set dressing, custom etched details and aged/patinated finishes |
| `/metal-etching-concepts` | 3mm stainless Celtic cross / 0.8mm reverse etch, Penrose patina, peacock finish, 17 Garda bronze plaques / 1400 × 920 × 4mm, 5mm reverse-etched brass, laser-cut 3mm polished brass and original examples |
| `/etching-gallery` | All 59 existing images, now with descriptive captions, category filters, progressive reveal, keyboard/touch lightbox and focus restoration |
| `/Contact` | Original email, telephone, full postal address, weekday/weekend hours and Name/Email/Message enquiry fields; original provider action/hidden routing contract retained, preview does not send |
| `/new-page-2` | Existing Arabic heading and architectural etching text, sheet dimensions/materials/processes; route retained even though not part of the primary navigation |

## Copy decisions

- TED’s name, logo, black/blue palette and direct trade tone are retained.
- Repeated desktop/mobile blocks and duplicated headings are consolidated.
- Long promotional prose is shortened without adding performance promises, clients, prices, testimonials or claims.
- Accidental builder placeholder text is removed.
- The original home and service pages quote a **4m × 2m** general panel capacity, while the architecture page quotes **2500 × 1250mm** architectural sheets. These page-specific figures are retained; the film’s separate **2500 × 1000mm** figure is not substituted. The source owner can reconcile them later if needed.
- Original page titles and meta descriptions are retained. Each redesigned page has one H1 and canonical URL, and the review build is noindex.
- Existing telephone/email links, Instagram and LinkedIn destinations are preserved. Empty generic social placeholder links are not carried forward.
- All source images are local WebP variants rather than expiring CDN URLs; lazy loading and intrinsic dimensions are included. No third-party scripts or trackers are required to render the redesign.

## Existing form dependency

The current contact form is hosted-provider functionality, not source-owned functionality. Review mode keeps validation and the visual form working while blocking sends. The provider’s original public field/action contract is preserved for future integration, but the form’s delivery is **not verified** or represented as working on a standalone host. See README before an authorised release.
