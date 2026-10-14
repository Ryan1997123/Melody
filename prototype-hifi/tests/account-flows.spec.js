import { test, expect } from '@playwright/test'
import { registerAccountFlowTests } from '../../prototype-react/tests/account-flow-cases.js'

registerAccountFlowTests(test, expect)

for (const theme of ['light', 'dark']) {
  test(`Welcome uses the four exported SVG decorations in ${theme} mode`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
    await page.goto('/#/welcome')
    await expect(page.getByRole('heading', { name: 'You’re in, @ryan' })).toBeVisible()
    const decorations = page.locator('.welcome-decoration')
    await expect(decorations).toHaveCount(4)
    const fills = { lemon: 'rgb(255, 216, 51)', mint: 'rgb(111, 237, 192)', periwinkle: 'rgb(159, 168, 255)', bubblegum: 'rgb(255, 122, 198)' }
    for (const [color, fill] of Object.entries(fills)) {
      const decoration = page.locator(`.welcome-decoration.${color}`)
      await expect(decoration).toBeVisible()
      await expect(decoration.locator('path')).toHaveCSS('fill', fill)
      await expect(decoration.locator('path')).toHaveCSS('stroke', theme === 'light' ? 'rgb(0, 0, 0)' : 'rgb(255, 240, 247)')
    }
    const avatarBox = await page.locator('.welcome-avatar').boundingBox()
    expect(avatarBox.x + avatarBox.width / 2).toBeCloseTo(195, 0)
    expect(avatarBox.width).toBe(180)
    await expect(page.getByRole('button', { name: 'Drop your first song' })).toBeInViewport()
    await expect(page.getByRole('button', { name: 'Explore Discover' })).toBeInViewport()
    await page.screenshot({ path: testInfo.outputPath(`welcome-decorations-${theme}.png`), animations: 'disabled', scale: 'css' })
    await page.getByRole('button', { name: 'Drop your first song' }).click()
    await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'drop-pick')
  })

  test(`Make your avatar centers the preview and full-size shuffle control in ${theme} mode`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
    await page.goto('/#/onboarding-avatar')
    const group = page.locator('.onboarding-avatar-preview')
    const avatar = group.locator('.av-preview')
    const shuffle = group.getByRole('button', { name: 'Shuffle', exact: true })
    const groupBox = await group.boundingBox()
    const avatarBox = await avatar.boundingBox()
    const shuffleBox = await shuffle.boundingBox()
    expect(groupBox.x + groupBox.width / 2).toBeCloseTo(195, 0)
    expect(avatarBox.width).toBe(150)
    expect(avatarBox.height).toBe(150)
    expect(shuffleBox.width).toBe(44)
    expect(shuffleBox.height).toBe(44)
    expect(shuffleBox.x - avatarBox.x - avatarBox.width).toBe(16)
    expect(shuffleBox.y + shuffleBox.height).toBe(avatarBox.y + avatarBox.height)
    await expect(shuffle.locator('svg')).toHaveCSS('width', '20px')
    await expect(shuffle.locator('svg')).toHaveCSS('height', '20px')
    const before = await avatar.innerHTML()
    await shuffle.click()
    await expect(avatar).not.toHaveJSProperty('innerHTML', before)
    await page.screenshot({ path: testInfo.outputPath(`make-avatar-${theme}.png`), animations: 'disabled', scale: 'css' })
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'onboarding-genres')
  })
}

test('Profile has a visible Settings label alongside the theme toggle', async ({ page }) => {
  await page.goto('/#/profile')
  const settings = page.getByRole('button', { name: 'Settings', exact: true })
  await expect(settings).toHaveText('Settings')
  await expect(settings).toBeVisible()
  await expect(page.getByRole('button', { name: 'Dark mode', exact: true })).toBeVisible()
  expect(await page.locator('.scroll').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
  await settings.click()
  await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'settings')
})
