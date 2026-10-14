const SESSION_KEY = 'melody-hifi-spotify-session'
const STATE_KEY = 'melody-hifi-spotify-state'
const VERIFIER_KEY = 'melody-hifi-spotify-verifier'

function clientId() {
  const value = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  if (!value) {
    throw new Error('Spotify is not configured yet. Add VITE_SPOTIFY_CLIENT_ID and register this page as a redirect URI.')
  }
  return value
}

function redirectUri() {
  return `${window.location.origin}${window.location.pathname}`
}

function base64Url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

async function sha256(value) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
}

function randomString(length = 64) {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, byte => String.fromCharCode(97 + byte % 26)).join('')
}

export async function startSpotifyAuth() {
  const verifier = randomString()
  const state = randomString(32)
  sessionStorage.setItem(VERIFIER_KEY, verifier)
  sessionStorage.setItem(STATE_KEY, state)
  const params = new URLSearchParams({
    client_id: clientId(),
    response_type: 'code',
    redirect_uri: redirectUri(),
    scope: 'user-top-read',
    code_challenge_method: 'S256',
    code_challenge: base64Url(await sha256(verifier)),
    state,
  })
  window.location.assign(`https://accounts.spotify.com/authorize?${params}`)
}

async function requestToken(params) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error_description || body.error || 'Spotify sign-in failed.')
  const previous = params.grant_type === 'refresh_token' ? readSession() : null
  const session = {
    ...body,
    refresh_token: body.refresh_token || previous?.refresh_token,
    expires_at: Date.now() + body.expires_in * 1000,
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export async function completeSpotifyAuth() {
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  if (!code && !error) return false

  const returnedState = url.searchParams.get('state')
  const expectedState = sessionStorage.getItem(STATE_KEY)
  const verifier = sessionStorage.getItem(VERIFIER_KEY)
  sessionStorage.removeItem(STATE_KEY)
  sessionStorage.removeItem(VERIFIER_KEY)
  url.searchParams.delete('code')
  url.searchParams.delete('state')
  url.searchParams.delete('error')
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)

  if (error) throw new Error(`Spotify sign-in was declined: ${error}.`)
  if (!expectedState || returnedState !== expectedState || !verifier) {
    throw new Error('Spotify sign-in could not be verified. Please connect again.')
  }
  await requestToken({
    client_id: clientId(),
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri(),
    code_verifier: verifier,
  })
  return true
}

function readSession() {
  const value = sessionStorage.getItem(SESSION_KEY)
  return value ? JSON.parse(value) : null
}

export function spotifyConnected() {
  return Boolean(readSession()?.access_token)
}

export function disconnectSpotify() {
  sessionStorage.removeItem(SESSION_KEY)
}

async function accessToken() {
  const session = readSession()
  if (!session?.access_token) throw new Error('Connect Spotify to search its music catalog.')
  if (Date.now() < session.expires_at - 60_000) return session.access_token
  if (!session.refresh_token) {
    disconnectSpotify()
    throw new Error('Your Spotify session expired. Connect again to continue.')
  }
  const refreshed = await requestToken({
    client_id: clientId(),
    grant_type: 'refresh_token',
    refresh_token: session.refresh_token,
  })
  return refreshed.access_token
}

async function spotifyRequest(path) {
  const token = await accessToken()
  const response = await fetch(`https://api.spotify.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const body = await response.json()
  if (!response.ok) {
    const message = body.error?.message || 'Spotify could not complete that request.'
    throw new Error(message)
  }
  return body
}

export async function searchSpotifyTracks(query) {
  if (!query.trim()) return []
  const result = await spotifyRequest(`search?type=track&limit=8&q=${encodeURIComponent(query.trim())}`)
  return result.tracks.items.map(track => ({
    id: track.id,
    title: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    album: track.album.name,
    image: track.album.images[0]?.url || '',
    url: track.external_urls.spotify,
  }))
}

export async function getTopTracks() {
  const result = await spotifyRequest('me/top/tracks?limit=5&time_range=short_term')
  return result.items.map(track => ({
    id: track.id,
    title: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    album: track.album.name,
    image: track.album.images[0]?.url || '',
    url: track.external_urls.spotify,
  }))
}
