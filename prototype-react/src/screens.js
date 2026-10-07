/* ---------- Frames ---------- */
export const FRAMES = [
  { id: 'signin', name: 'Sign in', file: '01-sign-in.png', group: 'Start' },
  { id: 'discover', name: 'Discover', file: '02-discover.png', group: 'Tabs' },
  { id: 'friends', name: 'Friends', file: '03-friends.png', group: 'Tabs' },
  { id: 'chats', name: 'Chats', file: '04-chats.png', group: 'Tabs' },
  { id: 'profile', name: 'Profile', file: '05-profile.png', group: 'Tabs' },
  { id: 'drop-pick', name: 'Drop: pick a song', file: '06-drop-pick-a-song.png', group: 'Drop a song', sheet: true, chain: ['discover'] },
  { id: 'drop-why', name: 'Drop: say why', file: '07-drop-say-why.png', group: 'Drop a song', sheet: true, chain: ['discover', 'drop-pick'] },
  { id: 'song', name: 'Song page', file: '08-song-page.png', group: 'Songs', chain: ['discover'] },
  { id: 'send', name: 'Send to friends', file: '09-send-to-friends.png', group: 'Songs', sheet: true, chain: ['discover', 'song'] },
  { id: 'conversation', name: 'Conversation', file: '10-conversation.png', group: 'People', chain: ['chats'] },
  { id: 'person', name: 'Someone’s profile', file: '11-someones-profile.png', group: 'People', chain: ['friends'] },
  { id: 'add-friends', name: 'Add friends', file: '12-add-friends.png', group: 'People', chain: ['friends'] },
  { id: 'avatar', name: 'Avatar editor', file: '13-avatar-editor.png', group: 'Profile', sheet: true, chain: ['profile'] },
];
export const byId = Object.fromEntries(FRAMES.map((f, i) => [f.id, { ...f, n: i + 1 }]));
export const TABS = ['discover', 'friends', 'chats', 'profile'];
export const validScreen = id => Object.prototype.hasOwnProperty.call(byId, id);

/* ---------- Icons ---------- */
function svg(inner, w = 2) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
const ic = {
  compass: svg('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8z"/>'),
  people: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.4-3.6 3.1-6 6.5-6s6.1 2.4 6.5 6"/><path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4"/><path d="M17.5 14.4c2.2.8 3.6 2.9 4 5.6"/>'),
  chat: svg('<path d="M12 3.5a8.5 8.5 0 1 1-4.2 15.9L3.5 20.5l1.1-4.1A8.5 8.5 0 0 1 12 3.5z"/>'),
  smile: svg('<circle cx="12" cy="12" r="9"/><path d="M8.5 13.5c.9 1.5 2.1 2.2 3.5 2.2s2.6-.7 3.5-2.2"/>'),
  search: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/>', 2.5),
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" fill="currentColor"/></svg>',
  left: svg('<path d="M19 12H5.5M11 6l-6 6 6 6"/>', 2.5),
  right: svg('<path d="M5 12h13.5M13 6l6 6-6 6"/>', 2.5),
  chevL: svg('<path d="M14.5 6l-6 6 6 6"/>', 2.5),
  chevR: svg('<path d="M9.5 6l6 6-6 6"/>', 2.5),
  chevD: svg('<path d="M6 9.5l6 6 6-6"/>', 3),
  plus: svg('<path d="M12 4v16M4 12h16"/>', 3.5),
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 3),
  heart: svg('<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>'),
  sun: svg('<circle cx="12" cy="12" r="3.2"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>'),
  shuffle: svg('<path d="M3 7h3.5c2 0 3.2 1 4.5 3l2 4c1.3 2 2.5 3 4.5 3H21M18 14l3 3-3 3M3 17h3.5c1.2 0 2.1-.4 2.9-1.1M14.6 8.1c.8-.7 1.7-1.1 2.9-1.1H21M18 4l3 3-3 3"/>'),
};
const PERSON = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="38" r="18" fill="none" stroke="#8c8c8c" stroke-width="5"/><path d="M16 93a34 32 0 0 1 68 0" fill="none" stroke="#8c8c8c" stroke-width="5"/></svg>';
const COVER = '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0L100 100M100 0L0 100" stroke="#aaaaaa" stroke-width="1.2" vector-effect="non-scaling-stroke"/></svg>';

