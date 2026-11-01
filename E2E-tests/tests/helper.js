const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Submit' }).click()
}

const createNote = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create new Blog' }).click()
  await page.getByLabel('Title:').fill(title)
  await page.getByLabel('Author:').fill(author)
  await page.getByLabel('url:').fill(url)
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(
    page.getByText(`${title} ${author}`)
  ).toBeVisible()
}

module.exports = { loginWith, createNote }