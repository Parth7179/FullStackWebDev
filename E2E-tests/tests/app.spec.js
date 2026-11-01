const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const response = await request.post('/api/testing/reset')
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
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testUser1', 'testUser1')
      await expect(page.getByText('testUser1 is logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testUser1', 'wrong')
      await expect(page.getByText('Wrong Credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testUser1', 'testUser1')
      await expect(
        page.getByText('testUser1 is logged in')
      ).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createNote(page, 'test title', 'test author', 'http://testurl.com')
      await expect(page.getByText(/test title test author/)).toBeVisible()
    })

    test('blog can be liked', async ({ page }) => {
      await createNote(page, 'test title', 'test author', 'http://testurl.com1')
      await expect(page.getByText(/test title test author/)).toBeVisible()

      await page.getByRole('button', { name: 'View' }).click()
      await expect(page.getByText(/Likes 0/)).toBeVisible()
      await page.getByRole('button', { name: 'Like' }).click()
      await expect(page.getByText(/Likes 1/)).toBeVisible()
    })
  })
})