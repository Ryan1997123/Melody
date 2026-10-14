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
override it. The sun button on Discover, Friends, Chats, and Profile toggles dark mode and saves your choice
in this browser. In review controls (`?dev` or press S), choose **Device theme**
to follow your device again.

Dark mode uses the supplied Figma PNGs: background `#24132F`, raised surfaces
`#331C42`, and pale text, borders, and hard shadows `#FFF0F7`. Bright accents
retain black text, and Spotify artwork and avatar colors are not inverted.
The low-fidelity prototype's theme behavior is unchanged.

Color roles are checked against the light and dark PNG exports in
`../other-files/imgs/`: your Profile card is Bubblegum, comments Lemon,
friends Periwinkle, and Discover's talking-about card and invites Mint in
both themes. Neutral controls/cards are White in light mode and `#331C42`
in dark mode. Note/composer fields use the screen color. Accent text stays
black; neutral text, borders, and hard shadows follow the theme's ink.
These color checks do not imply pixel-identical layouts or content: the coded
prototype also includes requested controls, real artwork, and demo notices.

## Account and Settings prototype flows

The updated Figma map is `../other-files/melody-figma-map-latestbest.md`.
Create an account opens Join Melody, demo email verification, avatar setup,
14 genre chips (at least three required), friend suggestions, and You're in.
Handles are validated against demo names only. No account is created, email
sent, or password persisted; use invented credentials. OAuth from genre setup
returns to that step with the demo identity, avatar, and genres restored.

Profile Settings includes simulated notification/privacy preferences, Spotify,
Appearance (System/Light/Dark), and Log out confirmation. Cancel returns to
Settings; Done returns to Profile. Logging out clears Spotify tokens and stops
playback but preserves in-memory demo drops, comments, and chats until refresh.
There is no real authentication or server persistence.

Profile's comments stat opens Your comments and counts only your actual
submitted song comments and drops, starting at zero. Entries link to the
song they were posted on; other people's demo comments do not affect your
count. Comments remain in memory during the visit and reset on refresh,
like the rest of the prototype content.

Both prototypes share account-flow templates, actions, and layout CSS from
`../prototype-react/src/account-flows.js` and `account-flows.css`, with
fidelity-specific colors. Hi-fi uses the map's real song titles and verified
Spotify IDs; album artwork continues to load at runtime with patterned fallback.

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
Spotify errors appear in the Profile Spotify section as well as a notification.
If Spotify reports "Active Premium" or a similar Premium restriction, the app
owner must have an active Premium subscription; reconnecting cannot bypass
that development-mode requirement.

For GitHub Pages, add the Pages URL
`https://ryan1997123.github.io/Melody/hifi/` to the Spotify app's redirect
allowlist and define a GitHub Actions repository variable named
`SPOTIFY_CLIENT_ID`. The deploy workflow exposes that public client ID at build
time. If it is not configured, Connect Spotify explains what is missing rather
than pretending to connect.

After connecting, Discover can search Spotify tracks and load the account's
recent top tracks. Album art is read from Spotify's track metadata or public
oEmbed response, and the song screen uses Spotify's official embedded player.
Submit Discover search with Enter or the Search button. Without a connection,
it searches Melody's known songs by title, artist, or album. Connected searches
request Spotify results. If Spotify rejects the request, the actual error stays
visible and any local matches are explicitly labelled "Matching songs in Melody".
Clear search restores the main list.

Discover mood chips filter songs using curated Melody tags. Multiple chips
match **any** selected mood, and combine with the submitted search. Untagged
Spotify tracks are excluded when a mood is selected; these are not Spotify
audio-feature recommendations. Deselect the chips to see all search results.
Empty results include an explanation, and outdated search responses cannot
replace a newer search.

Discover's Play buttons start or pause the selected track in the background
without opening song details. The row shows Pause only when Spotify reports
playback. Clicking the artwork, title, artist, or rest of the song row opens
its details instead. Playback continues as you navigate.

The official Spotify player remains mounted but out of view during background
playback. If playback does not start within three seconds of a play request,
its controls appear for an extra tap; they hide again once Spotify reports
playback. Loading errors also reveal the player with an explanation.
Playback and preview availability are controlled by Spotify. No additional
playback permissions are requested.

Replay Sleeve was a visual reference, not an artwork source; it is a native
player and does not expose a public artwork API for this browser prototype.
Artwork is fetched at runtime;
no album art is committed to the repository.

## Prototype sources

- `src/screens.js`: frames, screen templates, seeded social content, and UI state.
- `src/data.js`: public Spotify track IDs used before a user connects.
- `src/spotify.js`: PKCE sign-in, token refresh, search, and top tracks.
- `src/Artwork.jsx`: on-demand Spotify album artwork with patterned fallback
  tiles from the supplied `src/assets/Cover.svg` atlas.
- `src/avatars.js`: local DiceBear Lorelei avatars.
- `src/styles.css`: high-fidelity palette, type, and responsive screen styles.
