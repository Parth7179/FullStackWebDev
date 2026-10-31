const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'testUser1',
        username: 'testUser1',
        password: 'testUser1',
      }
    })


    await page.goto('/') // using baseUrl from playwright config.js
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Login to Application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({page}) => {
      await loginWith(page, 'testUser1', 'testUser1')
      await expect(page.getByText('testUser1 is logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({page}) => {
      await loginWith(page, 'testUser1', 'wrong')
      await expect(page.getByText('Wrong Credentials')).toBeVisible()
    })
  })
})