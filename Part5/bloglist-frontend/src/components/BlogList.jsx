import { useState,useRef } from 'react'
import Togglable from './Togglable'
import Notification from './Notification'
import BlogForm from './BlogForm'
import Blog from './Blog'
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


  const addNewLike = (blogObject) => {
    blogService
      .likeBlog(blogObject)
      .then((res) => {
        setBlogs(
          blogs
            .map((blog) => (blog.id === res.id ? res : blog))
            .sort((a, b) => b.likes - a.likes),
        )
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

  const deleteBlogReq = (blogObject) => {
    blogService
      .deleteBlog(blogObject.id)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id!==blogObject.id))
        setMessage(
          `"${blogObject.title}" by ${blogObject.author} is Removed!`,
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
        <Blog
          key={blog.id}
          blog={blog}
          addNewLike={addNewLike}
          deleteBlogReq={deleteBlogReq}
          user = {user}
        />
      ))}
    </div>
  )
}
export default BlogList