/* ---------- Avatar ---------- */
export const SW = ['#ffffff', '#ebebeb', '#e0e0e0', '#c4c4c4', '#a6a6a6', '#969696', '#7a7a7a', '#5c5c5c'];
export const AVO = {
  top: ['Hoodie', 'Tee', 'Jacket', 'Sweater'],
  print: ['Bear', 'None', 'Star', 'Stripes', 'Note'],
  hair: ['None', 'Short', 'Long', 'Curly', 'Buzz'],
  hat: ['None', 'Beanie', 'Cap', 'Bucket', 'Headphones'],
  eyes: ['None', 'Dots', 'Happy', 'Sleepy'],
  mouth: ['None', 'Smile', 'Grin', 'Flat'],
  extra: ['None', 'Glasses', 'Freckles', 'Shades'],
};
const AV_TABS = [
  { id: 'outfit', label: 'Outfit', rows: [['Top', 'top'], ['Print', 'print']], colors: [['Color', 'outfitColor']] },
  { id: 'hair', label: 'Hair & hats', rows: [['Hair', 'hair'], ['Hat', 'hat']], colors: [['Color', 'hairColor']] },
  { id: 'face', label: 'Face', rows: [['Eyes', 'eyes'], ['Mouth', 'mouth'], ['Extras', 'extra']], colors: [] },
  { id: 'skin', label: 'Skin & bg', rows: [], colors: [['Skin', 'skin'], ['Background', 'bg']] },
];
function avatarSVG(a) {
  const st = 'stroke="#8c8c8c" stroke-width="5"';
  const ink = '#111111';
  const hair = SW[a.hairColor], cloth = SW[a.outfitColor];
  const v = k => AVO[k][a[k]];
  let s = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="${SW[a.bg]}"/>`;
  if (v('hair') === 'Long') s += `<path d="M29 40a21 21 0 0 1 42 0v26H29z" fill="${hair}" ${st}/>`;
  s += `<path d="M16 93a34 32 0 0 1 68 0v7H16z" fill="${cloth}"/><path d="M16 93a34 32 0 0 1 68 0" fill="none" ${st}/>`;
  s += `<circle cx="50" cy="38" r="18" fill="${SW[a.skin]}" ${st}/>`;
  const hr = v('hair');
  if (hr === 'Short' || hr === 'Long') s += `<path d="M32 36a18 18 0 0 1 36 0c-6-6-12-8-18-8s-12 2-18 8z" fill="${hair}" ${st}/>`;
  if (hr === 'Curly') s += [34, 42, 50, 58, 66].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 22 : 25}" r="6" fill="${hair}" ${st}/>`).join('');
  if (hr === 'Buzz') s += `<path d="M33 32a18 18 0 0 1 34 0" fill="none" stroke="${hair === '#ffffff' ? '#8c8c8c' : hair}" stroke-width="6"/>`;
  const e = v('eyes');
  if (e === 'Dots') s += `<circle cx="43" cy="37" r="2.4" fill="${ink}"/><circle cx="57" cy="37" r="2.4" fill="${ink}"/>`;
  if (e === 'Happy') s += `<path d="M39 38q4-5 8 0M53 38q4-5 8 0" fill="none" stroke="${ink}" stroke-width="2.2"/>`;
  if (e === 'Sleepy') s += `<path d="M39 37h8M53 37h8" stroke="${ink}" stroke-width="2.2"/>`;
  const m = v('mouth');
  if (m === 'Smile') s += `<path d="M44 45q6 5 12 0" fill="none" stroke="${ink}" stroke-width="2.2"/>`;
  if (m === 'Grin') s += `<path d="M43 44h14q-1 7-7 7t-7-7z" fill="${ink}"/>`;
  if (m === 'Flat') s += `<path d="M45 46h10" stroke="${ink}" stroke-width="2.2"/>`;
  const x = v('extra');
  if (x === 'Glasses') s += `<circle cx="43" cy="37" r="5.5" fill="none" stroke="${ink}" stroke-width="2"/><circle cx="57" cy="37" r="5.5" fill="none" stroke="${ink}" stroke-width="2"/><path d="M48.5 37h3" stroke="${ink}" stroke-width="2"/>`;
  if (x === 'Shades') s += `<path d="M36 33h12v6q-6 4-12 0zM52 33h12v6q-6 4-12 0z" fill="${ink}"/><path d="M48 34h4" stroke="${ink}" stroke-width="2"/>`;
  if (x === 'Freckles') s += [[41, 43], [44, 45], [56, 43], [59, 45]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1" fill="${ink}"/>`).join('');
  const h = v('hat');
  if (h === 'Beanie') s += `<path d="M31 30a19 19 0 0 1 38 0z" fill="${hair}" ${st}/><rect x="30" y="28" width="40" height="7" fill="${hair}" ${st}/>`;
  if (h === 'Cap') s += `<path d="M31 31a19 17 0 0 1 38 0z" fill="${hair}" ${st}/><path d="M60 31h20" ${st}/>`;
  if (h === 'Bucket') s += `<path d="M36 17h28l4 13H32z" fill="${hair}" ${st}/><path d="M26 31h48" ${st}/>`;
  if (h === 'Headphones') s += `<path d="M30 38a20 20 0 0 1 40 0" fill="none" stroke="${ink}" stroke-width="3"/><rect x="26" y="34" width="7" height="13" fill="${ink}"/><rect x="67" y="34" width="7" height="13" fill="${ink}"/>`;
  return s + '</svg>';
}

