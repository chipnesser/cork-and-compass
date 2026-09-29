# Cork & Compass — 40-lesson beta report

The original typography, colors, Fern artwork, Field Notes, card layouts, quiz loop, branching cards, and restrained motion remain. The additions are chapter selection, expandable connections, related-lesson suggestions, and a tasting status selector.

## 1. The curriculum

Exactly 40 lessons in eight groups of five. Each contains one central idea, four concise teaching sentences, a visual descriptor, one table application, four questions with explanations, and at least two meaningful connections. Chapter 8 uses five guest conversations and service decisions.

| Group | Five lessons |
| --- | --- |
| 1. Getting oriented | Wine, without the worry; Dry is not the opposite of fruity; Meet the mouth-watering bit; Weight and grip; Read the bottle, not minds |
| 2. France: the Rosetta Stone | France 101; Bordeaux: a team of grapes; Burgundy: place under a magnifying glass; The Loire: follow the river; Champagne is a place |
| 3. Follow the grape | Chardonnay: one grape, many outfits; Sauvignon Blanc: familiar freshness; Meet Pinot Noir; Cabernet and Merlot: relatives at the table; Riesling: ask about sweetness |
| 4. The wider wine world | Italy: ask where, then what; Spain: grape plus time; Germany & Austria: dry is an option; California & Oregon: look closer; Southern Hemisphere: two useful stops |
| 5. How wine happens | The tiny work of yeast; Oak: seasoning, not a grape; Texture: the softer side; Three routes to bubbles; Skin contact and the passage of time |
| 6. The new wine world | Terroir: a place and its people; Farming words, useful questions; Natural: ask what was done; Pét-nat: catch the first fizz; Funk, faults, and a helpful response |
| 7. Wine at the table | Acid, salt, and the next bite; Rich food: refresh or echo; Spice: ask how much heat; Seafood: the preparation matters; Find their kind of wine |
| 8. The floor | “Chardonnay, but something different”; “Sauvignon, but not too fruity”; “We don’t know wine. We have oysters.”; “I usually drink Caymus”; One table, several different wishes |

The fifth France slot uses Champagne; Rhône is deliberately not added as a 41st lesson. The Southern Hemisphere stop includes New Zealand and Argentina.

## 2. The learning graph

Five introductory stops form a short sequence leading into France 101. Thereafter Place, Grape, and Technique suggest routes through the same lesson IDs. Chapters organize the library; they do not impose eight sequential course gates.

- Required **all** prerequisites must all be completed.
- A nonempty **any** list needs just one listed lesson. An empty list adds no gate.
- **Related lessons** are navigable conceptual connections, not extra requirements. These may be reciprocal; prerequisite reachability is independently tested.
- Primary axis and secondary connections let the same lesson appear through more than one path. Completion counts once regardless of route.
- Burgundy → Chardonnay and oak → Chardonnay both point at the same Chardonnay record. The Grape path can also reach it directly after France 101.
- Malolactic texture reconnects routes: fermentation plus either Chardonnay or oak opens it.
- Sparkling reconnects Champagne and fermentation; it leads toward pét-nat and seafood. Table lessons then feed the five floor conversations.
- The map shows one five-lesson chapter at a time. Future stops explain their prerequisites; expandable links distinguish available, completed, and future connections. No tasting is a prerequisite.

See [GRAPH.md](GRAPH.md) for every gate and edge. Edit graph.ts for structure, content.ts for teaching, and tastings.ts for comparisons; no UI rewrite is needed to rearrange the curriculum.

## 3. Eight tasting templates

A token unlocks at each multiple of five **unique** completed lessons. Tasting #1 retains both requested pairs. After that, tokens select an unused template weighted toward the preceding five lessons, so a learner following Technique is not forced into a geography-only comparison. The following numbers identify the canonical templates; unlocked token order can differ after #1. The assigned comparison and preceding five lesson IDs are saved.

| Template | Theme | Wines or styles | Axis |
| --- | --- | --- | --- |
| 1 | Same color. Different stories. | Riesling / Bordeaux Blanc / Marlborough Sauvignon Blanc / Pinot Blanc | grape |
| 2 | A place name, a grape connection. | White Burgundy / Chardonnay / White Sancerre / Sauvignon Blanc / Dry white Bordeaux blend | place |
| 3 | Three red grapes, three kinds of grip. | Pinot Noir / Merlot-led red / Cabernet Sauvignon-led red | grape |
| 4 | A grape takes a trip. | Loire Sauvignon Blanc / Marlborough Sauvignon Blanc / French Malbec / Mendoza Malbec | place |
| 5 | The cellar leaves a signature. | Chardonnay with little oak influence / Oak-influenced Chardonnay / Traditional-method sparkling wine / Tank-method sparkling wine | technique |
| 6 | Method, label, and what is in the glass. | Pét-nat / ancestral-method sparkling / Traditional-method sparkling / Skin-contact white / White made with little skin contact | technique |
| 7 | Same wine, a different bite. | Dry high-acid white / Off-dry Riesling / Light, gently tannic red | technique |
| 8 | Two glasses and a good question. | Fresh, dry white / Rounder white with known oak/texture choices / Lighter red / Fuller red with known tannin level | grape |

