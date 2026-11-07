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
    await request.post('/api/users', {
      data: {
        name: 'testUser2',
        username: 'testUser2',
        password: 'testUser2',
      }
    })

    await page.goto('/') // using baseUrl from playwright config.js
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByText('Login').click()
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
      await expect(page.getByText(/test title by test author/)).toBeVisible()
    })

    test('blog can be liked', async ({ page }) => {
      
      await createNote(page, 'test title', 'test author', 'http://testurl.com1')
      await expect(page.getByText(/test title by test author/)).toBeVisible()

      await page.getByText(/test title by test author/).click()
      await expect(page.getByText(/Likes 0/)).toBeVisible()
      await page.getByRole('button', { name: 'Like' }).click()
      await expect(page.getByText(/Likes 1/)).toBeVisible()
    })

    test('blog can only be removed by its owner', async({ page }) => {
      // blog post by testUser1
      await createNote(page, 'test title1', 'test author1', 'http://testurl.com1')
      await createNote(page, 'test title2', 'test author2', 'http://testurl.com1')

      await page.getByText('test title1 by test author1').click()
      await page.getByRole('button',{name: 'Remove'}).click()
      await expect(page.getByText('test title1 test author1')).not.toBeVisible()

      await page.getByRole('button', {name: 'logout'}).click()
      await page.getByText('Login').click()
      await loginWith(page, 'testUser2', 'testUser2')

      await page.getByText('test title2 by test author2').click()
      await expect(page.getByRole('button', {name: 'Remove'})).not.toBeVisible()


    })

    // test.only('blogs are arranged in order according to the likes', async ({ page }) => {
    //   await createNote(page, 'test title1', 'test author1', 'http://testurl.com1')
    //   await createNote(page, 'test title2', 'test author2', 'http://testurl.com1')

    //   const blogElement = page.locator('.blog')
    //   await expect(blogElement.first()).toContainText('test title1 test author1')
    //   await expect(blogElement.nth(1)).toContainText('test title2 test author2')

    //   await blogElement.nth(1).getByRole('button', {name: 'View'}).click()
    //   await expect(blogElement.nth(1).getByText(/Likes 0/)).toBeVisible()
    //   await blogElement.nth(1).getByRole('button', {name: 'Like'}).click()
    //   await expect(blogElement.first().getByText(/Likes 1/)).toBeVisible()

    //   await expect(blogElement.first()).toContainText('test title2 test author2')
    //   await expect(blogElement.nth(1)).toContainText('test title1 test author1')

    // })
  })
})