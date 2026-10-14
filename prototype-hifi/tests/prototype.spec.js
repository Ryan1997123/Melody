import { test, expect } from '@playwright/test'
import { FRAMES } from '../src/screens.js'
import { initialAvatar } from '../src/avatars.js'
import { CURATED_TRACKS, DISCOVER_BATCH_SIZE, DISCOVER_MOODS, SAMPLE_TRACKS, filterDiscoverTracks } from '../src/data.js'

async function loadAllDiscoverSongs(page, total) {
  const rows = page.locator('.discover-results li')
  while (await rows.count() < total) {
    const before = await rows.count()
    await page.getByRole('button', { name: 'Load more songs', exact: true }).scrollIntoViewIfNeeded()
    await expect.poll(() => rows.count()).toBeGreaterThan(before)
  }
}

test('Discover shows a loading indicator before appending exactly 10 more songs on scroll', async ({ page }) => {
  await page.clock.install()
  await page.goto('/#/discover')
  const rows = page.locator('.discover-results li')
  await expect(rows).toHaveCount(10)
  await page.clock.pauseAt(new Date(Date.now() + 1000))
  await page.getByRole('button', { name: 'Load more songs', exact: true }).scrollIntoViewIfNeeded()
  const loading = page.getByRole('status').filter({ hasText: 'Loading more songs' })
  await expect(loading).toBeVisible()
  await expect(rows).toHaveCount(10)
  await expect(page.getByRole('button', { name: 'Load more songs', exact: true })).toBeDisabled()
  await page.clock.runFor(449)
  await expect(rows).toHaveCount(10)
  await page.clock.runFor(1)
  await expect(rows).toHaveCount(20)
  await expect(loading).toHaveCount(0)
  await page.getByRole('button', { name: 'Load more songs', exact: true }).scrollIntoViewIfNeeded()
  await expect(loading).toBeVisible()
  await page.clock.runFor(450)
  await expect(rows).toHaveCount(30)
})

test('Changing a mood during loading cancels the pending batch', async ({ page }) => {
  await page.addInitScript(() => {
    window.IntersectionObserver = class {
      observe() {}
      disconnect() {}
    }
  })
  await page.clock.install()
  await page.goto('/#/discover')
  await page.clock.pauseAt(new Date(Date.now() + 1000))
  const rows = page.locator('.discover-results li')
  await page.getByRole('button', { name: 'Load more songs', exact: true }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Loading more songs' })).toBeVisible()
  await page.getByRole('button', { name: 'Rainy day', exact: true }).click()
  await page.clock.runFor(1000)
  await expect(rows).toHaveCount(10)
  await expect(page.getByRole('status').filter({ hasText: 'Loading more songs' })).toHaveCount(0)
  expect(await rows.evaluateAll(elements => elements.map(el => el.dataset.trackId))).toEqual(
    filterDiscoverTracks(CURATED_TRACKS, '', new Set(['Rainy day'])).slice(0, 10).map(track => track.id),
  )
})

test('Curated library has 100+ unique Spotify songs and at least 20 for each mood', () => {
  expect(CURATED_TRACKS.length).toBeGreaterThanOrEqual(100)
  expect(new Set(CURATED_TRACKS.map(track => track.id)).size).toBe(CURATED_TRACKS.length)
  for (const track of CURATED_TRACKS) {
    expect(track.id).toMatch(/^[A-Za-z0-9]{22}$/)
    expect(track.title).toBeTruthy()
    expect(track.artist).toBeTruthy()
    expect(track.album).toBeTruthy()
    expect(track.moods.length).toBeGreaterThan(0)
    for (const mood of track.moods) expect(DISCOVER_MOODS).toContain(mood)
  }
  for (const mood of DISCOVER_MOODS) {
    expect(filterDiscoverTracks(CURATED_TRACKS, '', new Set([mood])).length).toBeGreaterThanOrEqual(20)
  }
})

test('Discover defers artwork and rows, and resets batches for each mood and search', async ({ page }) => {
  const artworkIds = new Set()
  await page.route('https://open.spotify.com/oembed**', route => {
    artworkIds.add(new URL(new URL(route.request().url()).searchParams.get('url')).pathname.split('/').at(-1))
    return route.fulfill({ json: { thumbnail_url: '' } })
  })
  await page.goto('/#/discover')
  const rows = page.locator('.discover-results li')
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
  await expect.poll(() => artworkIds.size).toBe(DISCOVER_BATCH_SIZE)
  await page.getByRole('button', { name: 'Load more songs', exact: true }).scrollIntoViewIfNeeded()
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE * 2)
  await expect.poll(() => artworkIds.size).toBe(DISCOVER_BATCH_SIZE * 2)
  for (const mood of DISCOVER_MOODS) {
    const chip = page.getByRole('button', { name: mood, exact: true })
    await chip.click()
    const expected = filterDiscoverTracks(CURATED_TRACKS, '', new Set([mood]))
    await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
    await expect(page.locator('.discover-results')).toContainText(`Showing ${DISCOVER_BATCH_SIZE} of ${expected.length} songs`)
    await loadAllDiscoverSongs(page, expected.length)
    expect(await rows.evaluateAll(elements => elements.map(el => el.dataset.trackId))).toEqual(expected.map(track => track.id))
    await chip.click()
    await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
  }
  const search = page.getByRole('searchbox', { name: 'Search songs or artists' })
  await search.fill('Daft Punk')
  await search.press('Enter')
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
  await loadAllDiscoverSongs(page, filterDiscoverTracks(CURATED_TRACKS, 'Daft Punk', new Set()).length)
  await expect(rows).toHaveCount(27)
  await page.getByRole('button', { name: 'Clear search', exact: true }).click()
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
})

