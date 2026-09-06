const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)


let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password',10)
  const user = new User({ username:'test', passwordHash })
  await user.save()

  const res = await api
    .post('/api/login')
    .send({ username:'test', password: 'password' })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  token = res.body.token
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
test('post is created and no of posts are correct', async () => {
  const newBlog = {
    title: 'abc',
    author: 'PPPP',
    url: 'testblog.com',
    likes: 123
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAfterFailedPost = await helper.blogsInDb()
  assert.strictEqual(blogsAfterFailedPost.length, helper.initialBlogs.length)
})

test('successful deletion of a blog with 204', async () => {
  const newBlog = {
    title: 'abc',
    author: 'PPPP',
    url: 'testblog.com',
    likes: 123
  }


  const blogToDelete = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogsAtStart = await helper.blogsInDb()
  await api
    .delete(`/api/blogs/${blogToDelete.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length -1)

  const ids = blogsAtEnd.map(b => b.id)
  assert(!ids.includes(blogToDelete.body.id))
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

test('blog contains users information', async () => {
  const newBlog = {
    title: 'updated',
    author: 'whoknows',
    url: 'testurl.com',
    likes: 3454
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await api
    .get('/api/blogs')
    .expect(200)
  const blog = blogs.body.find(blog => blog.title === 'updated')

  assert.ok(blog.user)
  assert.ok(blog.user.username)
})

test('401 when token not provided', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const newBlog = {
    title: 'updated',
    author: 'whoknows',
    url: 'testurl.com',
    likes: 3454
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
})


after(async () => {
  await mongoose.connection.close()
})