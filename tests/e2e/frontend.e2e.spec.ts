import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('главная: слоган и новые проекты', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/RedONE/)
    await expect(page.locator('.hero h1')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Новые проекты' })).toBeVisible()
  })

  test('квиз: переход на следующий шаг', async ({ page }) => {
    await page.goto('http://localhost:3000/kviz')
    await expect(page.getByText('Шаг 1/')).toBeVisible()
    await page.getByRole('button', { name: /Далее/ }).click()
    await expect(page.getByText('Шаг 2/')).toBeVisible()
  })
})