test('Discover Load more supports keyboard access without automatic observation', async ({ page }) => {
  await page.addInitScript(() => {
    window.IntersectionObserver = class {
      observe() {}
      disconnect() {}
    }
  })
  await page.goto('/#/discover')
  const rows = page.locator('.discover-results li')
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
  const more = page.getByRole('button', { name: 'Load more songs', exact: true })
  await more.focus()
  await page.keyboard.press('Enter')
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE * 2)
  await page.getByRole('button', { name: 'Rainy day', exact: true }).click()
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
  await page.getByRole('button', { name: 'Rainy day', exact: true }).click()
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
})

test('Discover requests 50 Spotify top tracks, scrolls to the last song, and explains untagged moods', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('melody-hifi-spotify-session', JSON.stringify({
      access_token: 'test-token', expires_at: Date.now() + 3600000,
    }))
  })
  let requestedLimit
  await page.route('https://api.spotify.com/v1/me/top/tracks**', route => {
    requestedLimit = new URL(route.request().url()).searchParams.get('limit')
    return route.fulfill({ json: { items: Array.from({ length: 50 }, (_, index) => ({
      id: index < 2 ? SAMPLE_TRACKS[index].id : `spotify-top-${index + 1}`,
      name: index < 2 ? SAMPLE_TRACKS[index].title : `Spotify favorite ${index + 1}`,
      artists: [{ name: 'Test artist' }],
      album: { name: 'Test album', images: [] },
      external_urls: { spotify: `https://open.spotify.com/track/spotify-top-${index + 1}` },
    })) } })
  })
  await page.goto('/#/discover')
  const results = page.locator('.discover-results')
  const rows = results.locator('li')
  await expect(results.getByRole('heading')).toHaveText('Your top tracks')
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
  await loadAllDiscoverSongs(page, 50)
  await expect(rows).toHaveCount(50)
  expect(requestedLimit).toBe('50')
  await expect(rows.last().locator('.rank')).toHaveText('50')
  await rows.last().scrollIntoViewIfNeeded()
  await expect(rows.last().locator('.play')).toBeInViewport()
  expect(await page.locator('#screen .scroll').evaluate(el => el.scrollTop)).toBeGreaterThan(0)
  await rows.last().locator('.row-main').click()
  await expect(page.locator('.song-title')).toHaveText('Spotify favorite 50')
  await page.goBack()
  await page.getByRole('button', { name: 'Gym', exact: true }).click()
  await expect(rows).toHaveCount(1)
  await expect(results).toContainText('Espresso')
  await expect(page.locator('#screen')).toContainText('48 Spotify tracks have no Melody mood tags')
  await page.getByRole('button', { name: 'Gym', exact: true }).click()
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
  await expect(page.locator('#screen')).not.toContainText('hidden by these filters')
  await page.getByRole('button', { name: 'Melody library', exact: true }).click()
  await expect(results).toContainText(`of ${CURATED_TRACKS.length} songs`)
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
  const search = page.getByRole('searchbox', { name: 'Search songs or artists' })
  await search.fill('folklore')
  await search.press('Enter')
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
  await expect(rows.first()).toContainText('the 1')
  await page.getByRole('button', { name: 'Clear search', exact: true }).click()
  await page.getByRole('button', { name: 'Your top tracks', exact: true }).click()
  await expect(results).toContainText('of 50 songs')
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
})

