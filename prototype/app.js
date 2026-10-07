(() => {
  /* ---------- Frames ---------- */
  const FRAMES = [
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
  const byId = Object.fromEntries(FRAMES.map((f, i) => [f.id, { ...f, n: i + 1 }]));
  const TABS = ['discover', 'friends', 'chats', 'profile'];
  const validScreen = id => Object.prototype.hasOwnProperty.call(byId, id);

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
  const SW = ['#ffffff', '#ebebeb', '#e0e0e0', '#c4c4c4', '#a6a6a6', '#969696', '#7a7a7a', '#5c5c5c'];
  const AVO = {
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
  function initState() {
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
  let S = initState();
  let stack = ['signin'];
  let historyIndex = 0;
  const cur = () => stack[stack.length - 1];

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
      <h1 class="h-xl">Melody</h1>
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
      <section class="card sh fill invite"><span class="tt"><b>Invite friends to Melody</b><span>Send a link by text or any app</span></span><button class="btn" type="button" data-missing="Share link">Share link</button></section>
      <ul class="rows" id="add-list">${addRows()}</ul>
    </div></div>`,

    avatar: () => {
      if (!S.draft) S.draft = { ...S.avatar };
      const d = S.draft, tab = AV_TABS.find(t => t.id === d.tab);
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

  /* ---------- Rendering & navigation ---------- */
  const app = document.getElementById('app');
  const frame = document.getElementById('frame');
  const screen = document.getElementById('screen');
  const orig = document.getElementById('orig');
  const toastEl = document.getElementById('toast');
  const frameList = document.getElementById('frameList');
  const linksEl = document.getElementById('links');
  const pill = document.getElementById('pill');
  const hotToggle = document.getElementById('hotToggle');
  const origToggle = document.getElementById('origToggle');

  function render(anim) {
    const id = cur();
    screen.dataset.screen = id;
    screen.innerHTML = screenMarkup(id);
    screen.className = 'screen';
    if (anim) { void screen.offsetWidth; screen.classList.add('a-' + anim); }
    afterRender(id);
    updateChrome(id);
  }
  function refresh() {
    const sc = screen.querySelector('.scroll');
    const top = sc ? sc.scrollTop : 0;
    const focusId = document.activeElement && screen.contains(document.activeElement) ? document.activeElement.id : null;
    screen.innerHTML = screenMarkup(cur());
    screen.className = 'screen';
    const sc2 = screen.querySelector('.scroll');
    if (sc2) sc2.scrollTop = top;
    if (focusId) document.getElementById(focusId)?.focus();
    updateChrome(cur());
  }
  function afterRender(id) {
    if (id === 'conversation') { const m = screen.querySelector('.msgs'); m.scrollTop = m.scrollHeight; }
  }
  function nav(id, mode) {
    if (!validScreen(id)) return;
    const from = cur();
    if (id === from) return;
    stack.push(id);
    historyIndex += 1;
    writeHistory('pushState');
    const toSheet = byId[id].sheet, fromSheet = byId[from].sheet;
    render(mode === 'tab' && TABS.includes(from) ? 'fade' : toSheet && !fromSheet ? 'up' : 'push');
  }
  function back() {
    if (stack.length < 2) return;
    if (historyIndex > 0) { history.back(); return; }
    const leaving = stack.pop();
    if (leaving === 'avatar') S.draft = null;
    writeHistory('replaceState');
    render(byId[leaving].sheet && !byId[cur()].sheet ? 'fade' : 'back');
  }
  function popWhile(pred) {
    let count = 0;
    while (stack.length - count > 1 && pred(stack[stack.length - 1 - count])) count += 1;
    if (count && count <= historyIndex) { history.go(-count); return; }
    while (stack.length > 1 && pred(cur())) stack.pop();
    historyIndex = 0;
    writeHistory('replaceState');
    render('fade');
  }
  function jump(id) {
    if (id !== 'avatar') S.draft = null;
    nav(id);
  }

  /* History entries retain the navigation stack, including across refreshes. */
  function routeId() {
    const id = location.hash.replace(/^#\/?/, '');
    return validScreen(id) ? id : 'signin';
  }
  function writeHistory(method) {
    history[method]({ melody: { stack: [...stack], index: historyIndex } }, '', '#/' + cur());
  }
  function restoreRoute() {
    const id = routeId();
    const saved = history.state?.melody;
    const from = cur(), previousIndex = historyIndex;
    if (saved && Array.isArray(saved.stack) && saved.stack.length &&
        saved.stack.every(validScreen) && saved.stack[saved.stack.length - 1] === id &&
        Number.isInteger(saved.index) && saved.index >= 0 && saved.index < saved.stack.length) {
      if (cur() === id && historyIndex === saved.index && location.hash === '#/' + id) return;
      stack = [...saved.stack];
      historyIndex = saved.index;
    } else {
      stack.push(id);
      historyIndex += 1;
    }
    if (from === 'avatar' && id !== 'avatar') S.draft = null;
    writeHistory('replaceState');
    render(historyIndex < previousIndex ? 'back' : 'fade');
  }

  let toastTimer;
  function toast(msg) {
    toastEl.innerHTML = `<span>${esc(msg)}</span>`;
    toastEl.style.bottom = screen.querySelector('.tabbar, .sheet-foot, .composer-bar') ? '' : '40px';
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  let flashTimer;
  function flashHotspots() {
    if (hotToggle.checked) return;
    frame.classList.add('hot');
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => frame.classList.toggle('hot', hotToggle.checked), 650);
  }

  /* ---------- Actions ---------- */
  const ACTIONS = {
    play: key => { S.playing = S.playing === key ? null : key; refresh(); },
    chip: key => { S.chips.has(key) ? S.chips.delete(key) : S.chips.add(key); refresh(); },
    like: key => { const l = S.likes[key]; l.on = !l.on; l.n += l.on ? 1 : -1; refresh(); },
    accept: () => { S.requests = []; S.friends += 1; refresh(); toast('You and @[handle] are friends now'); },
    decline: () => { S.requests = []; refresh(); toast('Request declined'); },
    read: key => { S.unread[key] = false; },
    spotify: () => { S.spotify = !S.spotify; refresh(); toast(S.spotify ? 'Spotify connected' : 'Spotify disconnected'); },
    pick: () => nav('drop-why'),
    closeDrop: () => popWhile(id => id.startsWith('drop-')),
    dismiss: () => (cur().startsWith('drop-') ? ACTIONS.closeDrop() : back()),
    sendPick: key => { S.sendSel.has(key) ? S.sendSel.delete(key) : S.sendSel.add(key); refresh(); },
    send: () => { const n = S.sendSel.size; S.inputs['send-msg'] = ''; back(); toast(`Sent to ${n} friend${n > 1 ? 's' : ''}`); },
    personFriend: () => {
      S.personFriend = !S.personFriend; S.friends += S.personFriend ? 1 : -1; refresh();
      toast(S.personFriend ? 'Friend request sent' : 'Removed from friends');
    },
    addFriend: key => {
      const st = S.addState[key];
      if (st === 'friends') return nav('person');
      S.addState[key] = st === 'add' ? 'requested' : 'add';
      document.getElementById('add-list').innerHTML = addRows();
      toast(st === 'add' ? `Request sent to @${key}` : `Request to @${key} cancelled`);
    },
    avTab: key => { S.draft.tab = key; refresh(); },
    cycle: key => { const [k, dir] = key.split(':'); const len = AVO[k].length; S.draft[k] = (S.draft[k] + Number(dir) + len) % len; refresh(); },
    swatch: key => { const [k, i] = key.split(':'); S.draft[k] = Number(i); refresh(); },
    shuffle: () => {
      const r = n => Math.floor(Math.random() * n);
      Object.keys(AVO).forEach(k => { S.draft[k] = r(AVO[k].length); });
      ['outfitColor', 'hairColor', 'skin', 'bg'].forEach(k => { S.draft[k] = r(SW.length); });
      refresh();
    },
    saveAvatar: () => { S.avatar = { ...S.draft }; back(); toast('Avatar saved'); },
  };

  const FORMS = {
    signin: () => nav('discover', 'tab'),
    search: () => toast('No frame for search results yet'),
    addsearch: () => {},
    drop: () => {
      const note = (S.inputs['drop-note'] || '').trim();
      S.songComments.unshift({ who: '@[you]', t: 'now', text: note || '[Your note]', mine: true });
      S.comments += 1;
      S.inputs['drop-note'] = '';
      popWhile(id => id.startsWith('drop-'));
      toast('Dropped. Your friends will see it in their feed');
    },
    comment: () => {
      const text = (S.inputs['song-c'] || '').trim();
      if (!text) { toast('Write something first'); document.getElementById('song-c').focus(); return; }
      S.songComments.unshift({ who: '@[you]', t: 'now', text, mine: true });
      S.comments += 1;
      S.inputs['song-c'] = '';
      refresh();
      toast('Comment posted');
    },
    msg: () => {
      const text = (S.inputs['msg-in'] || '').trim();
      if (!text) return;
      const last = S.msgs[S.msgs.length - 1];
      if (last && last.stamp && last.side === 'me') S.msgs.splice(S.msgs.length - 1, 0, { from: 'me', text });
      else S.msgs.push({ from: 'me', text }, { stamp: 'Just now', side: 'me' });
      S.inputs['msg-in'] = '';
      refresh();
      afterRender('conversation');
      document.getElementById('msg-in').focus();
    },
  };

  screen.addEventListener('click', e => {
    const t = e.target.closest('[data-go],[data-back],[data-action],[data-missing]');
    if (!t) {
      if (!e.target.closest('input, textarea, label, button, form.search')) flashHotspots();
      return;
    }
    if (t.disabled) return;
    if (t.dataset.action) ACTIONS[t.dataset.action](t.dataset.key, t);
    if (t.dataset.missing) toast(`No frame for “${t.dataset.missing}” yet`);
    if ('back' in t.dataset) back();
    if (t.dataset.go) nav(t.dataset.go, t.dataset.mode);
  });
  screen.addEventListener('submit', e => {
    e.preventDefault();
    FORMS[e.target.dataset.form]?.(e.target);
  });
  screen.addEventListener('input', e => {
    const el = e.target;
    if (!el.id) return;
    S.inputs[el.id] = el.value;
    if (el.id === 'drop-note') document.getElementById('drop-count').textContent = `${el.value.length}/500`;
    if (el.id === 'add-q') document.getElementById('add-list').innerHTML = addRows();
  });

  /* ---------- Chrome ---------- */
  function buildFrameList() {
    let html = '', group = '';
    FRAMES.forEach((f, i) => {
      if (f.group !== group) { group = f.group; html += `<p class="group">${group}</p>`; }
      html += `<button class="fr" type="button" data-frame="${f.id}"><span class="n">${String(i + 1).padStart(2, '0')}</span>${f.name}${f.sheet ? '<span class="tag">Sheet</span>' : ''}</button>`;
    });
    frameList.innerHTML = html;
  }
  function updateChrome(id) {
    const f = byId[id];
    frameList.querySelectorAll('.fr').forEach(b => b.setAttribute('aria-current', String(b.dataset.frame === id)));
    document.getElementById('frameName').textContent = f.name;
    document.getElementById('frameNum').textContent = `${String(f.n).padStart(2, '0')} / ${FRAMES.length}`;
    pill.innerHTML = `${String(f.n).padStart(2, '0')}/${FRAMES.length} · ${esc(f.name)} ${ic.chevD}`;
    orig.src = 'wireframes/' + f.file;
    orig.alt = `Original ${f.name} wireframe`;
    const targets = [];
    const seen = new Set();
    screen.querySelectorAll('[data-go]').forEach(el => {
      const go = el.dataset.go;
      if (seen.has(go) || go === id) return;
      seen.add(go);
      targets.push({ go, el });
    });
    let html = '';
    const backEl = screen.querySelector('[data-back]') || screen.querySelector('[data-action="dismiss"]');
    if (stack.length > 1 && backEl) html += `<button type="button" data-link="back">← ${esc(byId[stack[stack.length - 2]].name)}</button>`;
    html += targets.map((t, i) => `<button type="button" data-link="${i}">${esc(byId[t.go].name)}</button>`).join('');
    linksEl.innerHTML = html || '<span class="none">None. Use the frame list.</span>';
    linksEl.onclick = e => {
      const b = e.target.closest('[data-link]');
      if (!b) return;
      if (b.dataset.link === 'back') backEl.click();
      else targets[Number(b.dataset.link)].el.click();
      closePanel();
    };
  }

  function closePanel() { app.classList.remove('open'); pill.setAttribute('aria-expanded', 'false'); }
  frameList.addEventListener('click', e => {
    const b = e.target.closest('[data-frame]');
    if (!b) return;
    jump(b.dataset.frame);
    closePanel();
  });
  pill.addEventListener('click', () => { app.classList.add('open'); pill.setAttribute('aria-expanded', 'true'); });
  document.getElementById('panelClose').addEventListener('click', closePanel);
  const step = d => { const i = byId[cur()].n - 1; jump(FRAMES[(i + d + FRAMES.length) % FRAMES.length].id); };
  document.getElementById('prevBtn').addEventListener('click', () => step(-1));
  document.getElementById('nextBtn').addEventListener('click', () => step(1));
  document.getElementById('restartBtn').addEventListener('click', () => { S = initState(); nav('signin'); refresh(); closePanel(); });
  hotToggle.addEventListener('change', () => frame.classList.toggle('hot', hotToggle.checked));
  origToggle.addEventListener('change', () => { orig.hidden = !origToggle.checked; });
  document.addEventListener('keydown', e => {
    if (e.target.closest('input:not([type="checkbox"]), textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 's' || e.key === 'S') {
      const enabled = app.classList.toggle('dev');
      if (enabled) { app.classList.add('open'); pill.setAttribute('aria-expanded', 'true'); }
      else { closePanel(); hotToggle.checked = origToggle.checked = false; frame.classList.remove('hot'); orig.hidden = true; }
    }
    else if (e.key === 'Escape') { if (app.classList.contains('open')) closePanel(); else if (stack.length > 1) (screen.querySelector('[data-action="dismiss"]') ? ACTIONS.dismiss() : back()); }
    else if (!app.classList.contains('dev')) return;
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'h' || e.key === 'H') { hotToggle.checked = !hotToggle.checked; hotToggle.dispatchEvent(new Event('change')); }
    else if (e.key === 'o' || e.key === 'O') { origToggle.checked = !origToggle.checked; origToggle.dispatchEvent(new Event('change')); }
  });

  /* Scale the 390x844 frame to fit the canvas */
  const stage = document.getElementById('stage');
  const frameBox = document.getElementById('frameBox');
  const mobile = matchMedia('(max-width: 719px)');
  function fit() {
    if (mobile.matches) { frameBox.style.setProperty('--s', 1); return; }
    const cs = getComputedStyle(stage);
    const w = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const h = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const s = Math.max(0.35, Math.min(1, w / 390, h / 844));
    frameBox.style.setProperty('--s', s.toFixed(4));
  }
  new ResizeObserver(fit).observe(stage);
  fit();

  buildFrameList();
  const start = routeId();
  const saved = history.state?.melody;
  if (saved && Array.isArray(saved.stack) && saved.stack.length &&
      saved.stack.every(validScreen) && saved.stack[saved.stack.length - 1] === start &&
      Number.isInteger(saved.index) && saved.index >= 0 && saved.index < saved.stack.length) {
    stack = [...saved.stack];
    historyIndex = saved.index;
  } else {
    const initialStack = [...(byId[start].chain || []), start];
    stack = [];
    initialStack.forEach((id, index) => {
      stack.push(id);
      historyIndex = index;
      writeHistory(index ? 'pushState' : 'replaceState');
    });
  }
  writeHistory('replaceState');
  render();
  if (new URLSearchParams(location.search).has('dev')) app.classList.add('dev');
  window.addEventListener('popstate', restoreRoute);
  window.addEventListener('hashchange', restoreRoute);
})();
