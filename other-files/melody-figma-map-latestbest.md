# Melody — Figma file map

File: https://www.figma.com/design/Triw1GC8rQLTBvm6hR6Nga/Melody (fileKey `Triw1GC8rQLTBvm6hR6Nga`)
Page: node `77:2`, built 2026-10-13 as "Melody wireframes", since renamed by the owner to **"Layout"** (hi-fi). Lo-fi lives on **Wires** (`8:2`). Other pages (Thumbail, Sitemap, Art, Discovery, Wires, Archive) are the owner's; the only change there was "Invite friends to Sleeve" → "Melody" on Wires (with permission).
Name note: the app was first called "Sleeve", renamed to Melody. "Sleeve" is a Mac app by Replay Software, so avoid that name.
Live lo-fi prototype: https://ryan1997123.github.io/Melody/#/discover — source in github.com/ryan1997123/Melody, branch `copilot/change-prototype-screen-navigation`, folder `prototype-react/` (avatars in `src/avatars.js`, screens in `src/screens.js`). "Edit profile", "Settings", "Forgot password", "Create an account", "Open in Spotify" and "Share link" show a "No frame yet" toast there (Create an account and Settings/Log out now have frames in Figma). Hi-fi build plan for Copilot: see `claude/melody-hifi-copilot-brief.md`.

## Screens (390 × 844)
Light, row 1 (y 1500): Sign in `78:8`, Discover `78:38`, Friends `78:130`, Chats `78:231`, Profile `78:309`, Edit profile `94:1665` (x 2350; sheet: avatar + Edit avatar, Handle 3–20 chars, Bio 160 max with counter, Save profile).
Light, row 2 (y 2564): Drop: pick a song `79:241`, Drop: say why `79:312`, Song page `79:345`, Send to friends `79:385`, Conversation `79:467`, Someone's profile `79:508`, Add friends `79:557`, Avatar editor `79:625`.
Dark copies (added 2026-10-13, frames set to "Melody theme" = Dark): row 1 at y 3760 — Sign in `100:981`, Discover `100:1000`, Friends `100:1023`, Chats `100:1051`, Profile `100:1091`, Edit profile `100:1119`; row 2 at y 4824 — Drop pick `100:1145`, Drop why `100:1170`, Song `100:1200`, Send `100:1217`, Conversation `100:1270`, Someone's profile `100:1294`, Add friends `100:1306`, Avatar editor `100:1347`. They are copies, so layout edits to light screens must be repeated (or re-copied); color changes flow through the theme automatically.
Sheets (Drop ×2, Send, Avatar editor, Edit profile) = 40% black backdrop + "Sheet" frame in Blush paper.

