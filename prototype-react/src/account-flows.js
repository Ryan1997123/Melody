import { AV_COLORS, AV_TABS, avatarLabel, avatarSVG, personAvatarSVG } from './avatars.js'

export const GENRES = ['Pop', 'Rock', 'Hip-hop', 'R&B', 'Indie', 'Electronic', 'Jazz', 'Classical', 'Country', 'Folk', 'Metal', 'Punk', 'Latin', 'K-pop']

export function accountFrames(nodes, darkNodes = []) {
  return [
    { id: 'join', name: 'Join Melody', group: 'Create an account', chain: ['signin'] },
    { id: 'check-email', name: 'Check your email', group: 'Create an account', chain: ['signin', 'join'] },
    { id: 'onboarding-avatar', name: 'Make your avatar', group: 'Create an account', chain: ['signin', 'join', 'check-email'] },
    { id: 'onboarding-genres', name: 'What do you listen to', group: 'Create an account', chain: ['signin', 'join', 'check-email', 'onboarding-avatar'] },
    { id: 'onboarding-friends', name: 'Find your friends', group: 'Create an account', chain: ['signin', 'join', 'check-email', 'onboarding-avatar', 'onboarding-genres'] },
    { id: 'welcome', name: "You're in", group: 'Create an account', chain: ['signin', 'join', 'check-email', 'onboarding-avatar', 'onboarding-genres', 'onboarding-friends'] },
    { id: 'settings', name: 'Settings', group: 'Profile', sheet: true, chain: ['profile'] },
    { id: 'logout', name: 'Log out?', group: 'Profile', sheet: true, chain: ['profile', 'settings'] },
  ].map((frame, index) => ({ ...frame, figmaNode: nodes[index], figmaDarkNode: darkNodes[index] }))
}

export function accountState() {
  return {
    handle: 'ryan',
    email: 'ryan@example.com',
    bio: 'Night drives, sad bangers and anything with a good bridge.',
    signupError: '',
    genres: new Set(),
    notifications: true,
    privateProfile: true,
    onboardingAvatar: null,
  }
}

export function accountAction(name, key, { state, mutate, navigate, toast, logout }) {
  switch (name) {
    case 'createAccount': {
      const handle = state.inputs['join-handle']?.trim() || ''
      const email = state.inputs['join-email']?.trim() || ''
      const password = state.inputs['join-password'] || ''
      const error = !/^[a-z0-9_]{3,20}$/.test(handle)
        ? 'Use 3–20 lowercase letters, numbers, or underscores for your handle.'
        : ['rae', 'pip', 'jules', 'noor', 'dmitri', 'sam', 'lou', 'kit'].includes(handle)
          ? 'That demo handle is taken. Try another one.'
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ? 'Enter a valid email address.'
            : password.length < 8 ? 'Use at least 8 characters for your demo password.' : ''
      mutate(next => {
        next.signupError = error
        if (!error) {
          next.handle = handle
          next.email = email
          delete next.inputs['join-password']
        }
      })
      if (error) toast(error)
      else navigate('check-email')
      break
    }
    case 'emailApp': toast('Prototype only: no email was sent. Use Continue with demo verification.'); break
    case 'signupProvider': toast(`${key} sign-up is not connected in this prototype. Use the demo form.`); break
    case 'resendEmail': toast('Prototype only: no verification email is sent.'); break
    case 'verifyDemo': navigate('onboarding-avatar'); break
    case 'genre':
      mutate(next => { if (next.genres.has(key)) next.genres.delete(key); else next.genres.add(key) })
      break
    case 'saveOnboardingAvatar':
      mutate(next => { next.avatar = { ...(next.onboardingAvatar || next.avatar) } })
      navigate('onboarding-genres')
      break
    case 'nextGenres':
      if (state.genres.size < 3) toast('Pick at least 3 genres to continue.')
      else navigate('onboarding-friends')
      break
    case 'onboardingFriend':
      mutate(next => { next.addState[key] = next.addState[key] === 'requested' ? 'add' : 'requested' })
      break
    case 'invite':
      navigator.clipboard.writeText(`${location.origin}${location.pathname}#/join`)
        .then(() => toast('Invite link copied'))
        .catch(() => toast('Could not copy the invite link. Copy this page URL and add #/join.'))
      break
    case 'notifications': mutate(next => { next.notifications = !next.notifications }); break
    case 'privacy': mutate(next => { next.privateProfile = !next.privateProfile }); break
    case 'help': toast('Prototype feedback: report issues in the Melody GitHub repository.'); break
    case 'logout': logout(); break
    default: return false
  }
  return true
}

