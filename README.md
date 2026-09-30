# Cork & Compass

A friendly, game-like wine education app for restaurant servers.

Follow Fern, your mildly overenthusiastic field guide, through 40 interconnected lessons of about five minutes each. Explore through **Place**, **Grape**, or **Technique**, building practical wine confidence rather than sommelier credentials.

Every five completed lessons unlocks an optional real-world guided tasting at your restaurant. Tastings reinforce the field notes and never block digital progress.

## Current Status

**Cork & Compass Beta 0.1.0** — public beta / early prototype. The curriculum is ready for feedback; it has no formal certification or professional wine-education accreditation.

## Getting Started

Install **Node.js 22.13 or newer** (with npm) and Git. From your cloned repository:

```sh
npm ci
npm run dev
```

Open **http://localhost:5173**. No account, API key, environment file, or cloud database is required. The existing Vinext/Cloudflare development stack emulates its worker locally.

Progress saves in this browser on this device. Changing the URL's origin or clearing browser data creates a separate/fresh journey. Google Fonts requires internet access; fallback fonts remain available.

Other commands:

```sh
npm test                 # Curriculum, complete journeys, persistence and tasting checks
npm run typecheck
npm run lint
npm run build            # Production worker and browser assets in dist/
npm start                # Preview the production build locally; use the printed URL
```

Private `.openai/hosting.json` deployment settings are optional and ignored. The read-only `/api/progress` bridge exists for earlier hosted prototype learners; a fresh clone has no old learner cookie and needs no database setup. Deploying and migrating a historical database are separate from running locally.

## Project Structure

- `app/page.tsx` — screens, field map, quizzes, Fern and navigation.
- `app/globals.css`, `public/` — responsive styling, animations and artwork.
- `lib/content.ts` — teaching sentences, visual labels, quiz questions and feedback.
- `lib/graph.ts`, `lib/curriculum.ts`, `lib/model.ts` — chapters, stable lesson IDs, prerequisites, shared paths and types.
- `lib/tastings.ts` — eight guided tasting comparisons.
- `lib/progress.ts` — browser progress, migration and independent tasting milestones.
- `lib/sources.ts` — editorial references.
- `scripts/check-curriculum.mts` — structural and complete-journey checks.
- `build/`, `scripts/`, `vite.config.ts` — existing runtime and build support.

See [the curriculum report](docs/BETA-REPORT.md) and [editable graph reference](docs/GRAPH.md). Run `npm run docs:curriculum` after curriculum changes to refresh them. Keep stable lesson IDs; changing questions requires a deliberate progress migration.

## Curriculum

1. Getting oriented
2. France: the Rosetta Stone
3. Follow the grape
4. The wider wine world
5. How wine happens
6. The new wine world
7. Wine at the table
8. The floor

## Philosophy

**Build mental buckets, not piles of trivia.** Small, connected ideas help a server ask useful questions, explain a bottle plainly and make a thoughtful recommendation. Curiosity beats pretension; mistakes are part of learning.

## Contributing

Open an issue or a small pull request with a clear explanation. Preserve the welcoming tone, accessibility and stable lesson IDs. Run the checks above before submitting changes. For wine-content corrections, include a reliable reference.

## Disclaimer

Educational project. Wine descriptions describe common tendencies rather than guarantees; producers, vintages and individual bottles vary.

Code and original project assets are available under the [MIT License](LICENSE). Retained third-party code keeps its own notices; see [third-party notices](THIRD_PARTY_NOTICES.md).

## Curiosity, not compulsion

Optional vistas, field assignments and rest invitations live in `lib/experiences.ts`; reusable types live in `lib/model.ts`. Lessons reference vistas through `vistaIds`. The full-screen viewer and untracked field assignments live in `components/quiet-moments.tsx`.

All eight vistas currently use an original, explicitly labeled abstract placeholder, not regional photography. To curate a photograph, update its image, meaningful alt text, caption, photographer, source, license and source URL together, verify permission for redistribution, and set `placeholder` to false. No random web photography is fetched.

Fern offers a rest note after every three newly completed lessons within a visit. Reloading starts a new visit; there are no streaks, timers, deadlines, points or lost-progress penalties. Rest is always available after a lesson. Field assignments have no completion status or verification. Neither viewing, sharing nor resting affects prerequisites or tasting unlocks.