## Where things live (owner's arrangement as of 2026-10-14)
Low fidelity = **Wires** page (`8:2`), one row at y 0 (the owner's lo-fi set, html-imported, plus additions). Hi-fi = **Layout** page (`77:2`): light rows y 1500 / 2564, dark rows y 3760 / 4824. New flows sit in the row of the screen they start from.

## Create an account flow (added 2026-10-14)
Entry: "Create an account" on Sign in. Six screens placed to the left of Sign in (hi-fi x −2820 … −470; Wires x −2780 … −430). Steps 1–4 show a back button and a 4-segment progress bar ("Step n of 4 · …").
| # | Screen | Low fidelity (Wires) | Hi-fi light (y 1500) | Hi-fi dark (y 3760) |
|---|---|---|---|---|
| 1 | Join Melody — handle (with "Available" check), email, password, Create account, Apple/Google, "Have an account? Sign in" | `99:3341` | `101:1927` | `102:2404` |
| 2 | Check your email — Open email app, Resend link, "Wrong email? Change it" | `99:3382` | `101:1976` | `102:2445` |
| 3 | Make your avatar (step 2) — Lorelei avatar + shuffle, Hair/Face/Extras/Colors tabs, pickers, hair color swatches, Next | `99:3405` | `101:2003` | `102:2468` |
| 4 | What do you listen to (step 3) — 14 genre chips, pick at least 3, optional Connect Spotify, Next | `99:3461` | `101:2081` | `102:2524` |
| 5 | Find your friends (step 4) — search, Share invite link, People you might know (Add / Requested), Finish, Skip for now | `99:3496` | `101:2134` | `102:2559` |
| 6 | You're in — avatar card, Drop your first song, Explore Discover | `99:3538` | `101:2236` | `102:2601` |

## Log out (added 2026-10-14)
Flow: Profile ⚙ (Settings button) → **Settings** sheet → Log out → **Log out?** dialog → Log out goes to Sign in; Cancel goes back to Settings; Done closes Settings. These are wired as Figma prototype links (click-through) in all three versions.
- Settings sheet: account card (avatar, @ryan, ryan@example.com), Preferences list (Notifications · On, Privacy · Friends only, Spotify · Not connected, Appearance · System, Help & feedback), secondary "Log out" button at the bottom, "Melody 0.1 · Terms · Privacy".
- Log out? dialog over the dimmed Profile: "Log out of Melody?" / "You'll need your email and password to sign back in. Your drops, comments and chats stay saved." Primary "Log out" (accent), secondary "Cancel".
| Screen | Low fidelity (Wires, y 0) | Hi-fi light (y 1500) | Hi-fi dark (y 3760) |
|---|---|---|---|
| Settings | `107:317` (x 6020) | `106:2193` (x 2820) | `106:2480` (x 2820) |
| Log out? | `107:379` (x 6450, over Profile-5) | `106:2270` (x 3290) | `106:2523` (x 3290) |

Hi-fi light is the source: dark versions are clones with "Melody theme" = Dark; low-fi versions are clones converted to raw grays (#FFFFFF screen/card, #F0F0F0 muted, #D9D9D9 accents, #111111 ink/borders/shadows, #555555 secondary, #8C8C8C placeholder; avatars = Placeholder variant). Low-fi copies are detached from styles, so re-copy them after layout changes rather than editing colors.

## Content (real, added 2026-10-13)
You = @ryan, bio "Night drives, sad bangers and anything with a good bridge." Friends @rae @pip @jules @noor @dmitri @sam @lou @kit.
Top charts: Espresso (Sabrina Carpenter), Good Luck, Babe! (Chappell Roan), Birds of a Feather (Billie Eilish), APT. (ROSÉ & Bruno Mars), Die With A Smile (Lady Gaga & Bruno Mars). Drop trending: Pink Pony Club, Not Like Us, Kyoto, Midnight City, Dreams, Nobody. Song page: Ribs — Lorde · Pure Heroine. Chat song: Nights — Frank Ocean.
Album art: deliberately not placed in Figma (copyrighted); each song has a consistent patterned Cover variant, which the owner wants kept as the loading/fallback art. Real artwork should load at runtime from the music API in the app/prototype.

## Local components (Components frame `77:5`)
- Avatar `86:530` — variant props Person (Placeholder, you, rae, pip, dmitri, jules, noor, sam, lou, kit) × Style (Avataaars, Lorelei). All screens use Style=Lorelei, matching the live prototype (DiceBear Lorelei 9.4, people seeded by handle; "you" = prototype's initialAvatar()).
- Cover `87:498` — variant prop Style: Placeholder, Lemon stripes, Pink stripes, Peri dots, Mint dots, Lemon dots, Pink dots, Mint circle, Peri grid
- Tab bar `77:161` — variant prop Active: Discover / Friends / Chats / Profile; bubblegum + Drop button
- Track row `77:33` (props Title, Artist), Comment card `77:41` (Handle, Time, Body, Song), Play button `77:15`, Back button `77:18`, Chip `77:21`

## Avatar editor (matches prototype)
Tabs: Hair (Hair 1/48, Flowers, Hair color) · Face (Head, Eyes, Brows, Mouth) · Extras (Glasses, Earrings, Beard, Freckles) · Colors (Skin tone, Background). Lorelei has no clothing, so there is no outfit editing.

## From the Neobrutalism components (Community) library
Button, Input, Textarea, Message (chat bubbles), Star/Decoration (You're in screen). Adapted on instances: Work Sans text, square corners, 3pt Ink borders, Melody colors, theme-bound shadows.

## Tokens
- Text styles: Title, H1, H2, H3, Body, Body-bold, Body-M, Labels (+ Work Sans/Bold 11–14, Work Sans/Bold underline, Archivo Black 48 for the logo)
- Variable collection "Melody theme" (Light / Dark): screen #FFF0F7 / #24132F · card #FFFFFF / #331C42 · muted #F7DDEB / #452A57 · ink #000000 / #FFF0F7 (text, borders, shadows) · ink-secondary #5B4A55 / #D6C4E0 · placeholder #8A7A85 / #A08DA9 · on-accent #000000 / #000000.
- Paint styles bound to the theme: Blush paper → screen, White → card, Blush muted → muted, Ink → ink, Mauve text → ink-secondary, Placeholder → placeholder. New style "On accent" → on-accent, used for text and icons sitting on Lemon/Bubblegum/Mint/Periwinkle so they stay black in dark mode. Accent styles (Lemon, Bubblegum, Mint, Periwinkle) are the same in both modes.
- Variable `accent` (collection "Melody wires") = Lemon; drives primary buttons, my chat bubbles, active tab, play buttons, unread dots, progress bar.

## Color roles (match the hi-fi app)
Lemon = main action, your messages, compose cards, sign-up progress · Bubblegum = Drop button, your profile, likes, active avatar section, picked genres · Mint = Open in Spotify, Accept, Connect Spotify, "friends are talking about", selected friends, invite card, "Available" · Periwinkle = Send, + Add, other people's profiles, friends stat, avatar shuffle
