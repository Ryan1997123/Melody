import { test, expect } from '@playwright/test'
import { registerAccountFlowTests } from '../../prototype-react/tests/account-flow-cases.js'

registerAccountFlowTests(test, expect)

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
