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

test('list playback opens Spotify and missing cover art uses the supplied atlas', async ({ page }) => {
  await page.route('https://open.spotify.com/oembed**', route => route.abort())
  await page.goto('/#/discover')
  await page.locator('.rows [data-action="play"]').first().click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'song')
  await expect(page.locator('.song-title')).toHaveText('Blinding Lights')
  await expect.poll(() => page.locator('.cover .art').evaluate(element => getComputedStyle(element).backgroundImage))
    .toContain('Cover.svg')
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