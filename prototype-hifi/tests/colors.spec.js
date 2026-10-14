import { test, expect } from '@playwright/test'

const accents = {
  lemon: 'rgb(255, 216, 51)',
  bubblegum: 'rgb(255, 122, 198)',
  mint: 'rgb(111, 237, 192)',
  periwinkle: 'rgb(159, 168, 255)',
}

test('Discover track rows give ranks and play controls 8px of edge spacing', async ({ page }) => {
  for (const theme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: theme })
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/#/discover')
      const row = page.locator('.discover-results .rows > li').first()
      const rowBox = await row.boundingBox()
      const rankBox = await row.locator('.rank').boundingBox()
      const playBox = await row.locator('.play').boundingBox()
      expect(rankBox.x - rowBox.x).toBe(8)
      expect(rowBox.x + rowBox.width - playBox.x - playBox.width).toBe(8)
      expect(playBox.width).toBe(44)
      expect(playBox.height).toBe(44)
      expect(await row.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
      await row.locator('.row-main').click()
      await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'song')
    }
  }
})

for (const theme of ['light', 'dark']) {
  test(`Drop a song keeps covers and buttons contained in ${theme} mode`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/#/drop-pick')
      const rows = page.locator('#screen .rows > li')
      for (const row of await rows.all()) {
        const rowBox = await row.boundingBox()
        const coverBox = await row.locator('.art').boundingBox()
        const playBox = await row.locator('.play').boundingBox()
        expect(coverBox.x - rowBox.x).toBe(8)
        expect(rowBox.x + rowBox.width - playBox.x - playBox.width).toBe(8)
        expect(coverBox.width).toBe(52)
        expect(playBox.width).toBe(44)
        expect(await row.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
      }
      await rows.filter({ hasText: 'Pink Pony Club' }).locator('.row-main').click()
      await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'drop-why')
      const picked = page.locator('.picked')
      const pickedBox = await picked.boundingBox()
      const coverBox = await picked.locator('.art').boundingBox()
      const change = picked.getByRole('button', { name: 'Change', exact: true })
      const buttonBox = await change.boundingBox()
      const textBox = await picked.locator('.tt').boundingBox()
      expect(coverBox.width).toBe(56)
      expect(textBox.x - coverBox.x - coverBox.width).toBe(12)
      expect(buttonBox.x - textBox.x - textBox.width).toBeCloseTo(12, 0)
      expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(pickedBox.x + pickedBox.width)
      expect(await picked.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
      expect(await change.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
      await page.screenshot({ path: testInfo.outputPath(`drop-why-${theme}-${width}.png`), animations: 'disabled', scale: 'css' })
      await change.click()
      await expect(page.locator('#screen')).toHaveAttribute('data-screen', 'drop-pick')
    }
  })

  test(`${theme} surfaces and accents match the exported Figma frames`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
    const paper = theme === 'light' ? 'rgb(255, 240, 247)' : 'rgb(36, 19, 47)'
    const surface = theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(51, 28, 66)'
    const ink = theme === 'light' ? 'rgb(0, 0, 0)' : 'rgb(255, 240, 247)'
    const muted = theme === 'light' ? 'rgb(247, 221, 235)' : 'rgb(69, 42, 87)'
    const hint = theme === 'light' ? 'rgb(138, 122, 133)' : 'rgb(160, 141, 169)'
    const checks = [
      ['profile', [
        ['.me-card', accents.bubblegum, 'rgb(0, 0, 0)'],
        ['.stat:first-child', accents.lemon, 'rgb(0, 0, 0)'],
        ['.stat:nth-child(2)', accents.periwinkle, 'rgb(0, 0, 0)'],
        ['.me-card [data-go="avatar"]', surface, ink],
        ['.me-card [data-go="edit-profile"]', accents.lemon, 'rgb(0, 0, 0)'],
        ['.spot', surface],
        ['.spot .btn', accents.mint, 'rgb(0, 0, 0)'],
        ['.tabbar', surface],
      ]],
      ['discover', [
        ['.talk', accents.mint, 'rgb(0, 0, 0)'],
        ['.search', surface],
        ['.chip', surface, ink],
        ['.rows', surface],
        ['.play', accents.lemon, 'rgb(0, 0, 0)'],
        ['.fab', accents.bubblegum, 'rgb(0, 0, 0)'],
        ['.tab.on', accents.lemon, 'rgb(0, 0, 0)'],
      ]],
      ['friends', [
        ['.req', accents.lemon, 'rgb(0, 0, 0)'],
        ['[data-action="accept"]', accents.mint, 'rgb(0, 0, 0)'],
        ['.post', surface],
        ['[data-go="add-friends"].btn', accents.periwinkle, 'rgb(0, 0, 0)'],
      ]],
      ['signin', [
        ['.form', accents.bubblegum, 'rgb(0, 0, 0)'],
        ['.form .field', surface, ink],
        ['.form .btn', accents.lemon, 'rgb(0, 0, 0)'],
        ['.form .link', 'rgba(0, 0, 0, 0)', 'rgb(0, 0, 0)'],
        ['.alt .btn', surface, ink],
      ]],
      ['drop-why', [
        ['.why', accents.lemon, 'rgb(0, 0, 0)'],
        ['.why .field', paper, ink],
        ['.why .helper', 'rgba(0, 0, 0, 0)', 'rgb(0, 0, 0)'],
        ['.why .btn', surface, ink],
      ]],
      ['song', [
        ['.composer', accents.lemon, 'rgb(0, 0, 0)'],
        ['.composer .field', paper, ink],
        ['.composer .btn', surface, ink],
        ['.song-actions .mint', accents.mint, 'rgb(0, 0, 0)'],
        ['.song-actions .periwinkle', accents.periwinkle, 'rgb(0, 0, 0)'],
        ['.comment', surface],
      ]],
      ['person', [['.me-card', accents.periwinkle, 'rgb(0, 0, 0)'], ['.mini', surface]]],
      ['chats', [['.rows', paper]]],
      ['conversation', [
        ['.bub.me', accents.lemon, 'rgb(0, 0, 0)'],
        ['.bub.them', surface, ink],
        ['.composer-bar', surface],
        ['.composer-bar .icon-btn', accents.lemon, 'rgb(0, 0, 0)'],
      ]],
      ['add-friends', [
        ['.invite', accents.mint, 'rgb(0, 0, 0)'],
        ['.invite .btn', surface, ink],
        ['.rows', paper],
        ['.add-btn.pri', accents.lemon, 'rgb(0, 0, 0)'],
        ['.add-btn:not(.pri)', muted, ink],
      ]],
      ['avatar', [
        ['.seg [aria-selected="true"]', accents.bubblegum, 'rgb(0, 0, 0)'],
        ['.seg [aria-selected="false"]', paper, ink],
        ['.opt output', surface],
        ['.av-head .icon-btn', accents.periwinkle, 'rgb(0, 0, 0)'],
      ]],
      ['edit-profile', [['.field', surface, ink]]],
      ['join', [['.form', surface], ['.field', surface, ink]]],
      ['check-email', [['.btn.pri', accents.lemon, 'rgb(0, 0, 0)']]],
      ['onboarding-avatar', [
        ['[data-action="shuffle"]', accents.periwinkle, 'rgb(0, 0, 0)'],
        ['.seg [aria-selected="true"]', accents.bubblegum, 'rgb(0, 0, 0)'],
      ]],
      ['onboarding-genres', [['.card', surface], ['.mint', accents.mint, 'rgb(0, 0, 0)']]],
      ['onboarding-friends', [['.invite', accents.mint, 'rgb(0, 0, 0)'], ['.rows', paper]]],
      ['welcome', [['.welcome-avatar', accents.bubblegum], ['.me-card', 'rgba(0, 0, 0, 0)', ink]]],
      ['settings', [['.settings-account', surface], ['.settings-row', surface, ink]]],
      ['logout', [['.logout-dialog', surface, ink], ['.profile-backdrop .me-card', accents.bubblegum, 'rgb(0, 0, 0)']]],
      ['send', [['.pick .chk', accents.mint, 'rgb(0, 0, 0)'], ['.field', surface, ink]]],
      ['drop-pick', [['.rows', surface], ['.step.on i', accents.lemon], ['.step.todo i', surface, hint, hint]]],
    ]
    for (const [route, elements] of checks) {
      await page.goto(`/#/${route}`)
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      if (!['logout', 'send', 'avatar', 'edit-profile', 'settings', 'drop-why', 'drop-pick'].includes(route)) {
        await expect(page.locator('#screen > .scr')).toHaveCSS('background-color', paper)
      }
      for (const [selector, background, color, border = ink] of elements) {
        const element = page.locator(`#screen ${selector}`).first()
        await expect(element, `${route} ${selector} background`).toHaveCSS('background-color', background)
        if (color) await expect(element, `${route} ${selector} text`).toHaveCSS('color', color)
        if (await element.evaluate(el => parseFloat(getComputedStyle(el).borderTopWidth) > 0)) {
          await expect(element, `${route} ${selector} border`).toHaveCSS('border-top-color', border)
        }
        if (background !== 'rgba(0, 0, 0, 0)' && await element.evaluate(el => el.classList.contains('sh'))) {
          const offset = await element.evaluate(el => el.classList.contains('btn') && !el.classList.contains('big') ? 4 : 6)
          await expect(element, `${route} ${selector} shadow`).toHaveCSS('box-shadow', `${ink} ${offset}px ${offset}px 0px 0px`)
        }
      }
      if (['profile', 'discover', 'welcome', 'song'].includes(route)) {
        await page.screenshot({ path: testInfo.outputPath(`${route}-${theme}.png`), animations: 'disabled' })
      }
    }
    await page.goto('/#/onboarding-genres')
    const genre = page.getByRole('button', { name: 'Pop', exact: true })
    await genre.click()
    await expect(genre).toHaveCSS('background-color', accents.bubblegum)
    await expect(genre).toHaveCSS('color', 'rgb(0, 0, 0)')
    await page.goto('/#/discover')
    const mood = page.getByRole('button', { name: 'Gym', exact: true })
    await mood.click()
    await expect(mood).toHaveCSS('background-color', accents.lemon)
    await expect(mood).toHaveCSS('color', 'rgb(0, 0, 0)')
    await page.goto('/#/onboarding-friends')
    const friend = page.locator('[data-action="onboardingFriend"]').first()
    await expect(friend).toHaveCSS('background-color', accents.lemon)
    await friend.click()
    await expect(friend).toHaveCSS('background-color', muted)
    await expect(friend).toHaveCSS('color', ink)
  })
}