These are inventory-flexible comparisons, not required brands. Templates with four wines permit a relevant two-wine pair where stated. The first template retains all four requested wines. Each includes guidance, discussion prompts, and links back to the learner’s preceding five field notes. When the route and a remaining template are not a perfect match, the guide introduces the unfamiliar styles rather than implying they have already been studied.

**UNLOCKED:** earned by digital progress. **AVAILABLE TO TASTE:** learner confirms a guide and the wines are ready. **COMPLETED:** learner explicitly records that the guided tasting happened. Readiness and completion can be undone. Completing digital lessons never completes a tasting or requires tasting participation.

## 4. Human wine-expert review

The reference ledger and per-lesson source keys support editorial checking; they are not a claim of professional certification. Factual regional and method statements were checked against wine councils, WSET, OIV, USDA, certification bodies, and AWRI. All sensory generalizations are presented as tendencies.

Before beta use, have the restaurant wine lead review:

- Actual wine-list examples, blends, vintage variation, sweetness, oak and malolactic information; verify the selected Bordeaux Blanc is dry for Tasting #1.
- The short regional signposts, especially where appellation exceptions or aging categories need more detail for your inventory.
- Organic, biodynamic, regenerative, natural and low-intervention terminology. Certification depends on jurisdiction and scheme; no health, quality, or flavor superiority is promised.
- Pairing tendencies and guest vocabulary. The right bottle depends on the menu and the individual; these are starting points, not guaranteed pairings.
- Fault recognition, sparkling-bottle handling, and the restaurant’s escalation/replacement practice. The beta deliberately does not try to diagnose a bottle from one descriptor.
- Five floor scenarios with actual staff: are follow-ups natural, distractors realistic, and four decisions achievable within five minutes?

## 5. Technical decisions and beta attention

- **Local-first persistence:** versioned localStorage stores each answer, completions, milestone assignments, and tasting states. Reloading restores progress; unavailable or corrupt storage produces a recoverable error without overwriting the original data. This is not cross-device sync, staff verification, or a tamper-proof certificate.
- **Origin matters:** localhost, 127.0.0.1, and a hosted URL keep separate local records. Use the same URL and browser for a learner. Clearing browser data loses local access; export/sync is not implemented.
- **Prototype migration:** a read-only bridge imports the previous nine completed lesson credits one-to-one into matching beta subjects, retaining the raw legacy snapshot. Expanded lessons show a refresher note. Old partial answer arrays are archived, not replayed against changed questions. Migration does not fabricate completion of additional foundations.
- **Content revisions:** stable IDs and deterministic answer order survive graph reordering. If a question or its option semantics changes after beta launch, increment its content revision and add an explicit migration rather than reinterpreting saved answer indexes.
- **Tasting records:** self-reported readiness and completion, separate from lesson progress; no booking, inventory integration, staff authorization, or redemption ledger.
- **Accessibility:** keyboard-operable lesson, map and tasting controls; friendly text feedback; reduced-motion support; phone layouts checked at 390px and 320px without horizontal overflow.
- **Validation:** all 40 lessons and 160 questions exercised through browser controls from a fresh test origin; full graph journeys tested with Place-first, Grape-first, Technique-first, reverse, and mixed ordering. Additional tests cover ALL/ANY joins, eight unlock thresholds, manual tasting transitions, save/reload, replay credit protection, bad references, malformed local storage, quota failure, and legacy import.
- **Scope:** no visual redesign, extra lessons, leaderboards, accounts, or automatic tasting completion. Offline installation and offline asset caching are not included.

## Editorial references

Checked 2026-09-29. Each lesson’s source keys map to this ledger in lib/sources.ts. Hospitality scenarios are original editorial material awaiting restaurant review.

