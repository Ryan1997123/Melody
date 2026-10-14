# Melody Hi-fi Prototype

The high-fidelity, click-through version of Melody. It is a separate Vite app
from the low-fidelity prototype in `../prototype-react/` and is published at
`/hifi/` by the shared GitHub Pages workflow.

## Run and validate

From this folder:

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
```

Routes use hashes, for example `/#/discover`, `/#/song`, and `/#/edit-profile`.
The app is designed around a 390 × 844 phone viewport and keeps prototype state
in memory, except for the short-lived Spotify OAuth session and saved theme
preference.

## Dark mode

The hi-fi prototype follows the device's light/dark preference until you
override it. The sun button on Profile toggles dark mode and saves your choice
in this browser. In review controls (`?dev` or press S), choose **Device theme**
to follow your device again.

Dark mode uses the supplied Figma PNGs: background `#24132F`, raised surfaces
`#331C42`, and pale text, borders, and hard shadows `#FFF0F7`. Bright accents
retain black text, and Spotify artwork and avatar colors are not inverted.
The low-fidelity prototype's theme behavior is unchanged.

## Spotify

The prototype uses Spotify Authorization Code with PKCE. No client secret is
used or stored in the browser. Set `VITE_SPOTIFY_CLIENT_ID` to a Spotify
Developer Dashboard client ID for local use, then add the exact local redirect
URI `http://127.0.0.1:5173/` to that app's redirect allowlist and open the app
using that address. Spotify does not allow `localhost` redirect URIs. For a
Codespaces forwarded URL, register that exact HTTPS URL instead.

The app owner needs Spotify Premium while the Spotify app is in development
mode. Development mode allows up to five authenticated users, who must be
added under Settings > Users Management in the Spotify Developer Dashboard.

For GitHub Pages, add the Pages URL
`https://ryan1997123.github.io/Melody/hifi/` to the Spotify app's redirect
allowlist and define a GitHub Actions repository variable named
`SPOTIFY_CLIENT_ID`. The deploy workflow exposes that public client ID at build
time. If it is not configured, Connect Spotify explains what is missing rather
than pretending to connect.

After connecting, Discover can search Spotify tracks and load the account's
recent top tracks. Album art is read from Spotify's track metadata or public
oEmbed response, and the song screen uses Spotify's official embedded player.
The [Replay Sleeve page](https://replay.software/sleeve) is linked as a
now-playing/sleeve reference; it is a native player and does not expose a
public artwork API for this browser prototype. Artwork is fetched at runtime;
no album art is committed to the repository.

## Prototype sources

- `src/screens.js`: frames, screen templates, seeded social content, and UI state.
- `src/data.js`: public Spotify track IDs used before a user connects.
- `src/spotify.js`: PKCE sign-in, token refresh, search, and top tracks.
- `src/Artwork.jsx`: on-demand Spotify album artwork with patterned fallback
  tiles from the supplied `src/assets/Cover.svg` atlas.
- `src/avatars.js`: local DiceBear Lorelei avatars.
- `src/styles.css`: high-fidelity palette, type, and responsive screen styles.
