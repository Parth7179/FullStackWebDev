const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: '2Blog',
    author: 'Parthoii',
    url: 'firstblog2.co',
    likes: 232322
  },
  {
    title: '1Blog',
    author: 'Parthoii',
    url: 'firstblog1.co',
    likes: 233
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = { initialBlogs, blogsInDb, usersInDb }