- **wine:** [WSET — What is wine?](https://www.wsetglobal.com/knowledge-centre/blog/2021/december/14/what-is-wine)
- **styles:** [WSET — Wine types and styles](https://www.wsetglobal.com/knowledge-centre/blog/2023/october/03/how-many-wine-types-and-styles-are-there)
- **acidity:** [WSET — Understanding acidity](https://www.wsetglobal.com/knowledge-centre/blog/2026/understanding-acidity-in-wine)
- **mouthfeel:** [WSET — What is mouthfeel?](https://www.wsetglobal.com/knowledge-centre/blog/2026/the-secret-language-of-wine-what-is-mouthfeel)
- **labels:** [WSET — How to find a wine you like](https://www.wsetglobal.com/knowledge-centre/blog/2025/how-to-find-a-wine-youll-like)
- **bordeaux:** [Bordeaux Wine Council — Grape varieties](https://www.bordeaux.com/en/grape-varieties/)
- **burgundy:** [Bourgogne Wine Board — Pinot Noir and Chardonnay](https://www.bourgogne-wines.com/wine-and-terroir/our-grape-varietals-our-colors/pinot-noir-and-chardonnay-the-bourgogne-region-s-two-noble-grape-varietals%2C2475%2C9265.html)
- **loire:** [InterLoire — Grape varieties](https://www.vinsdeloire.fr/fr/cepages?page=0)
- **champagne:** [Comité Champagne — Bottling and second fermentation](https://www.champagne.fr/en/about-champagne/how-champagne-is-made/bottling-and-second-fermentation)
- **nz:** [New Zealand Winegrowers — Marlborough](https://www.nzwine.com/en/regions/marlborough)
- **germany:** [German Wines USA — Dry German Riesling](https://germanwineusa.com/5-to-try-talkin-trocken-dry-german-riesling/)
- **austria:** [Austrian Wine — Grape varieties](https://www.austrianwine.com/fileadmin/user_upload/PDF/Broschueren/Rebsortenbroschuere_2019_EN.pdf)
- **italy:** [Chianti Classico Consortium — Wine characteristics](https://www.chianticlassico.com/en/wine/characteristics/)
- **barolo:** [Langhe Wine Consortium — Barolo production specification](https://www.langhevini.it/wp-content/uploads/2019/05/DOCG-Barolo.pdf)
- **rioja:** [Rioja Wine Council — Tempranillo](https://riojawine.com/en-us/the-designation/grape-varieties/tempranillo/)
- **rioja-aging:** [Rioja Wine Council — Aging categories](https://riojawine.com/en-gb/blog/classification-of-rioja-wines-according-to-their-ageing/)
- **california:** [California Wine Institute — Bay Area wine region](https://discovercaliforniawines.com/blog/get-to-know-the-san-francisco-bay-area-wine-region/)
- **oregon:** [Oregon Wine Board — Wine varieties](https://www.oregonwine.org/discover/oregon-wine-varieties/)
- **argentina:** [Wines of Argentina — Malbec, terroir and trends](https://api.winesofargentina.org/uploads/2021/11/7lxka1Q7Z3_Argentina_on_the_Couch._Malbec%2C_Terroir_and_Other_Trends_-_Report.pdf)
- **oak:** [WSET — Oak and style choices](https://www.wsetglobal.com/knowledge-centre/blog/2025/how-to-find-a-wine-youll-like)
- **malo:** [WSET — Level 2 teaching plan, malolactic conversion and lees](https://www.wsetglobal.com/media/13022/wset_l2wines_sessionplans_en_may2023_issue2.pdf)
- **sparkling:** [WSET — Sparkling wine production methods](https://www.wsetglobal.com/knowledge-centre/blog/2026/a-guide-to-sparkling-wine-production-methods-and-regional-styles)
- **skin:** [WSET — Skin-contact white wines](https://www.wsetglobal.com/knowledge-centre/blog/2026/what-is-orange-wine-understanding-skin-contact-white-wines)
- **terroir:** [OIV — Definition of vitivinicultural terroir](https://www.oiv.int/node/3362)
- **organic:** [USDA — Organic market labeling, including wine](https://www.ams.usda.gov/services/organic-certification/international-trade/labeling-requirements-US-organic-market)
- **biodynamic:** [Demeter USA — Farm and processing standards](https://demeter-usa.org/demeter-biodynamic-farm-and-processing-standards/)
- **regenerative:** [Regenerative Organic Alliance — Soil health framework guidance](https://regenorganic.org/wp-content/uploads/2023/03/Framework-Guidance-SoilHealth-LandMgmt.pdf)
- **natural:** [WSET — What is natural wine? (terminology only; not its value judgments)](https://www.wsetglobal.com/knowledge-centre/blog/2023/january/13/what-is-natural-wine)
- **faults:** [Australian Wine Research Institute — Flavours, faults and taints](https://www.awri.com.au/industry_support/winemaking_resources/sensory_assessment/recognition-of-wine-faults-and-taints/wine_faults/)
- **pairing:** [WSET — Food and wine interactions](https://www.wsetglobal.com/knowledge-centre/blog/2023/july/13/four-rules-to-masterful-food-and-wine-pairing)
- **spice:** [WSET — Pairing drinks with spice](https://www.wsetglobal.com/knowledge-centre/blog/2026/how-to-pair-drinks-with-spice)
- **hospitality:** Original hospitality scenarios — restaurant wine-lead review required
