const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')


const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

describe('when there is initially a user created', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'test', passwordHash })

    await user.save()
  })

  test('user without username is not created', async () => {

    const usersAtStart = await helper.usersInDb()
    const newUser = {
      password: 'noUsername'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('user without password is not created', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'hoiii'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)

  })

  test('user with username shorter than 3 characters is not created', async () => {
    const newUser = {
      username: 'hi',
      password: 'hwejjbdg'
    }
    const usersAtStart = await helper.usersInDb()
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
  test('User with password shorter than 3 characters is not created', async () => {
    const newUser = {
      username: 'h55445i',
      password: '12'
    }
    const usersAtStart = await helper.usersInDb()
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('User with duplicate username is not created', async () => {
    const newUser = {
      username: 'test',
      password: '122323'
    }
    const usersAtStart = await helper.usersInDb()
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('a valid user is created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newuser = {
      username: 'validuser',
      password: 'imValid',
    }

    await api
      .post('/api/users')
      .send(newuser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length+1, usersAtEnd.length)
  })

  test('user contains their blogs', async () => {
    const newBlog = {
      title: 'updated',
      author: 'whoknows',
      url: 'testurl.com',
      likes: 3454
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.ok(response.body[0].blogs[0])
  })

  after(async () => {
    mongoose.connection.close()
  })
})
