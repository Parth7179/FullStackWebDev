import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import BlogForm from "./components/BlogForm"
import Togglable from "./components/Togglable"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a,b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedBlogJSON = window.localStorage.getItem("loggedBlogUser")
    if (loggedBlogJSON) {
      const user = JSON.parse(loggedBlogJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const Notification = ({ message, messageType }) => {
    if (message === null) {
      return null
    } else {
      return <div className={messageType}>{message}</div>
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch {
      setMessage("Wrong Credentials")
      setMessageType("error")
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
  }
  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem("loggedBlogUser")
  }

  const addNewLike = (blogObject) => {
    blogService
      .likeBlog(blogObject)
      .then((res) => {
        setBlogs(
          blogs
            .map((blog) => (blog.id === res.id ? res : blog))
            .sort((a,b) => b.likes - a.likes)
        )
      })
      .catch((error) => {
        setMessage(error.response.data.error)
        setMessageType("error")
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 5000)
        console.log(error.response.data.error)
      })
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
        setMessageType("success")
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 5000)
      })
      .catch((error) => {
        setMessage(error.response.data.error)
        setMessageType("error")
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 5000)
        console.log(error.response.data.error)
      })
  }

  const blogFormRef = useRef()
  const blogForm = () => {
    return (
      <Togglable buttonLabel='Create new Blog' ref={blogFormRef}>
        <BlogForm createBlog={addNewBlog} />
      </Togglable>
    )
  }
  const loginForm = () => {
    return (
      <div>
        <h2>Login to Application</h2>
        <Notification message={message} messageType={messageType} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              Username
              <input
                type='text'
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              Password
              <input
                type='password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>

          <button type='submit'>Submit</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={message} messageType={messageType} />
      {!user && loginForm()}
      {user && (
        <div>
          {user.name} is logged in{" "}
          <button onClick={() => handleLogout()}>logout</button> {blogForm()}
        </div>
      )}
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} addNewLike={addNewLike} />
      ))}
    </div>
  )
}

export default App
