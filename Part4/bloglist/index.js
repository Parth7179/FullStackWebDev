const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])
require('dotenv').config()
const Blog = require('./models/blog')
const express = require('express')
const app = express()


app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  blog.save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('server is running on port ', PORT)
})