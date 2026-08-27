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

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  await blog.save()
  response.status(200).end()
})

module.exports = blogRouter