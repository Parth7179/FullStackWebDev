const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const Bloglist = await Blog.find({}).populate('user', '-blogs' )
  response.status(200).json(Bloglist)
})


blogRouter.post('/', async (request, response) => {
  const blogData = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({ error:'invalid token' })
  }

  const user = await User.findById(decodedToken.id)

  if(!user){
    return response.status(400).json({ error:'User id missing or invalid' })
  }
  if(!blogData || blogData.title === undefined || blogData.url === undefined){
    return response.status(400).end()
  }

  const blog = new Blog({ ...blogData, user: user._id })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(blog)
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
  response.status(200).json(blog)
})

module.exports = blogRouter