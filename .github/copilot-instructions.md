# Melody prototype design rules

Melody is a social music app for sharing songs, commenting, chatting, and
customizing a Lorelei avatar. Keep the grayscale prototype in
`prototype-react/` unchanged in visual style. The high-fidelity prototype lives
in `prototype-hifi/`, with routes represented in `src/screens.js`.

Figma source: https://www.figma.com/design/Triw1GC8rQLTBvm6hR6Nga/Melody,
page “Melody wireframes” (node `77:2`). The route-to-frame `figmaNode` mapping
is recorded alongside each frame in the hi-fi prototype.

## Hi-fi visual system

- Neo-brutalist UI: square corners, 3px black borders, hard shadows without
  blur; buttons press down onto their shadow.
- Colors: blush paper `#FFF0F7`, white `#FFFFFF`, black ink `#000000`, mauve
  text `#5B4A55`, placeholder `#8A7A85`, muted blush `#F7DDEB`, lemon `#FFD833`,
  bubblegum `#FF7AC6`, mint `#6FEDC0`, periwinkle `#9FA8FF`, and error red
  `#E62424`.
- Use Archivo Black for display headings and Work Sans for interface/body text.
- Design for a 390 × 844 phone, 20px side padding, 58px top padding, and tap
  targets of at least 44px. Let names truncate and body text wrap.
- The bottom tabs are Discover, Friends, Drop, Chats, and Profile. Sheets use a
  dimmed scrim, blush-paper background, black top border, and grabber.

## Data and integrations

- Generate avatars locally with the same DiceBear Lorelei setup as the low-fi
  prototype. Seed friends by handle and use `ryan` for the signed-in user.
- Fetch album art and track metadata from Spotify at runtime; never commit album
  art files or client secrets. Use the supplied `Cover.svg` pattern atlas when
  a Spotify cover cannot be loaded. Use Spotify Authorization Code with PKCE
  for account access and Spotify's official embed for playback.
- Replay Sleeve is a reference for now-playing presentation, not an artwork API.
- Keep the prototypes independent and publish the hi-fi build under `/hifi/`.