test('Disconnected Discover loads a 100+ song curated library in scroll batches', async ({ page }) => {
  await page.goto('/#/discover')
  const rows = page.locator('.discover-results li')
  expect(CURATED_TRACKS.length).toBeGreaterThanOrEqual(100)
  await expect(rows).toHaveCount(DISCOVER_BATCH_SIZE)
  await expect(page.locator('.discover-results')).toContainText('not live Spotify chart rankings')
  await loadAllDiscoverSongs(page, CURATED_TRACKS.length)
  await expect(rows).toHaveCount(CURATED_TRACKS.length)
  await expect(page.getByRole('button', { name: 'Load more songs', exact: true })).toHaveCount(0)
  expect(await rows.evaluateAll(elements => new Set(elements.map(el => el.dataset.trackId)).size)).toBe(CURATED_TRACKS.length)
  await rows.last().scrollIntoViewIfNeeded()
  await expect(rows.last()).toBeInViewport()
  await rows.last().locator('.row-main').click()
  await expect(page.locator('.song-title')).toHaveText(CURATED_TRACKS.at(-1).title)
})

test('optional Spotify authorization restores onboarding identity, avatar, and genres', async ({ page }) => {
  const avatar = { ...initialAvatar('demo'), hair: 2 }
  await page.addInitScript(context => {
    sessionStorage.setItem('melody-hifi-onboarding', JSON.stringify(context))
    sessionStorage.setItem('melody-hifi-spotify-state', 'test-state')
    sessionStorage.setItem('melody-hifi-spotify-verifier', 'test-verifier')
  }, { handle: 'demo_music', email: 'demo@example.com', avatar, genres: ['Pop', 'Rock', 'Jazz'] })
  await page.route('https://accounts.spotify.com/api/token', route => route.fulfill({
    json: { access_token: 'test-token', expires_in: 3600 },
  }))
  await page.route('https://api.spotify.com/v1/me/top/tracks**', route => route.fulfill({ json: { items: [] } }))
  await page.goto('/?code=test-code&state=test-state')
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'onboarding-genres')
  await expect(page.locator('.genre-chips [aria-pressed="true"]')).toHaveCount(3)
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await page.getByRole('button', { name: 'Skip for now', exact: true }).click()
  await expect(page.locator('#screen')).toContainText('@demo_music')
  expect(await page.evaluate(() => sessionStorage.getItem('melody-hifi-onboarding'))).toBeNull()
})

test('Discover searches local titles, artists, and albums and combines mood filters with any-match semantics', async ({ page }) => {
  await page.goto('/#/discover')
  const results = page.locator('.discover-results')
  const search = page.getByRole('searchbox', { name: 'Search songs or artists' })
  await expect(results.locator('li')).toHaveCount(DISCOVER_BATCH_SIZE)
  await page.getByRole('button', { name: 'Gym', exact: true }).click()
  await expect(results.locator('li')).toHaveCount(Math.min(DISCOVER_BATCH_SIZE, filterDiscoverTracks(CURATED_TRACKS, '', new Set(['Gym'])).length))
  await page.getByRole('button', { name: 'Rainy day', exact: true }).click()
  await expect(results.locator('li')).toHaveCount(DISCOVER_BATCH_SIZE)
  await search.fill('Coldplay')
  await page.getByRole('button', { name: 'Search', exact: true }).click()
  await expect(results.locator('li')).toHaveCount(1)
  await expect(results).toContainText('Yellow')
  await page.getByRole('button', { name: 'Rainy day', exact: true }).click()
  await expect(results.locator('li')).toHaveCount(0)
  await expect(results).toContainText('No songs match')
  await page.getByRole('button', { name: 'Gym', exact: true }).click()
  await expect(results.locator('li')).toHaveCount(1)
  for (const query of ['blinding', 'After Hours']) {
    await search.fill(query)
    await search.press('Enter')
    await expect(results.locator('li')).toHaveCount(Math.min(DISCOVER_BATCH_SIZE, filterDiscoverTracks(CURATED_TRACKS, query, new Set()).length))
    await expect(results).toContainText('Blinding Lights')
  }
  await page.getByRole('button', { name: 'Clear search', exact: true }).click()
  await expect(search).toHaveValue('')
  await expect(results.locator('li')).toHaveCount(DISCOVER_BATCH_SIZE)
})

