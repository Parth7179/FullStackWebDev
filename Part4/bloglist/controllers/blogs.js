const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const Bloglist = await Blog.find({})
  response.status(200).json(Bloglist)
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)
  blog.save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogRouter