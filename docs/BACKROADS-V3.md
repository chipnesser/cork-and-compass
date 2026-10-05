# Cork & Compass v3.0 — Backroads

Backroads adds 20 optional lessons after the original 40. Completing the core trail still means completing Cork & Compass. The core badge, completion date, eight tasting unlocks, map, and original lesson content remain unchanged.

## Architecture

An optional `collection` field distinguishes Backroads lessons from core lessons. The shared lookup includes both collections so the existing quiz and save system can recognize optional answers. Core completion and tasting calculations continue to use only the original 40 lesson IDs. No storage migration or new storage key is needed.

`lib/backroads.ts` contains the 20 lessons, 80 questions, four display groups, and related stops. `lib/backroads-sources.ts` supplies primary-source links. `components/backroads.tsx` renders the optional signposts; the existing lesson interface handles reading, feedback, completion, and replay.

All optional lessons become available after 40 core completions, in any order. The completion badge offers an invitation, and the main progress/map screen retains a Backroads entrance. The shared eligibility check also blocks attempted quiz writes below 40 core completions.

## Curriculum

1. Côtes du Rhône
2. Syrah vs. Shiraz
3. Orange wine
4. Bordeaux 1855
5. Finger Lakes
6. Napa vs. Sonoma
7. Port
8. Madeira
9. Merlot and its cultural reputation
10. Who drinks what?
11. Bordeaux lore
12. Albariño, Pinot Blanc, and Verdejo
13. Plain tasting language
14. Wine changes in the glass
15. Old World / New World shortcuts
16. Vintage
17. The wine business
18. Natural, organic, and biodynamic
19. Champagne vocabulary
20. The bottle you don't know

The supplied brief ends at “What familiar wine can”. The capstone completes that thought as using a familiar bottle to explain an unfamiliar one, while checking the producer's information and tasting when possible.

## Verification

Automated checks cover all 80 new answers, unique IDs and valid references, the 39/40 gate, existing 40/40 saves, arbitrary lesson order, refresh serialization after every answer, replay, and preservation of core answers, completion order, badge/date, tasting statuses, and milestones. Existing core curriculum and badge checks also pass.

Browser checks cover the 39-to-40 celebration and invitation, desktop and 390px mobile layouts, an optional lesson's feedback, and refresh/resume from a partially answered quiz. Production build and TypeScript checks pass. Lint reports no errors and two existing-pattern native-image warnings for Fern.

## Release notes

Publishing uses the existing main-branch deployment pipeline. Close older app tabs after rollout: older application code does not recognize Backroads IDs and could discard those optional entries if it writes to the same origin's saved progress. Core progress remains compatible.

No new accounts, rewards, tasting requirements, certification claims, or dependencies were introduced.
