# Cork & Compass Beta 0.1.0 — release handoff

Prepared September 29, 2026. Nothing was committed, pushed, published, or redeployed.

## Result

The release snapshot is runnable and tested. **Dependency security work remains before recommending a public deployment:** npm reports 13 advisories (6 high, 7 moderate, no critical). Publishing source and deploying a public server are separate decisions.

Use the clean `cork-and-compass-release` folder for the first GitHub commit. It has no old Git history or private deployment identity. The original working checkout and hosted app remain available.

## Cleanup and preservation

Removed unused starter UI components, hooks, example database route, template SVGs, screenshot, unused auth helper, utility module, vendored unused styles, and their dependencies. Removed debug metadata, unused imports, and a test's hardcoded temporary output path. Fixed render-time component creation without changing markup; browser initialization is deferred until after mount. Added ordinary npm test/typecheck commands, MIT licensing, third-party notices, README and ignore rules. Optional hosting metadata no longer prevents a clean public build.

Lesson content, graph, curriculum helpers/types, tasting data, CSS and Fern PNG were compared byte-for-byte with the original release candidate and match. No lesson or design changes were made. Existing build/connector and historical database support remain to avoid a framework migration in this pass.

## Validation

- Clean `npm ci`: success, 515 installed packages; tested using Node 24.19.0 and npm 12.1.0 on macOS. Documented framework prerequisite: Node 22.13+.
- Exactly 40 unique lessons, eight chapters, four valid quiz questions each (160 total), valid prerequisites/related links/source references/tasting references: passed.
- All lessons reachable through five complete journey orderings, ALL/ANY joins, blocked prerequisites, save/reload, conflicts, malformed storage, legacy migration and quota failures: passed.
- Eight milestones at 5/10/15/20/25/30/35/40 lessons, independent tasting transitions and no tasting gates: passed.
- TypeScript: passed. ESLint: zero errors, one warning.
- Production build: passed after final lockfile changes.
- Production browser smoke check: home, lesson, quiz selection, friendly feedback and persisted resume after reload passed; no console warnings/errors on the clean localhost origin.
- Existing mobile CSS and reduced-motion rules are unchanged; this release pass did not rerun every device or every question in the browser. The automated suite exercised all questions.

## Remaining warnings and limitations

- Compatible `npm audit fix` reduced 19 advisories to 13. Remaining affected packages: @cloudflare/vite-plugin, @esbuild-kit/core-utils, @esbuild-kit/esm-loader, drizzle-kit, esbuild, image-size, miniflare, react-server-dom-webpack, undici, vinext, vite, wrangler and ws. npm proposes changes outside pinned ranges (including a breaking drizzle-kit change); no forced upgrade was applied. Review and test these upgrades before public deployment. Run `npm audit` for current details.
- ESLint recommends optimized image handling for Fern's existing `<img>`. Kept the image unchanged; the warning is not suppressed.
- Vinext reports unknown static classification for `/`; build succeeds and the route serves locally.
- Two transitive esbuild-kit packages are deprecated. npm 12 also reported seven blocked install scripts under its allowScripts policy; platform-provided binaries still installed and all checks/build succeeded. Other operating systems were not tested.
- A stale prototype cookie on a host without the historical database shows the existing nonblocking migration notice. A fresh localhost origin loaded without that notice. Current progress stays browser-local.
- Fonts are requested from Google Fonts. Progress does not sync between devices, browsers or origins.

## Secrets and repository hygiene

No credentials, API keys, tokens or private keys were found in the scanned source or existing one-commit history. A non-secret private deployment project identifier and an old temporary machine path were identified; neither is included in the clean release snapshot/history. This was a pattern-based scan, not a guarantee that every possible sensitive value is detectable.

`.gitignore` excludes environments, credentials in PEM files, private hosting settings, dependencies, generated output, runtime state and editor/OS files. No `.env.example` is needed: local use requires no environment secrets. Generated files from validation are present locally but ignored.

## Files changed

Added: `LICENSE`, `THIRD_PARTY_NOTICES.md`, `docs/RELEASE-0.1.0.md`.

Updated: `.gitignore`, `.npmrc`, `README.md`, `package.json`, `package-lock.json`, `eslint.config.mjs`, `vite.config.ts`, `build/sites-vite-plugin.ts`, `app/layout.tsx`, `app/page.tsx`, `lib/progress.ts`, `scripts/check-curriculum.mts`.

Removed unused groups: `components/`, `hooks/`, `examples/`, `vendor/`, `components.json`, `app/chatgpt-auth.ts`, `lib/utils.ts`, `preview.png`, `public/file.svg`, `public/globe.svg`, `public/window.svg`. The release snapshot excludes `.openai/hosting.json`; the original checkout retains its private file. Removed originals are also backed up locally outside the release folder.

## GitHub handoff

GitHub CLI was not found in PATH or the usual installation locations, so authenticated CLI publishing could not be confirmed.

From Terminal, initialize the clean release folder and create the first commit:

```sh
cd /Users/chip/Documents/Playground/cork-and-compass-release
git init -b main
git add .
git diff --cached --stat
git status --short
git commit -m "Release Cork & Compass beta 0.1.0"
```

On GitHub, create an **empty public repository** named `cork-and-compass`. Do not initialize another README, license or gitignore. Description:

> A game-like wine education trail for restaurant servers — 40 bite-sized lessons through place, grape, technique, and tasting.

Then connect and push, entering your GitHub username or organization when prompted:

```sh
printf 'GitHub username or organization: '
read -r github_owner
git remote add origin "https://github.com/${github_owner}/cork-and-compass.git"
git push -u origin main
```

If you install GitHub CLI instead, after the local commit the alternative is:

```sh
gh auth login
gh auth status
gh repo create cork-and-compass --public --source=. --remote=origin --description "A game-like wine education trail for restaurant servers — 40 bite-sized lessons through place, grape, technique, and tasting."
git push -u origin main
```

Choose one repository-creation method. These commands are for you to run when ready; none has been executed as part of this handoff.
