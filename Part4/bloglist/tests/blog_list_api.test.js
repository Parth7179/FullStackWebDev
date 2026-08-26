const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')

const api = supertest(app)
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as Json', async () => {
  const resultBlogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(helper.initialBlogs.length, resultBlogs.body.length)
})

test('verify id', async () => {
  const result = await api
    .get('/api/blogs')
    .expect(200)
  result.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })

})
test('post is created and no of posts are correcr', async () => {
  const newBlog = {
    title: 'abc',
    author: 'PPPP',
    url: 'testblog.com',
    likes: 123
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/ )

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const blogTitles = blogsAtEnd.map(blog => blog.title)
  assert(blogTitles.includes('abc'))

})


after(async () => {
  await mongoose.connection.close()
})