test('Discover Spotify search errors remain readable, can be retried, and filter curated remote tracks', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('melody-hifi-spotify-session', JSON.stringify({
      access_token: 'test-token', expires_at: Date.now() + 3600000,
    }))
  })
  await page.route('https://api.spotify.com/v1/me/top/tracks**', route => route.fulfill({ json: { items: [] } }))
  let rejected = true
  await page.route('https://api.spotify.com/v1/search**', route => route.fulfill(rejected
    ? { status: 403, body: 'Active Premium subscription required', contentType: 'text/plain' }
    : { json: { tracks: { items: [
      { id: '3AJwUDP919kvQ9QcozQPxg', name: 'Yellow', artists: [{ name: 'Coldplay' }], album: { name: 'Parachutes', images: [] }, external_urls: { spotify: 'https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg' } },
      { id: 'remote-track', name: 'Another song', artists: [{ name: 'New Artist' }], album: { name: 'New Album', images: [] }, external_urls: { spotify: 'https://open.spotify.com/track/remote-track' } },
    ] } } }))
  await page.goto('/#/discover')
  const search = page.getByRole('searchbox', { name: 'Search songs or artists' })
  const results = page.locator('.discover-results')
  await search.fill('Yellow')
  await search.press('Enter')
  await expect(page.locator('.discover-error')).toContainText('Spotify (403): Active Premium')
  await expect(page.locator('.discover-error')).not.toContainText('Unexpected token')
  await expect(results).toContainText('Matching songs in Melody')
  await expect(results.locator('li')).toHaveCount(1)
  rejected = false
  await search.press('Enter')
  await expect(results).toContainText('Spotify search results')
  await expect(results.locator('li')).toHaveCount(2)
  await expect(page.locator('.discover-error')).toHaveCount(0)
  await page.getByRole('button', { name: 'Rainy day', exact: true }).click()
  await expect(results.locator('li')).toHaveCount(1)
  await results.locator('.tt b').click()
  await expect(page.locator('.song-title')).toHaveText('Yellow')
})

test('Discover ignores an older Spotify response after a newer search', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('melody-hifi-spotify-session', JSON.stringify({
      access_token: 'test-token', expires_at: Date.now() + 3600000,
    }))
  })
  await page.route('https://api.spotify.com/v1/me/top/tracks**', route => route.fulfill({ json: { items: [] } }))
  let olderRoute
  await page.route('https://api.spotify.com/v1/search**', async route => {
    if (new URL(route.request().url()).searchParams.get('q') === 'old') {
      olderRoute = route
      return
    }
    await route.fulfill({ json: { tracks: { items: [] } } })
  })
  await page.goto('/#/discover')
  const search = page.getByRole('searchbox', { name: 'Search songs or artists' })
  await search.fill('old')
  await search.press('Enter')
  await expect.poll(() => Boolean(olderRoute)).toBe(true)
  await search.fill('new')
  await search.press('Enter')
  await expect(page.locator('.discover-results')).toContainText('Spotify search results')
  await olderRoute.fulfill({ status: 403, body: 'Old request error' })
  await expect(page.locator('.discover-error')).toHaveCount(0)
  await expect(search).toHaveValue('new')
  await page.getByRole('button', { name: 'Clear search', exact: true }).click()
  await expect(page.locator('.discover-results li')).toHaveCount(DISCOVER_BATCH_SIZE)
})

for (const failure of [
  { endpoint: 'token', status: 403, body: 'Active Premium subscription required', expected: 'Spotify (403): Active Premium' },
  { endpoint: 'tracks', status: 403, body: 'Active Premium subscription required', expected: 'Spotify (403): Active Premium' },
  { endpoint: 'token', status: 400, body: JSON.stringify({ error: 'invalid_grant', error_description: 'Authorization code expired' }), expected: 'Authorization code expired' },
  { endpoint: 'tracks', status: 403, body: JSON.stringify({ error: { message: 'User not registered in the Developer Dashboard' } }), expected: 'User not registered' },
  { endpoint: 'tracks', status: 502, body: '', expected: 'Spotify (502): Spotify could not complete' },
  { endpoint: 'token', status: 200, body: 'not valid JSON', expected: 'Spotify returned an invalid response' },
]) {
  test(`Spotify ${failure.endpoint} ${failure.status} error ${failure.expected} is readable and disconnect clears it`, async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('melody-hifi-spotify-state', 'test-state')
      sessionStorage.setItem('melody-hifi-spotify-verifier', 'test-verifier')
    })
    await page.route('https://accounts.spotify.com/api/token', route => route.fulfill(
      failure.endpoint === 'token'
        ? { status: failure.status, body: failure.body, contentType: 'text/plain' }
        : { json: { access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600 } }))
    await page.route('https://api.spotify.com/v1/me/top/tracks**', route => route.fulfill({
      status: failure.status, body: failure.body, contentType: 'text/plain',
    }))
    await page.goto('/?code=test-code&state=test-state#/profile')
    const alert = page.locator('.spot [role="alert"]')
    await expect(alert).toContainText(failure.expected)
    await expect(alert).not.toContainText('Unexpected token')
    if (failure.body.includes('Premium')) {
      await expect(alert).toContainText('app owner in development mode')
    }
    if (failure.endpoint === 'tracks') {
      await page.getByRole('button', { name: 'Disconnect', exact: true }).click()
      await expect(alert).toHaveCount(0)
    }
    await expect(page.getByRole('button', { name: 'Connect Spotify', exact: true })).toBeVisible()
    expect(await page.evaluate(() => sessionStorage.getItem('melody-hifi-spotify-session'))).toBeNull()
  })
}