/* ---------- State ---------- */
const FRIENDS = ['rae', 'pip', 'jules', 'noor', 'dmitri', 'sam', 'lou', 'kit'];
export function initState() {
  return {
    playing: null,
    chips: new Set(),
    requests: ['[handle]'],
    friends: 8,
    comments: 12,
    likes: { p1: { n: 4, on: false }, p2: { n: 2, on: false }, p3: { n: 7, on: false } },
    unread: { c1: true, c3: true },
    spotify: false,
    songComments: [
      { who: '@[someone]', t: '2h', text: '[Their comment about this song]' },
      { who: '@[someone]', t: '1d', text: '[Their comment about this song]' },
    ],
    sendSel: new Set(['rae', 'jules']),
    msgs: [
      { day: 'Today' },
      { from: 'them', text: 'ok you HAVE to hear this' },
      { from: 'them', song: true },
      { stamp: '3h', side: 'them' },
      { from: 'me', text: 'wait this is so good' },
      { from: 'me', text: 'sending you one back later' },
      { stamp: 'Just now', side: 'me' },
    ],
    addState: { rae: 'friends', kit: 'requested', noor: 'add', sam: 'add', lou: 'add' },
    personFriend: true,
    avatar: { tab: 'outfit', top: 0, print: 0, outfitColor: 2, hair: 0, hairColor: 6, hat: 0, eyes: 0, mouth: 0, extra: 0, skin: 2, bg: 2 },
    draft: null,
    inputs: {},
  };
}

