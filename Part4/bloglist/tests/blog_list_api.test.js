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

test('missing like property', async () => {
  const newBlog = {
    title: 'abc',
    author: 'PPPP',
    url: 'testblog.com',
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/ )
  const blogs = await helper.blogsInDb()
  const blog = blogs.find(blog => blog.title === 'abc')
  assert.strictEqual(blog.likes,0)
})
test('Blog without title/url is not created', async () => {
  const newBlog = {
    author: 'PPPP',
    url: 'testblog.com',
    likes: 12
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAfterFailedPost = await helper.blogsInDb()
  assert.strictEqual(blogsAfterFailedPost.length, helper.initialBlogs.length)
})

test('successful deletion of a blog with 204', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length -1)

  const ids = blogsAtEnd.map(b => b.id)
  assert(!ids.includes(blogToDelete.id))
})

test('updating blog with 200', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const newBlog = {
    title: 'updated',
    author: 'whoknows',
    url: 'testurl.com',
    likes: 3454
  }
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('updated') && (!titles.includes('2Blog')))
})


after(async () => {
  await mongoose.connection.close()
})