test('Spotify callback exchanges a code once and updates the connected profile', async ({ page }) => {
  let tokenRequests = 0
  await page.addInitScript(() => {
    sessionStorage.setItem('melody-hifi-spotify-state', 'test-state')
    sessionStorage.setItem('melody-hifi-spotify-verifier', 'test-verifier')
  })
  await page.route('https://accounts.spotify.com/api/token', async route => {
    tokenRequests += 1
    await route.fulfill({ json: {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      expires_in: 3600,
    } })
  })
  await page.route('https://api.spotify.com/v1/me/top/tracks**', route =>
    route.fulfill({ json: { items: [] } }))
  await page.goto('/?code=test-code&state=test-state#/profile')
  await expect(page.getByRole('button', { name: 'Disconnect', exact: true })).toBeVisible()
  expect(tokenRequests).toBe(1)
  await expect(page).not.toHaveURL(/code=/)
})

test('device theme, saved Profile toggle, and returning to device theme work', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/#/profile')
  const toggle = page.getByRole('button', { name: 'Dark mode', exact: true })
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('.me-card')).toHaveCSS('background-color', 'rgb(255, 122, 198)')
  await expect(page.locator('.me-card')).toHaveCSS('color', 'rgb(0, 0, 0)')
  await expect(page.locator('.me-card')).toHaveCSS('border-top-color', 'rgb(255, 240, 247)')
  await toggle.click()
  await page.reload()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.goto('/?dev#/profile')
  await page.locator('#pill').click()
  await page.getByLabel('Theme preference').selectOption('system')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('dark-mode screens fit a 390 by 844 phone and retain readable surfaces', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ colorScheme: 'dark' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const frame of FRAMES) {
    await page.goto(`/#/${frame.id}`)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.locator('#screen')).toHaveAttribute('data-screen', frame.id)
    await expect(page.locator('#screen')).toHaveCSS('color', 'rgb(255, 240, 247)')
    expect(await page.locator('.scroll').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
    if (['signin', 'discover', 'profile', 'avatar', 'conversation'].includes(frame.id)) {
      await page.screenshot({ path: testInfo.outputPath(`${frame.id}-dark.png`), animations: 'disabled' })
    }
  }
  expect(errors).toEqual([])
})

test('all prototype screens render and fit the viewport', async ({ page }, testInfo) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const frame of FRAMES) {
    await page.goto(`/#/${frame.id}`)
    await expect(page.locator('#screen')).toHaveAttribute('data-screen', frame.id)
    await expect(page.locator('#screen > .scr')).toBeVisible()
    if (frame.file) {
      await expect.poll(() => page.locator('#orig').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (['signin', 'discover', 'avatar', 'components'].includes(frame.id)) {
      await page.screenshot({ path: testInfo.outputPath(`${frame.id}.png`), animations: 'disabled' })
    }
  }
  expect(errors).toEqual([])
})

test('sign in, tabs, likes, history and reload work', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Melody Hi-fi Prototype')
  await expect(page.locator('#screen h1')).toHaveText('Melody')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'discover')
  await page.getByRole('button', { name: 'Friends', exact: true }).click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'friends')
  const like = page.locator('[data-action="like"]').first()
  await like.click()
  await expect(like).toHaveAttribute('aria-pressed', 'true')
  await expect(like).toHaveText('5')
  await page.goBack()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'discover')
  await page.goForward()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'friends')
  await page.reload()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'friends')
  await expect(page.locator('[data-action="like"]').first()).toHaveText('4')
})

