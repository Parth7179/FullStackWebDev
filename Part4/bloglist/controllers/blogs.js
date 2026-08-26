const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const Bloglist = await Blog.find({})
  response.status(200).json(Bloglist)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if(blog.title === undefined || blog.url === undefined){
    return response.status(400).end()
  }
  const resp = await blog.save()
  response.status(201).json(resp)
})

module.exports = blogRouter