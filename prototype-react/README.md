# Melody React Prototype

An independent React + JavaScript + HTML + CSS version of the 13-screen Melody
prototype. This folder owns its dependencies, assets, and build output. It does
not import code from `../prototype/` or from the future production application.
The original static prototype remains unchanged.

## Run

Use Node.js 22.12+ or 24+ and npm. From the repository root:

```sh
cd prototype-react
npm install
npm run dev -- --host 0.0.0.0
```

Open the URL Vite prints. Changes update automatically. Unlike the original
prototype, this app needs Vite; do not open its HTML file directly.

```sh
npm run build
npm run preview
npm run lint
npx playwright install chromium
npm test
```

On Linux, Chromium also needs Playwright's system libraries. Install those from
your terminal with `npx playwright install --with-deps chromium` if necessary.

The browser tests start and stop their own Vite server on port 4173 and cover
desktop/mobile rendering and interactions. Screenshots are in `test-results/`.

## Where To Edit

- `index.html`: HTML entry point, fonts, and page metadata.
- `src/main.jsx`: React mount.
- `src/Prototype.jsx`: JSX shell, React state, forms, controls, and navigation.
- `src/screens.js`: existing screen templates, avatar helpers, and initial data.
- `src/avatars.js`: local DiceBear Lorelei rendering and supported editor options.
- `src/styles.css`: original responsive layout and lo-fi styles.
- `public/wireframes/`: independent copy of the original wireframe images.

`html-react-parser` turns the existing HTML screen templates into React elements.
React owns rendering and state; the app does not run the old DOM controller.
The templates can be converted into individual JSX components incrementally.

Screen links use `#/id` (for example `/#/song`). Browser Back/Forward and refresh
preserve the route. Comments, messages, and avatar changes remain in memory and
reset on refresh. Press S to toggle review controls or open `/?dev`.

Keep the final application in a sibling folder such as `app/`, with its own
`package.json`. Nothing in this prototype needs to be part of its build.

## Avatars

Avatars use [DiceBear Lorelei](https://www.dicebear.com/styles/lorelei/) by Lisa
Wischofsky (CC0 1.0). SVGs are generated locally using `@dicebear/core` and
`@dicebear/lorelei`, without external avatar API requests. The editor supports
hair, facial features, accessories, skin tones, and backgrounds. Save applies
the draft; Cancel discards it. Changes reset on refresh, like other prototype data.

## Public Usability Testing

The GitHub Pages workflow is `.github/workflows/deploy-prototype.yml` at the
repository root. It builds only this prototype and publishes its `dist/` output.
It runs on pushes to `copilot/change-prototype-screen-navigation` that change
the prototype or workflow. Update its branch filter when moving development.

Before the first deployment, open the repository's Settings > Pages and select
GitHub Actions as the build source. If the `github-pages` environment restricts
deployment branches, allow the branch above under Settings > Environments.
The expected URL after a successful deployment is:

https://Ryan1997123.github.io/Melody/

That URL is not live until Pages is enabled and the deployment succeeds. Share
the root URL for testing from Sign in, or append `#/profile` for avatar tasks.
Do not add `?dev` to participant links. Use dummy sign-in details, not real
passwords. The prototype has no backend or automatic research recordings;
each participant's data stays in their browser memory and resets on refresh.
No Maze or other tracking script is installed.

The built `dist/` folder can also be uploaded to any static HTTPS host. Relative
asset paths allow it to work under a project subdirectory such as `/Melody/`.
