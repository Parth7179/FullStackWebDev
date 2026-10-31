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
    })

    test('a new blog can be created', async ({ page }) => {


      await page.getByRole('button', {name:'Create new Blog'}).click()
      await page.getByLabel('Title:').fill('test title')
      await page.getByLabel('Author:').fill('test author')
      await page.getByLabel('url:').fill('http://testurl.com')
      await page.getByRole('button', {name: 'Submit'}).click()

      await expect(page.getByText('test title test author')).toBeVisible()
    })
  })
})