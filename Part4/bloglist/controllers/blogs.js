const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const Bloglist = await Blog.find({}).populate('user', '-blogs' )
  response.status(200).json(Bloglist)
})




blogRouter.post('/', userExtractor, async (request, response) => {
  const blogData = request.body
  const user = request.user

  if(!user){
    return response.status(401).json({ error:'User id missing or invalid' })
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



blogRouter.delete('/:id',userExtractor, async (request, response) => {
  const userId = request.user.id

  if(!userId){
    return response.status(401).json({ error:'user id missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(404).end()
  }

  if(blog.user.toString() === userId.toString()){
    await Blog.findByIdAndDelete(blog.id)
    return response.status(204).end()
  }
  return response.status(403).json({ error:'Deleting someone else blog' })


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