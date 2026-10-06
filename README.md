# Melody (Sleeve)

Low-fidelity clickable prototype of **Sleeve**, an app for saying what songs mean to you and sharing them with friends.

## Open the prototype

Open `prototype/index.html` in a browser. Nothing to install or build.

- **Desktop:** the frame list sits on the left, and one 390×844 frame is shown at a time on a grey canvas.
- **Phone:** the frame fills the screen. Tap the blue pill at the top to open the frame list.

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

## What works inside each frame

- Play buttons toggle, mood chips select, likes count up and down.
- Accept or decline the friend request. Add, cancel and search people on Add friends.
- Drop a song with a note, post a comment, send a song to friends, send a chat message. Each shows up where you'd expect.
- The avatar editor's tabs, arrows, swatches and shuffle all work, and the saved avatar shows on Profile.
- Buttons that lead to screens not wireframed yet (Settings, Edit profile, Open in Spotify, Share link, Forgot password, Create an account) say so instead of doing nothing.

## Review tools

| Control | Key | What it does |
|---------|-----|--------------|
| Show hotspots | `H` | Outlines everything clickable in blue. Clicking a dead area flashes them briefly. |
| Overlay original frame | `O` | Lays the source wireframe PNG over the live frame for comparison. |
| Prev / Next | `←` `→` | Steps through the 13 frames in order. |
| Back | `Esc` | Same as the frame's back or Cancel. |
| Restart | | Resets everything to Sign in. |

You can link straight to a frame with its name after `#`, for example `prototype/index.html#song`.

## Files

- `prototype/index.html`: the whole prototype (HTML, CSS and JS in one file)
- `prototype/wireframes/`: the 13 source wireframes, numbered in flow order