export function createScreenMarkup(id, S) {
  /* ---------- Template helpers ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const val = id => esc(S.inputs[id] || '');
  const av = (sz, extra = '') => `<span class="av ${sz < 44 ? 'thin' : ''}" style="--sz:${sz}px" ${extra}>${PERSON}</span>`;
  const art = sz => `<span class="art" style="--sz:${sz}px"></span>`;
  const play = (key, cls = '') => {
    const on = S.playing === key;
    return `<button class="play ${cls} ${on ? 'on' : ''}" type="button" data-action="play" data-key="${key}" aria-label="${on ? 'Pause' : 'Play'} preview">${on ? ic.pause : ic.play}</button>`;
  };
  const songRow = (key, opts = {}) => `<li><button class="row-main" type="button" ${opts.action ? `data-action="${opts.action}" data-key="${key}"` : 'data-go="song"'}>${opts.rank ? `<span class="rank">${opts.rank}</span>` : ''}${art(52)}<span class="tt"><b>[Song title]</b><span>[Artist]</span></span></button>${play(key)}</li>`;
  const searchBox = (id, ph, form) => `<form class="search" data-form="${form}" role="search">${ic.search}<input id="${id}" type="search" placeholder="${ph}" value="${val(id)}" autocomplete="off" aria-label="${ph}"></form>`;
  function tabbar(active) {
    const t = (id, label, icon) => `<button class="tab ${active === id ? 'on' : ''}" type="button" data-go="${id}" data-mode="tab" ${active === id ? 'aria-current="page"' : ''}>${icon}<span>${label}</span></button>`;
    return `<nav class="tabbar" aria-label="Main">${t('discover', 'Discover', ic.compass)}${t('friends', 'Friends', ic.people)}<span class="fab-slot"><button class="fab" type="button" data-go="drop-pick" aria-label="Drop a song">${ic.plus}</button></span>${t('chats', 'Chats', ic.chat)}${t('profile', 'Profile', ic.smile)}</nav>`;
  }
  const sheet = (inner, foot = '') => `<div class="scr sheet"><button class="scrim" type="button" data-action="dismiss" aria-label="Close"></button><div class="sheet-body"><span class="grabber"></span><div class="scroll">${inner}</div>${foot ? `<div class="sheet-foot">${foot}</div>` : ''}</div></div>`;
  const stepper = step => `<div class="stepper" aria-label="Step ${step} of 2"><span class="step ${step === 1 ? 'on' : ''}"><i>${step === 1 ? '1' : ic.check}</i>Pick a song</span><hr><span class="step ${step === 2 ? 'on' : 'todo'}"><i>2</i>Say why</span></div>`;

  /* ---------- Screens ---------- */
  const SCREENS = {
    signin: () => `<div class="scr"><div class="scroll signin">
      <h1 class="h-xl">Sleeve</h1>
      <p class="tagline">Say what songs mean to you. Share them with your friends.</p>
      <form class="card sh form" data-form="signin">
        <label class="label" for="si-email">Email</label>
        <input class="field" id="si-email" type="email" placeholder="you@example.com" value="${val('si-email')}" autocomplete="off">
        <label class="label" for="si-pass">Password</label>
        <input class="field" id="si-pass" type="password" placeholder="8+ characters" autocomplete="off">
        <button class="btn pri sh big block" type="submit">Sign in</button>
        <button class="link" type="button" data-missing="Forgot password">Forgot password?</button>
      </form>
      <div class="or">or</div>
      <div class="alt">
        <button class="btn block" type="button" data-go="discover" data-mode="tab">Continue with Apple</button>
        <button class="btn block" type="button" data-go="discover" data-mode="tab">Continue with Google</button>
      </div>
      <button class="link" type="button" data-missing="Create an account">New here? Create an account</button>
    </div></div>`,

    discover: () => `<div class="scr"><div class="scroll">
      <div class="head"><h1 class="h-page">Discover</h1><p class="lead">Find a song, hear a preview, read what people think.</p></div>
      ${searchBox('disc-q', 'Search songs or artists', 'search')}
      <div class="chips">${['Rainy day', 'Gym', 'Road trip', 'Focus', 'Throwbacks'].map(c => `<button class="chip" type="button" data-action="chip" data-key="${c}" aria-pressed="${S.chips.has(c)}">${c}</button>`).join('')}</div>
      <section class="card sh fill talk">
        <h2 class="h-card">Your friends are talking about</h2>
        <button class="talk-item" type="button" data-go="song"><b>[Song title] · [Artist]</b> (3 comments)</button>
        <button class="talk-item" type="button" data-go="song"><b>[Song title] · [Artist]</b> (1 comment)</button>
      </section>
      <section class="sec"><h2 class="h-sec">Top charts</h2>
        <ol class="rows">${[1, 2, 3, 4, 5].map(n => songRow('chart' + n, { rank: n })).join('')}</ol>
      </section>
    </div>${tabbar('discover')}</div>`,

    friends: () => `<div class="scr"><div class="scroll">
      <div class="title-row"><h1 class="h-page">Friends</h1><button class="btn sh" type="button" data-go="add-friends">+ Add</button></div>
      ${S.requests.length ? `<section class="card sh fill req"><h2 class="h-card">Friend requests</h2>
        ${S.requests.map(h => `<div class="req-row"><button class="bare who" type="button" data-go="person">${av(38)}<b>@${h}</b></button><button class="btn" type="button" data-action="decline">Decline</button><button class="btn pri" type="button" data-action="accept">Accept</button></div>`).join('')}
      </section>` : ''}
      <div class="strip">${[1, 2, 3, 4].map(() => `<button class="ftile" type="button" data-go="person">${av(60)}<span>@[friend]</span></button>`).join('')}</div>
      <h2 class="h-sec">What they’re saying</h2>
      ${[['p1', '2h'], ['p2', '9h'], ['p3', '1d']].map(([k, t]) => `<article class="card sh post">
        <header><button class="bare" type="button" data-go="person">${av(36)}<b>@[friend]</b></button><time>${t}</time></header>
        <p>[Their comment about the song: a memory, a moment, a line they can’t shake.]</p>
        <footer><button class="bare songline" type="button" data-go="song">${art(34)}<span><b>[Song]</b> · <span class="ar">[Artist]</span></span></button>
        <button class="like ${S.likes[k].on ? 'on' : ''}" type="button" data-action="like" data-key="${k}" aria-pressed="${S.likes[k].on}" aria-label="Like, ${S.likes[k].n} likes">${ic.heart}<span>${S.likes[k].n}</span></button></footer>
      </article>`).join('')}
    </div>${tabbar('friends')}</div>`,

    chats: () => `<div class="scr"><div class="scroll">
      <div class="head"><h1 class="h-page">Chats</h1><p class="lead">Talk music with your friends.</p></div>
      <ul class="rows">${[['c1', 'Sent you [Song title]', '3m'], ['c2', 'You: ok you win, this is a banger', '1h'], ['c3', 'the chorus!!', '5h'], ['c4', 'Say hi', '']].map(([k, msg, t]) =>
        `<li><button class="row-main chat-row" type="button" data-action="read" data-key="${k}" data-go="conversation">${av(52)}<span class="tt"><b>@[friend]</b><span>${msg}</span></span><span class="chat-meta">${t ? `<time>${t}</time>` : ''}${S.unread[k] ? '<i class="dot" aria-label="Unread"></i>' : ''}</span></button></li>`).join('')}</ul>
      <div class="dashed">
        <h3>Want more people to chat with?</h3>
        <p>You can message anyone who accepts your friend request.</p>
        <button class="btn pri sh" type="button" data-go="add-friends">Add friends</button>
      </div>
    </div>${tabbar('chats')}</div>`,

    profile: () => `<div class="scr"><div class="scroll">
      <div class="title-row"><h1 class="h-page">Profile</h1><button class="icon-btn" type="button" data-missing="Settings" aria-label="Settings">${ic.sun}</button></div>
      <section class="card sh fill me-card">
        <span class="av" style="--sz:140px">${avatarSVG(S.avatar)}</span>
        <h2 class="handle-xl">@[your handle]</h2>
        <p>[Your bio, up to 160 characters]</p>
        <div class="btn-row"><button class="btn sh" type="button" data-go="avatar">Edit avatar</button><button class="btn pri sh" type="button" data-missing="Edit profile">Edit profile</button></div>
      </section>
      <div class="stats">
        <div class="card sh stat"><b>${S.comments}</b><span>comments</span></div>
        <button class="card sh stat" type="button" data-go="friends" data-mode="tab"><b>${S.friends}</b><span>friends</span></button>
      </div>
      <section class="card sh spot">
        <h3>Spotify</h3>
        ${S.spotify
          ? '<p>Connected. Your top tracks show on your profile and in Discover.</p><button class="btn sh" type="button" data-action="spotify">Disconnect</button>'
          : '<p>Show your top tracks on your profile and in Discover.</p><button class="btn sh" type="button" data-action="spotify">Connect Spotify</button>'}
      </section>
    </div>${tabbar('profile')}</div>`,

    'drop-pick': () => sheet(`
      <div class="title-row"><h1 class="h-page">Drop a song</h1><button class="link" type="button" data-action="closeDrop">Cancel</button></div>
      <p class="lead roomy">Share what you’re into right now. Your friends see it in their feed, and it’s added to the song’s comments.</p>
      ${stepper(1)}
      ${searchBox('drop-q', 'Search for the song', 'search')}
      <section class="sec"><p class="kicker">Trending now</p>
        <ul class="rows">${[1, 2, 3, 4, 5, 6].map(n => songRow('trend' + n, { action: 'pick' })).join('')}</ul>
      </section>`),

    'drop-why': () => sheet(`
      <div class="title-row"><h1 class="h-page">Drop a song</h1><button class="link" type="button" data-action="closeDrop">Cancel</button></div>
      ${stepper(2)}
      <form class="card sh fill why" data-form="drop">
        <div class="picked">${art(56)}<span class="tt"><b>[Song title]</b><span>[Artist]</span></span><button class="btn sm" type="button" data-back>Change</button></div>
        <label class="label" for="drop-note">Your note</label>
        <textarea class="field" id="drop-note" rows="4" maxlength="500" placeholder="Why this song, why now?">${val('drop-note')}</textarea>
        <div class="helper"><span>Visible to your friends and on the song page</span><span id="drop-count">${(S.inputs['drop-note'] || '').length}/500</span></div>
        <button class="btn pri sh big block" type="submit">Drop it</button>
      </form>`),

    song: () => `<div class="scr"><div class="scroll">
      <button class="icon-btn back" type="button" data-back aria-label="Back">${ic.left}</button>
      <div class="cover">${COVER}</div>
      <div class="song-meta"><h1 class="song-title">[Song title]</h1><p class="song-sub">[Artist] · [Album]</p></div>
      <div class="song-actions">${play('song', 'sh')}<button class="btn sh" type="button" data-missing="Open in Spotify">Open in Spotify</button><button class="btn sh" type="button" data-go="send">Send</button></div>
      <h2 class="h-sec">Comments</h2>
      <form class="card sh fill composer" data-form="comment">
        <label class="label" for="song-c">What does this song mean to you?</label>
        <textarea class="field" id="song-c" rows="2" placeholder="A memory, a moment, a line you can’t shake…">${val('song-c')}</textarea>
        <button class="btn" type="submit">Post comment</button>
      </form>
      ${S.songComments.map(c => `<article class="card sh comment">
        <header><button class="bare" type="button" ${c.mine ? 'data-go="profile" data-mode="tab"' : 'data-go="person"'}>${art(36)}<b>${esc(c.who)}</b></button><time>${c.t}</time></header>
        <p>${esc(c.text)}</p>
      </article>`).join('')}
    </div></div>`,

    send: () => {
      const n = S.sendSel.size;
      return sheet(`
        <div class="title-row"><h1 class="h-page">Send to friends</h1><button class="link" type="button" data-back>Cancel</button></div>
        <div class="send-song">${art(48)}<span class="songline"><b>[Song title]</b> · <span class="ar">[Artist]</span></span></div>
        <div class="picks">${FRIENDS.map(f => `<button class="pick" type="button" data-action="sendPick" data-key="${f}" aria-pressed="${S.sendSel.has(f)}">${av(64)}<span class="chk">${ic.check}</span><span>@${f}</span></button>`).join('')}</div>
        <div class="msg-field"><label class="label" for="send-msg">Message (optional)</label><input class="field" id="send-msg" placeholder="Add a message" value="${val('send-msg')}" autocomplete="off"></div>
        <button class="btn pri sh big block" type="button" data-action="send" ${n ? '' : 'disabled'}>${n ? `Send to ${n} friend${n > 1 ? 's' : ''}` : 'Pick at least one friend'}</button>`);
    },

    conversation: () => `<div class="scr">
      <header class="convo-head"><button class="icon-btn" type="button" data-back aria-label="Back">${ic.left}</button><h1>@[friend]</h1><button class="bare" type="button" data-go="person" aria-label="View profile">${av(44)}</button></header>
      <div class="scroll msgs"><div class="msgs-inner">${S.msgs.map(m => {
        if (m.day) return `<p class="day">${m.day}</p>`;
        if (m.stamp) return `<p class="stamp ${m.side}">${m.stamp}</p>`;
        if (m.song) return `<div class="bub them bub-song"><button class="row-main" type="button" data-go="song">${art(52)}<span class="tt"><b>[Song title]</b><span>[Artist]</span></span></button>${play('dm')}</div>`;
        return `<p class="bub ${m.from}">${esc(m.text)}</p>`;
      }).join('')}</div></div>
      <form class="composer-bar" data-form="msg"><input class="field" id="msg-in" placeholder="Message" value="${val('msg-in')}" autocomplete="off" aria-label="Message"><button class="icon-btn" type="submit" aria-label="Send">${ic.right}</button></form>
    </div>`,

    person: () => `<div class="scr"><div class="scroll">
      <button class="icon-btn back" type="button" data-back aria-label="Back">${ic.left}</button>
      <section class="card sh fill me-card">
        ${av(128)}
        <h2 class="handle-xl">@[handle]</h2>
        <p>[Their bio]</p>
        <div class="btn-row"><button class="btn pri sh" type="button" data-go="conversation">Message</button>
        ${S.personFriend ? `<button class="btn sh" type="button" data-action="personFriend">Friends ${ic.check}</button>` : '<button class="btn sh" type="button" data-action="personFriend">+ Add friend</button>'}</div>
      </section>
      <h2 class="h-sec">Comments</h2>
      ${[1, 2].map(() => `<article class="card sh mini"><p>[Their comment about a song]</p><button class="bare songline" type="button" data-go="song">${art(34)}<span><b>[Song]</b> · <span class="ar">[Artist]</span></span></button></article>`).join('')}
    </div></div>`,

    'add-friends': () => `<div class="scr"><div class="scroll">
      <div class="title-row start"><button class="icon-btn" type="button" data-back aria-label="Back">${ic.left}</button><h1 class="h-page h-mid">Add friends</h1></div>
      ${searchBox('add-q', 'Search by @handle', 'addsearch')}
      <section class="card sh fill invite"><span class="tt"><b>Invite friends to Sleeve</b><span>Send a link by text or any app</span></span><button class="btn" type="button" data-missing="Share link">Share link</button></section>
      <ul class="rows" id="add-list">${addRows()}</ul>
    </div></div>`,

    avatar: () => {
      const d = S.draft || S.avatar, tab = AV_TABS.find(t => t.id === d.tab);
      return sheet(`
        <div class="av-head"><button class="link" type="button" data-action="dismiss">Cancel</button><h1>Your avatar</h1><button class="icon-btn" type="button" data-action="shuffle" aria-label="Shuffle">${ic.shuffle}</button></div>
        <span class="av av-preview" style="--sz:156px">${avatarSVG(d)}</span>
        <div class="seg" role="tablist">${AV_TABS.map(t => `<button type="button" role="tab" data-action="avTab" data-key="${t.id}" aria-selected="${t.id === d.tab}">${t.label}</button>`).join('')}</div>
        <hr class="rule">
        <div class="opts">
          ${tab.rows.map(([label, k]) => `<div class="opt"><span>${label}</span><button class="icon-btn" type="button" data-action="cycle" data-key="${k}:-1" aria-label="Previous ${label}">${ic.chevL}</button><output>${AVO[k][d[k]]}</output><button class="icon-btn" type="button" data-action="cycle" data-key="${k}:1" aria-label="Next ${label}">${ic.chevR}</button></div>`).join('')}
          ${tab.colors.map(([label, k]) => `<div class="swatch-group"><span>${label}</span><div class="swatches">${SW.map((c, i) => `<button class="sw" type="button" style="background:${c}" data-action="swatch" data-key="${k}:${i}" aria-pressed="${d[k] === i}" aria-label="${label} ${i + 1}"></button>`).join('')}</div></div>`).join('')}
        </div>`,
        '<button class="btn pri sh big block" type="button" data-action="saveAvatar">Save avatar</button>');
    },
  };

  const screenTemplates = new Map(Object.entries(SCREENS));
  function screenMarkup(id) {
    const template = screenTemplates.get(id);
    return typeof template === 'function' ? template() : SCREENS.signin();
  }

  function addRows() {
    const q = (S.inputs['add-q'] || '').replace(/^@/, '').trim().toLowerCase();
    const rows = Object.entries(S.addState).filter(([h]) => h.includes(q));
    if (!rows.length) return `<li class="empty">No one called @${esc(q)} yet. Share an invite link instead.</li>`;
    return rows.map(([h, st]) => {
      const label = { friends: 'Friends', requested: 'Requested', add: 'Add' }[st];
      return `<li><button class="row-main" type="button" data-go="person">${av(48)}<span class="tt"><b>@${h}</b><span>[Short bio]</span></span></button><button class="btn add-btn ${st === 'add' ? 'pri' : ''}" type="button" data-action="addFriend" data-key="${h}">${label}</button></li>`;
    }).join('');
  }


  return screenMarkup(id);
}
