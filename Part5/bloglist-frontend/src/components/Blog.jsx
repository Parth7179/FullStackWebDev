import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Notification from './Notification'
const Blog = ({ blog, addNewLike, deleteBlogReq, user }) => {
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5,
  }

  const addLike = (event) => {
    if(!user){
      setMessage('Please Login in first!')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
      return
    }
    event.preventDefault()
    addNewLike({ ...blog,likes: blog.likes+1 })
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    const conf = confirm(`Remove blog '${blog.title}'?`)
    if(conf){
      console.log(blog)
      deleteBlogReq(blog)
      navigate('/')
    }
  }
  if(!blog){
    return null
  }
  const blogOwner = user && blog.user && user.id === (blog.user.id || blog.user)
  console.log(blog)
  return (
    <div className='blog' style={blogStyle}>
      <Notification message={message} messageType={messageType} />

      <h3> {blog.author}: {blog.title} </h3>
      <a href={blog.url}>{blog.url}</a> <br />
      Likes {blog.likes} <button onClick={addLike}>Like</button> <br />
      Added by {blog.author} <br />
      { blogOwner &&
      <button onClick={deleteBlog}>Remove</button>
      }
    </div>
  )
}

export default Blog
