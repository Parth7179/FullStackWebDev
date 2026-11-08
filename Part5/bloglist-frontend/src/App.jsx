import { useState, useEffect } from 'react'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { BrowserRouter as Router, Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

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

  const handleLogin = async ( username, password) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setNotification({ text:'Logged in!', type:'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      navigate('/')

    } catch {
      setNotification({ text:'Wrong Credentials!', type:'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogUser')
    setNotification({ text:'Logged out!', type:'success' })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
    navigate('/')
  }

  const addNewBlog = (blogObject) => {
    blogService
      .createBlog(blogObject)
      .then((res) => {
        navigate('/')
        setBlogs(blogs.concat(res))
        setNotification({ text:`a new blog "${blogObject.title}" by ${blogObject.author} is added!`, type:'success' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch((error) => {

        setNotification({ text:`${error.response.data.error}`, type:'error' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        console.log(error.response.data.error)
      })
  }

  const deleteBlogReq = (blogObject) => {
    blogService
      .deleteBlog(blogObject.id)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id!==blogObject.id))
        setNotification({ text:`"${blogObject.title}" by ${blogObject.author} is Removed!`, type:'success' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        navigate('/')
      })
      .catch((error) => {
        setNotification({ text:`${error.response.data.error}`, type:'error' })
        setTimeout(() => {
          setNotification(null)
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
        setNotification({ text:`${error.response.data.error}`, type:'error' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        console.log(error.response.data.error)
      })
  }
  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }
  const blog = match? blogs.find(blog => blog.id === match.params.id): null
  return (
    <Container style={{ margin: 10 }}>
      <AppBar position='static'>
        <Toolbar>
          <Button color='inherit' component= {Link} to='/' sx={style} >Blogs</Button>
          {!user &&  <Button color='inherit' component= {Link} to='/login' sx={style} >Login</Button>}
          { user &&  <Button color='inherit' component= {Link} to='/create' sx={style} >new blog</Button>}
          { user && <Button color='inherit' onClick={() => handleLogout()} sx={style} >logout</Button>}
        </Toolbar>
      </AppBar>


      <Notification notification={notification} />

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
          <LoginForm setUser={setUser} handleLogin={handleLogin}/>
        }/>
        <Route path = '/create' element ={
          <BlogForm createBlog={addNewBlog} />
        }/>
      </Routes>
    </Container>
  )
}

export default App