test('Spotify song details and edit profile work', async ({ page }) => {
  await page.goto('/#/song')
  await expect(page.locator('.song-title')).toHaveText('Ribs')
  await expect(page.locator('.spotify-embed')).toHaveAttribute('src', /open\.spotify\.com\/embed\/track\//)

  await page.goto('/#/profile')
  await page.getByRole('button', { name: 'Edit profile', exact: true }).click()
  const handle = page.getByLabel('Handle')
  await handle.fill('Bad Handle')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.locator('#handle-error')).toContainText('3–20 lowercase letters')
  await handle.fill('ryan_music')
  const bio = page.getByLabel('Bio')
  await bio.fill('Songs make a home wherever you are.')
  await expect(page.locator('#bio-count')).toHaveText('35/160')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'profile')
  await expect(page.locator('.handle-xl')).toHaveText('@ryan_music')
  await expect(page.locator('.me-card p')).toHaveText('Songs make a home wherever you are.')
})

async function mockSpotifyPlayer(page, blocked = false) {
  await page.route('https://open.spotify.com/embed/iframe-api/v1', route => route.fulfill({
    contentType: 'application/javascript',
    body: `
      window.spotifyCommands = [];
      window.onSpotifyIframeApiReady({
        createController(element, options, callback) {
          const frame = document.createElement('iframe');
          frame.title = 'Spotify track player';
          element.replaceWith(frame);
          const listeners = {};
          let uri = options.uri;
          let paused = true;
          const update = () => listeners.playback_update?.({ data: { playingURI: uri, isPaused: paused } });
          window.spotifyStartPlayback = () => { paused = false; update(); };
          window.spotifyEndPlayback = () => { paused = true; update(); };
          callback({
            addListener(name, listener) {
              listeners[name] = listener;
              if (name === 'ready') setTimeout(listener, 0);
            },
            play() { window.spotifyCommands.push(['play', uri]); if (!${blocked}) { paused = false; update(); } },
            togglePlay() { window.spotifyCommands.push(['toggle', uri]); paused = !paused; update(); },
            loadEntity(next) { window.spotifyCommands.push(['load', next]); uri = next; },
            destroy() { window.spotifyCommands.push(['destroy', uri]); frame.remove(); },
          });
        },
      });
    `,
  }))
}

test('list playback stays on Discover, pauses, changes tracks, and preserves detail navigation', async ({ page }) => {
  await mockSpotifyPlayer(page)
  await page.route('https://open.spotify.com/oembed**', route => route.abort())
  await page.goto('/#/discover')
  const rows = page.locator('.rows > li')
  const firstPlay = rows.first().locator('.play')
  await firstPlay.click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'discover')
  await expect(firstPlay).toHaveAttribute('aria-label', 'Pause Espresso on Spotify')
  await expect(page.locator('.mini-player')).toBeHidden()
  await expect(page.locator('.mini-player iframe')).toHaveCount(1)
  await expect(page.locator('#screen')).not.toHaveClass(/has-player/)
  await firstPlay.click()
  await expect(firstPlay).toHaveAttribute('aria-label', 'Play Espresso on Spotify')
  await expect(page.locator('.mini-player')).toBeHidden()
  await rows.nth(1).locator('.play').click()
  await expect(rows.nth(1).locator('.play')).toHaveAttribute('aria-pressed', 'true')
  await expect(firstPlay).toHaveAttribute('aria-pressed', 'false')
  const commands = await page.evaluate(() => window.spotifyCommands)
  expect(commands.map(command => command[0])).toEqual(['play', 'toggle', 'load', 'play'])
  await expect.poll(() => rows.first().locator('.art').evaluate(element => getComputedStyle(element).backgroundImage))
    .toContain('Cover.svg')
  await rows.first().locator('.tt b').click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'song')
  await expect(page.locator('.song-title')).toHaveText('Espresso')
  await expect(page.locator('.song-sub')).toContainText('Short n’ Sweet')
  await expect(page.locator('.mini-player')).toBeHidden()
  expect(await page.evaluate(() => window.spotifyCommands.some(command => command[0] === 'destroy'))).toBe(false)
  await page.goBack()
  await expect(rows.nth(1).locator('.play')).toHaveAttribute('aria-pressed', 'true')
  await page.evaluate(() => window.spotifyEndPlayback())
  await expect(rows.nth(1).locator('.play')).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('.mini-player')).toBeHidden()
})

