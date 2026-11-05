import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

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
  }
  const padding = {
    padding: 5
  }
  return (
    <div>
      <Router>
        <Link style={padding} to='/'>Blogs</Link>
        {!user &&  <Link style={padding} to='/login'>Login</Link> }
        { user && <button onClick={() => handleLogout()}>logout</button> }

        <Routes>
          <Route path = '/' element ={
            <BlogList user={user} blogs={blogs} setBlogs={setBlogs} />
          }/>
          <Route path='/login' element={
            <LoginForm setUser={setUser}/>
          }/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
