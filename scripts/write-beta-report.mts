import {writeFileSync} from 'node:fs';
import {chapters,lessons,byId} from '../lib/curriculum.ts';
import {tastings} from '../lib/tastings.ts';
import {sources} from '../lib/sources.ts';
const inventory=chapters.map(c=>`| ${c.id}. ${c.title} | ${lessons.filter(l=>l.chapter===c.id).map(l=>l.title.replaceAll('|','/')).join('; ')} |`).join('\n');
const flights=tastings.map(t=>`| ${t.number} | ${t.title} | ${t.wines.join(' / ')} | ${t.axis} |`).join('\n');
const report=`# Cork & Compass — 40-lesson beta report

The original typography, colors, Fern artwork, Field Notes, card layouts, quiz loop, branching cards, and restrained motion remain. The additions are chapter selection, expandable connections, related-lesson suggestions, and a tasting status selector.

## 1. The curriculum

Exactly 40 lessons in eight groups of five. Each contains one central idea, four concise teaching sentences, a visual descriptor, one table application, four questions with explanations, and at least two meaningful connections. Chapter 8 uses five guest conversations and service decisions.

| Group | Five lessons |
| --- | --- |
${inventory}

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
${flights}

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

${Object.entries(sources).map(([key,s])=>s.url?`- **${key}:** [${s.title}](${s.url})`:`- **${key}:** ${s.title}`).join('\n')}
`;
writeFileSync('docs/BETA-REPORT.md',report);
const names=(ids:string[])=>ids.length?ids.map(id=>byId[id].title).join(' + '):'—';
writeFileSync('docs/GRAPH.md',`# Editable learning graph\n\nALL columns require every entry. ANY columns require at least one entry. Related links are navigation, not gates. Completed prototype credits remain revisitable even when newly added prerequisites are unfinished.\n\n| ID | Chapter / primary axis | ALL | ANY | Related |\n| --- | --- | --- | --- | --- |\n${lessons.map(l=>`| ${l.id} | ${l.chapter} / ${l.axis} | ${names(l.prerequisites.all)} | ${names(l.prerequisites.any)} | ${names(l.relatedLessons)} |`).join('\n')}\n`);