test('blocked autoplay reveals Spotify controls, then hides them once playback starts', async ({ page }) => {
  await mockSpotifyPlayer(page, true)
  await page.goto('/#/discover')
  const play = page.locator('.rows .play').first()
  await play.click()
  await expect(play).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('.mini-player')).toBeVisible({ timeout: 6000 })
  const playerBox = await page.locator('.mini-player').boundingBox()
  const dropBox = await page.getByRole('button', { name: 'Drop a song', exact: true }).boundingBox()
  expect(playerBox.y + playerBox.height).toBeLessThan(dropBox.y)
  await page.evaluate(() => window.spotifyStartPlayback())
  await expect(play).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.mini-player')).toBeHidden()
  await play.click()
  await expect(play).toHaveAttribute('aria-pressed', 'false')
  await page.waitForTimeout(3200)
  await expect(page.locator('.mini-player')).toBeHidden()
})

test('song artwork, artist, and row whitespace open details without starting playback', async ({ page }) => {
  for (const selector of ['.art', '.tt > span', null]) {
    await page.goto('/#/discover')
    const row = page.locator('.rows > li').first()
    if (selector) await row.locator(selector).click()
    else await row.click({ position: { x: 2, y: 2 } })
    await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'song')
    await expect(page.getByRole('region', { name: 'Spotify player' })).toHaveCount(0)
  }
})

test('Spotify player loading errors are visible without leaving Discover', async ({ page }) => {
  await page.route('https://open.spotify.com/embed/iframe-api/v1', route => route.abort())
  await page.goto('/#/discover')
  await page.locator('.rows .play').first().click()
  await expect(page.getByRole('region', { name: 'Spotify player' })).toContainText('Spotify player could not load')
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'discover')
  await page.getByRole('button', { name: 'Close Spotify player' }).click()
  await mockSpotifyPlayer(page)
  await page.locator('.rows .play').first().click()
  await expect(page.locator('.rows .play').first()).toHaveAttribute('aria-pressed', 'true')
})

