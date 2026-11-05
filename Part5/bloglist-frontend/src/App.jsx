import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { BrowserRouter as Router, Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedBlogJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedBlogJSON) {
      const user = JSON.parse(loggedBlogJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogUser')
    navigate('/')
  }

  const addNewBlog = (blogObject) => {
    // blogFormRef.current.toggleVisibility()
    blogService
      .createBlog(blogObject)
      .then((res) => {
        navigate('/')
        setBlogs(blogs.concat(res))
        setMessageType('success')
        setMessage(
          `a new blog "${blogObject.title}" by ${blogObject.author} is added!`,
        )
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
        navigate('/')
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
  const blog = match? blogs.find(blog => blog.id === match.params.id): null
  const padding = {
    padding: 5
  }
  return (
    <div>
      <div>
        <Link style={padding} to='/'>Blogs</Link>
        {!user &&  <Link style={padding} to='/login'>Login</Link> }
        { user &&  <Link style={padding} to='/create'>new blog</Link> }
        { user && <button onClick={() => handleLogout()}>logout</button> }
      </div>

      <Notification
        message={message}
        messageType={messageType}
      />

      <Routes>
        <Route path='/blogs/:id' element={
          <Blog
            blog={blog}
            addNewLike={addNewLike}
            deleteBlogReq={deleteBlogReq}
            user = {user}
          />
        }
        />
        <Route path = '/' element ={
          <BlogList user={user} blogs={blogs} setBlogs={setBlogs} />
        }/>
        <Route path='/login' element={
          <LoginForm setUser={setUser}/>
        }/>
        <Route path = '/create' element ={
          <BlogForm createBlog={addNewBlog} />
        }/>
      </Routes>
    </div>
  )
}

export default App
