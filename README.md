# Melody (Sleeve)

Low-fidelity clickable prototype of **Sleeve**, an app for saying what songs mean to you and sharing them with friends.

## Open the prototype

Open `prototype/index.html` in a browser. Nothing to install or build.

- **Desktop:** one centered 390×844 phone is shown on a grey canvas, scaled down if needed.
- **Phone:** the frame fills the viewport; content scrolls above the fixed tab bar.
- Starts at **Sign in** unless you open a screen deep link. Review controls are hidden by default.

Or serve the repository with any static server, for example:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000/prototype/`.

## The 13 frames

| # | Frame | Type | Gets you to |
|---|-------|------|-------------|
| 01 | Sign in | Screen | Discover (Sign in, Apple, Google) |
| 02 | Discover | Tab | Song page, Drop a song (+) |
| 03 | Friends | Tab | Add friends, Someone's profile, Song page |
| 04 | Chats | Tab | Conversation, Add friends |
| 05 | Profile | Tab | Avatar editor, Friends |
| 06 | Drop: pick a song | Sheet | Drop: say why |
| 07 | Drop: say why | Sheet | Back to where you started, with the note posted |
| 08 | Song page | Screen | Send to friends, Someone's profile |
| 09 | Send to friends | Sheet | Back to Song page |
| 10 | Conversation | Screen | Song page, Someone's profile |
| 11 | Someone's profile | Screen | Conversation, Song page |
| 12 | Add friends | Screen | Someone's profile |
| 13 | Avatar editor | Sheet | Back to Profile |

The tab bar and the black **+** button work on every tab. Back arrows, Cancel and tapping the grey area above a sheet all go back.

## Navigation and screen ids

The active frame has a stable `data-screen` id. Its URL is synchronized as `#/id`,
for example `prototype/index.html#/song`. Refresh keeps the active screen.
The original `#song` link format also works.

Navigation keeps a stack in browser history, so in-app Back and browser Back/Forward
follow the same path, including tab switches. Direct links to detail screens and
sheets seed their parent screens as Back destinations. Prototype data (comments,
messages and avatar edits) is only in memory and resets on refresh.

The ids are `signin`, `discover`, `friends`, `chats`, `profile`, `drop-pick`,
`drop-why`, `song`, `send`, `conversation`, `person`, `add-friends`, and `avatar`.
In `prototype/app.js`, `FRAMES` defines these ids and their deep-link parents,
and `SCREENS` defines their existing markup. Buttons use `data-go="id"` to
navigate, `data-mode="tab"` for tab transitions, and `data-back` to go back.
To add a screen, give it a unique matching entry in both `FRAMES` and `SCREENS`
and link to it from the UI.

## What works inside each frame

- Play buttons toggle, mood chips select, likes count up and down.
- Accept or decline the friend request. Add, cancel and search people on Add friends.
- Drop a song with a note, post a comment, send a song to friends, send a chat message. Each shows up where you'd expect.
- The avatar editor's tabs, arrows, swatches and shuffle all work, and the saved avatar shows on Profile.
- Buttons that lead to screens not wireframed yet (Settings, Edit profile, Open in Spotify, Share link, Forgot password, Create an account) say so instead of doing nothing.

## Review tools

Press **S** (outside a text field) to enable the screen-jump menu; press it again
to hide review tools. Alternatively open `prototype/index.html?dev` and tap the
blue pill to open the menu. It lists every screen. These controls are opt-in.

| Control | Key | What it does |
|---------|-----|--------------|
| Show hotspots | `H` | Outlines everything clickable in blue. Clicking a dead area flashes them briefly. |
| Overlay original frame | `O` | Lays the source wireframe PNG over the live frame for comparison. |
| Prev / Next | `←` `→` | Steps through the 13 frames in order. |
| Back | `Esc` | Same as the frame's back or Cancel. |
| Restart | | Resets everything to Sign in. |

## Files

- `prototype/index.html`: phone container and optional review controls
- `prototype/styles.css`: viewport layout, original lo-fi styles and transitions
- `prototype/app.js`: screen templates, interactions and hash/history navigation (plain JavaScript, no build step)
- `prototype/wireframes/`: the 13 source wireframes, numbered in flow order