test('main pages share the theme toggle and Profile has two eyes and no Sleeve link', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/#/discover')
  for (const tab of ['Discover', 'Friends', 'Chats', 'Profile']) {
    await page.getByRole('button', { name: tab, exact: true }).click()
    const toggle = page.getByRole('button', { name: 'Dark mode', exact: true })
    await expect(toggle).toHaveCount(1)
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await toggle.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await toggle.click()
  }
  await expect(page.getByRole('button', { name: 'Profile', exact: true }).locator('svg circle[fill="currentColor"]')).toHaveCount(2)
  await expect(page.getByRole('link', { name: 'Inspired by Replay Sleeve' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Dark mode', exact: true }).click()
  await page.getByRole('button', { name: 'Discover', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Dark mode', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('song drops and comments clear submitted inputs', async ({ page }) => {
  await page.goto('/#/discover')
  await page.getByRole('button', { name: 'Drop a song', exact: true }).click()
  await page.locator('[data-action="pick"]').first().click()
  await page.getByLabel('Your note').fill('A rainy afternoon song')
  await expect(page.locator('#drop-count')).toHaveText('22/500')
  await page.getByRole('button', { name: 'Drop it', exact: true }).click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'discover')
  await page.getByRole('button', { name: 'Profile', exact: true }).click()
  await page.getByRole('button', { name: '1 comment', exact: true }).click()
  await page.locator('.comment [data-go="song"]').first().click()
  await expect(page.locator('.comment').first()).toContainText('A rainy afternoon song')
  const comment = page.getByLabel('What does this song mean to you?')
  await comment.fill('<My favorite chorus>')
  await page.getByRole('button', { name: 'Post comment', exact: true }).click()
  await expect(comment).toHaveValue('')
  await expect(page.locator('.comment').first()).toContainText('<My favorite chorus>')
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page.getByRole('button', { name: '2 comments', exact: true })).toBeVisible()
})

test('Profile comments count reflects only posted notes and opens the right song', async ({ page }) => {
  await page.goto('/#/profile')
  await page.getByRole('button', { name: '0 comments', exact: true }).click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'profile-comments')
  await expect(page.locator('#screen')).toContainText('No comments yet')
  await page.getByRole('button', { name: 'Explore Discover', exact: true }).click()
  await page.locator('.discover-results .row-main').first().click()
  await page.getByRole('button', { name: 'Post comment', exact: true }).click()
  await expect(page.locator('.comment')).toHaveCount(0)
  await page.getByLabel('What does this song mean to you?').fill('<A real demo note>')
  await page.getByRole('button', { name: 'Post comment', exact: true }).click()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByRole('button', { name: 'Profile', exact: true }).click()
  await page.getByRole('button', { name: '1 comment', exact: true }).click()
  await expect(page.locator('.comment')).toHaveCount(1)
  await expect(page.locator('.comment')).toContainText('<A real demo note>')
  await page.locator('.comment [data-go="song"]').click()
  await expect(page.locator('.song-title')).toHaveText('Espresso')
  await expect(page.locator('.comment')).toHaveCount(1)
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByRole('button', { name: 'Discover', exact: true }).click()
  await page.locator('.talk-item').first().click()
  await expect(page.locator('.song-title')).toHaveText('Ribs')
  await expect(page.locator('.comment')).toHaveCount(2)
  await expect(page.locator('.comment').filter({ hasText: '<A real demo note>' })).toHaveCount(0)
})

test('friend search, requests and messages work', async ({ page }) => {
  await page.goto('/#/add-friends')
  await expect(page.locator('.invite b')).toHaveText('Invite friends to Melody')
  await page.getByRole('searchbox').fill('@noor')
  await expect(page.locator('#add-list > li')).toHaveCount(1)
  const request = page.locator('[data-action="addFriend"]')
  await request.click()
  await expect(request).toHaveText('Requested')
  await request.click()
  await expect(request).toHaveText('Add')
  await page.goto('/#/conversation')
  await page.getByRole('textbox', { name: 'Message', exact: true }).fill('Listen to this one')
  await page.getByRole('button', { name: 'Send', exact: true }).click()
  await expect(page.locator('.bub.me').last()).toHaveText('Listen to this one')
  await expect(page.getByRole('textbox', { name: 'Message', exact: true })).toHaveValue('')
})

test('avatar edits save, cancel and work from a deep link', async ({ page }) => {
  await page.goto('/#/profile')
  const original = await page.locator('.me-card .av').innerHTML()
  await page.getByRole('button', { name: 'Edit avatar', exact: true }).click()
  await page.getByRole('button', { name: 'Next Hair', exact: true }).click()
  await expect(page.locator('output').first()).toHaveText('2 / 48')
  await page.getByRole('button', { name: 'Hair color 2', exact: true }).click()
  const preview = page.locator('.av-preview')
  const hairPreview = await preview.innerHTML()
  await page.getByRole('tab', { name: 'Face', exact: true }).click()
  await page.getByRole('button', { name: 'Next Eyes', exact: true }).click()
  expect(await preview.innerHTML()).not.toBe(hairPreview)
  await page.getByRole('tab', { name: 'Extras', exact: true }).click()
  await page.getByRole('button', { name: 'Next Glasses', exact: true }).click()
  await expect(page.locator('output').first()).toHaveText('1 / 5')
  await page.getByRole('tab', { name: 'Colors', exact: true }).click()
  await page.getByRole('button', { name: 'Skin tone 3', exact: true }).click()
  await page.getByRole('button', { name: 'Background 4', exact: true }).click()
  await page.getByRole('tab', { name: 'Hair', exact: true }).click()
  await page.getByRole('button', { name: 'Save avatar', exact: true }).click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'profile')
  expect(await page.locator('.me-card .av').innerHTML()).not.toBe(original)
  await page.getByRole('button', { name: 'Edit avatar', exact: true }).click()
  await page.getByRole('button', { name: 'Next Hair', exact: true }).click()
  await page.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'profile')
  await page.getByRole('button', { name: 'Edit avatar', exact: true }).click()
  await expect(page.locator('output').first()).toHaveText('2 / 48')
  const deepLinkPage = await page.context().newPage()
  await deepLinkPage.goto('/#/avatar')
  await deepLinkPage.getByRole('button', { name: 'Next Hair', exact: true }).click()
  await expect(deepLinkPage.locator('output').first()).toHaveText('2 / 48')
  await deepLinkPage.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(deepLinkPage.locator('#screen')).toHaveAttribute('data-screen', 'profile')
  await deepLinkPage.close()
})

test('song sending and review controls work', async ({ page }) => {
  await page.goto('/?dev#/song')
  await page.getByRole('button', { name: 'Send', exact: true }).click()
  await page.locator('[data-action="sendPick"][aria-pressed="true"]').first().click()
  await page.locator('[data-action="sendPick"][aria-pressed="true"]').first().click()
  await expect(page.locator('[data-action="send"]')).toBeDisabled()
  await page.locator('[data-action="sendPick"]').first().click()
  await page.getByRole('button', { name: 'Send to 1 friend', exact: true }).click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'song')
  await page.locator('#pill').click()
  await expect(page.locator('#panel')).toBeVisible()
  await page.getByLabel('Overlay original frame').check()
  await expect(page.locator('#orig')).toBeVisible()
  await page.getByLabel('Show hotspots').check()
  await expect(page.locator('#frame')).toHaveClass('frame hot')
  await page.getByRole('button', { name: 'Restart', exact: true }).click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'signin')
})