import { test, expect } from '@playwright/test'
import { FRAMES } from '../src/screens.js'

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
  await expect(page.locator('.song-title')).toHaveText('Blinding Lights')
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

async function mockSpotifyPlayer(page) {
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
          callback({
            addListener(name, listener) {
              listeners[name] = listener;
              if (name === 'ready') setTimeout(listener, 0);
            },
            play() { window.spotifyCommands.push(['play', uri]); paused = false; update(); },
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
  await expect(page.getByRole('region', { name: 'Spotify player' })).toBeVisible()
  const playerBox = await page.getByRole('region', { name: 'Spotify player' }).boundingBox()
  const dropBox = await page.getByRole('button', { name: 'Drop a song', exact: true }).boundingBox()
  expect(playerBox.y + playerBox.height).toBeLessThan(dropBox.y)
  await expect(firstPlay).toHaveAttribute('aria-label', 'Pause Blinding Lights on Spotify')
  await firstPlay.click()
  await expect(firstPlay).toHaveAttribute('aria-label', 'Play Blinding Lights on Spotify')
  await rows.nth(1).locator('.play').click()
  await expect(rows.nth(1).locator('.play')).toHaveAttribute('aria-pressed', 'true')
  await expect(firstPlay).toHaveAttribute('aria-pressed', 'false')
  const commands = await page.evaluate(() => window.spotifyCommands)
  expect(commands.map(command => command[0])).toEqual(['play', 'toggle', 'load', 'play'])
  await expect.poll(() => rows.first().locator('.art').evaluate(element => getComputedStyle(element).backgroundImage))
    .toContain('Cover.svg')
  await rows.first().locator('.tt b').click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'song')
  await expect(page.locator('.song-title')).toHaveText('Blinding Lights')
  await expect(page.locator('.song-sub')).toContainText('After Hours')
  await page.getByRole('button', { name: 'Close Spotify player' }).click()
  expect(await page.evaluate(() => window.spotifyCommands.at(-1)[0])).toBe('destroy')
  await expect(page.getByRole('region', { name: 'Spotify player' })).toHaveCount(0)
  await page.goBack()
  await page.locator('.rows .play').first().click()
  await expect(page.locator('.rows .play').first()).toHaveAttribute('aria-pressed', 'true')
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
  await page.locator('[data-go="song"]').first().click()
  await expect(page.locator('.comment').first()).toContainText('A rainy afternoon song')
  const comment = page.getByLabel('What does this song mean to you?')
  await comment.fill('<My favorite chorus>')
  await page.getByRole('button', { name: 'Post comment', exact: true }).click()
  await expect(comment).toHaveValue('')
  await expect(page.locator('.comment').first()).toContainText('<My favorite chorus>')
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