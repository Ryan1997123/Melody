# Sleeve React Prototype

An independent React + JavaScript + HTML + CSS version of the 13-screen Sleeve
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

The browser tests start and stop their own Vite server on port 4173 and cover
desktop/mobile rendering and interactions. Screenshots are in `test-results/`.

## Where To Edit

- `index.html`: HTML entry point, fonts, and page metadata.
- `src/main.jsx`: React mount.
- `src/Prototype.jsx`: JSX shell, React state, forms, controls, and navigation.
- `src/screens.js`: existing screen templates, avatar helpers, and initial data.
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