export function accountScreens(S, { esc, sheet, profile, themePreference = 'system', realSpotify = false }) {
  const input = (id, label, type = 'text') => `<label class="label" for="${id}">${label}</label><input class="field" id="${id}" type="${type}" value="${esc(S.inputs[id] || '')}" autocomplete="off">`
  const progress = (step, title) => `<div class="onboarding-progress" aria-label="Step ${step} of 4">${[1, 2, 3, 4].map(n => `<i class="${n <= step ? 'on' : ''}"></i>`).join('')}</div><p class="helper">Step ${step} of 4 · ${title}</p>`
  const page = (title, step, content) => `<div class="scr"><div class="scroll onboarding"><button class="icon-btn" type="button" data-back aria-label="Back">←</button>${step ? progress(step, title) : ''}<h1 class="h-page">${title}</h1>${content}</div></div>`
  const handle = S.inputs['join-handle'] || ''
  const validHandle = /^[a-z0-9_]{3,20}$/.test(handle)
  const available = validHandle && !['rae', 'pip', 'jules', 'noor', 'dmitri', 'sam', 'lou', 'kit'].includes(handle)
  const d = S.onboardingAvatar || S.avatar
  const tab = AV_TABS.find(item => item.id === d.tab)
  const friendQuery = (S.inputs['onboarding-q'] || '').toLowerCase().replace(/^@/, '')
  const people = ['noor', 'dmitri', 'sam', 'lou', 'kit'].filter(name => name.includes(friendQuery))
  return {
    join: () => page('Join Melody', 1, `
      <p class="lead">Find your people through the songs you love.</p>
      <p class="prototype-note">Demo only: no real account is created. Use a made-up password.</p>
      <form class="card sh form" data-form="join" novalidate>
        ${input('join-handle', 'Handle')}
        <p class="helper available" role="status">${available ? 'Available in this demo' : validHandle ? 'Taken in this demo' : '3–20 lowercase letters, numbers, or underscores'}</p>
        ${input('join-email', 'Email', 'email')}${input('join-password', 'Demo password', 'password')}
        <p class="error" role="alert">${esc(S.signupError)}</p>
        <button class="btn pri sh block" type="submit">Create account</button>
      </form>
      <button class="btn block" type="button" data-action="signupProvider" data-key="Apple">Continue with Apple</button>
      <button class="btn block" type="button" data-action="signupProvider" data-key="Google">Continue with Google</button>
      <button class="link" type="button" data-go="signin">Have an account? Sign in</button>`),
    'check-email': () => page('Check your email', 1, `
      <p>In a real account flow, we would send a verification link to <b>${esc(S.email)}</b>.</p>
      <p class="prototype-note">No email is sent by this prototype.</p>
      <button class="btn pri sh" type="button" data-action="emailApp">Open email app</button>
      <button class="link" type="button" data-action="resendEmail">Resend link</button>
      <button class="link" type="button" data-go="join">Wrong email? Change it</button>
      <button class="btn sh block" type="button" data-action="verifyDemo">Continue with demo verification</button>`),
    'onboarding-avatar': () => page('Make your avatar', 2, `
      <div class="title-row"><span class="av av-preview" style="--sz:140px">${avatarSVG(d)}</span><button class="icon-btn" type="button" data-action="shuffle" aria-label="Shuffle">↝</button></div>
      <div class="seg" role="tablist">${AV_TABS.map(item => `<button type="button" role="tab" data-action="avTab" data-key="${item.id}" aria-selected="${item.id === d.tab}">${item.label}</button>`).join('')}</div>
      <div class="opts">${tab.rows.map(([label, key]) => `<div class="opt"><span>${label}</span><button class="icon-btn" type="button" data-action="cycle" data-key="${key}:-1" aria-label="Previous ${label}">‹</button><output>${avatarLabel(key, d[key])}</output><button class="icon-btn" type="button" data-action="cycle" data-key="${key}:1" aria-label="Next ${label}">›</button></div>`).join('')}
      ${tab.colors.map(([label, key]) => `<div class="swatch-group"><span>${label}</span><div class="swatches">${AV_COLORS[key].map((color, index) => `<button class="sw" type="button" style="background:${color}" data-action="swatch" data-key="${key}:${index}" aria-pressed="${d[key] === index}" aria-label="${label} ${index + 1}"></button>`).join('')}</div></div>`).join('')}</div>
      <button class="btn pri sh block" type="button" data-action="saveOnboardingAvatar">Next</button>`),
    'onboarding-genres': () => page('What do you listen to?', 3, `
      <p>Pick at least 3 genres. You can change your mind later.</p>
      <div class="chips genre-chips">${GENRES.map(genre => `<button class="chip" type="button" data-action="genre" data-key="${genre}" aria-pressed="${S.genres.has(genre)}">${genre}</button>`).join('')}</div>
      <p role="status">${S.genres.size} selected · at least 3 required</p>
      <section class="card sh"><h2 class="h-card">Spotify (optional)</h2><p>${realSpotify ? 'Connecting opens Spotify authorization. You can skip it and continue here.' : 'Demo connection only; no Spotify authorization.'}</p>${S.spotifyError ? `<p role="alert">${esc(S.spotifyError)}</p>` : ''}<button class="btn mint sh" type="button" data-action="spotify">${S.spotify ? 'Disconnect' : 'Connect Spotify'}</button></section>
      <button class="btn pri sh block" type="button" data-action="nextGenres" ${S.genres.size < 3 ? 'disabled' : ''}>Next</button>`),
    'onboarding-friends': () => page('Find your friends', 4, `
      <label class="label" for="onboarding-q">Search by @handle</label><input class="field" id="onboarding-q" type="search" value="${esc(S.inputs['onboarding-q'] || '')}">
      <section class="card sh invite"><h2 class="h-card">Invite friends to Melody</h2><button class="btn sh" type="button" data-action="invite">Share invite link</button></section>
      <h2 class="h-sec">People you might know</h2>
      <ul class="rows">${people.map(name => `<li><span class="av" style="--sz:44px">${personAvatarSVG(name)}</span><b>@${name}</b><button class="btn ${S.addState[name] === 'requested' ? '' : 'pri'}" type="button" data-action="onboardingFriend" data-key="${name}" aria-pressed="${S.addState[name] === 'requested'}">${S.addState[name] === 'requested' ? 'Requested' : 'Add'}</button></li>`).join('')}</ul>
      ${people.length ? '' : '<p role="status">No people match that handle.</p>'}
      <button class="btn pri sh block" type="button" data-go="welcome">Finish</button>
      <button class="link" type="button" data-go="welcome">Skip for now</button>`),
    welcome: () => page("You're in", 0, `
      <section class="card sh fill me-card"><span class="welcome-star" aria-hidden="true">✦</span><span class="welcome-avatar"><span class="av" style="--sz:140px">${avatarSVG(S.avatar)}</span></span><h2>@${esc(S.handle)}</h2><p>Welcome to Melody. Find a song that feels like you.</p></section>
      <button class="btn pri sh block" type="button" data-go="drop-pick">Drop your first song</button>
      <button class="btn sh block" type="button" data-go="discover">Explore Discover</button>`),
    settings: () => sheet(`
      <div class="title-row"><h1 class="h-page">Settings</h1><button class="link" type="button" data-back>Done</button></div>
      <section class="card sh settings-account"><span class="av" style="--sz:64px">${avatarSVG(S.avatar)}</span><div><b>@${esc(S.handle)}</b><p>${esc(S.email)}</p></div></section>
      <h2 class="h-sec">Preferences</h2><div class="settings-list">
        <button class="settings-row" type="button" data-action="notifications" aria-pressed="${S.notifications}"><span>Notifications</span><b>${S.notifications ? 'On' : 'Off'}</b></button>
        <button class="settings-row" type="button" data-action="privacy"><span>Privacy</span><b>${S.privateProfile ? 'Friends only' : 'Public'}</b></button>
        <button class="settings-row" type="button" data-action="spotify"><span>Spotify</span><b>${S.spotify ? 'Connected' : 'Not connected'}</b></button>
        <label class="settings-row"><span>Appearance</span><select data-theme-select aria-label="Appearance"><option value="system" ${themePreference === 'system' ? 'selected' : ''}>System</option><option value="light" ${themePreference === 'light' ? 'selected' : ''}>Light</option><option value="dark" ${themePreference === 'dark' ? 'selected' : ''}>Dark</option></select></label>
        <button class="settings-row" type="button" data-action="help">Help &amp; feedback</button>
      </div><p class="prototype-note">Preferences are simulated in this browser; no server settings are changed.</p>
      ${S.spotifyError ? `<p role="alert">${esc(S.spotifyError)}</p>` : ''}
      <button class="btn sh block" type="button" data-go="logout">Log out</button>
      <p class="helper">Melody 0.1 · Terms · Privacy (prototype)</p>`),
    logout: () => `<div class="scr logout-screen"><div inert aria-hidden="true">${profile().replace('class="scroll"', 'class="profile-backdrop"')}</div><div class="scroll logout-layer"><section class="card sh logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title"><h1 class="h-page" id="logout-title">Log out of Melody?</h1><p>You'll need your email and password to sign back in. Your drops, comments and chats stay saved.</p><p class="prototype-note">Demo data stays during this visit, but resets if you refresh the page.</p><button class="btn pri sh block" type="button" data-action="logout">Log out</button><button class="btn block" type="button" data-back>Cancel</button></section></div></div>`,
  }
}
