import { useState,useRef } from 'react'
import { Link } from 'react-router-dom'

import Togglable from './Togglable'
import Notification from './Notification'
import BlogForm from './BlogForm'
import blogService from '../services/blogs'

const BlogList = ({ user, blogs, setBlogs }) => {
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const blogFormRef = useRef()
  const blogForm = () => {
    return (
      <Togglable buttonLabel='Create new Blog' ref={blogFormRef}>
        <BlogForm createBlog={addNewBlog} />
      </Togglable>
    )
  }

  const addNewBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .createBlog(blogObject)
      .then((res) => {
        setBlogs(blogs.concat(res))
        setMessage(
          `a new blog "${blogObject.title}" by ${blogObject.author} is added!`,
        )
        setMessageType('success')
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 5000)
      })
      .catch((error) => {
        setMessage(error.response.data.error)
        setMessageType('error')
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 5000)
        console.log(error.response.data.error)
      })
  }







  return(
    <div>
      <Notification message={message} messageType={messageType} />
      {user && (
        <div>
          {user.username} is logged in{' '}
          <br />
          <br />
          { blogForm() }
        </div>
      )}
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <li key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
        </li>
      )
      )}
    </div>
  )
}
export default BlogList