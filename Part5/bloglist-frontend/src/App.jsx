import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(()=>{
    const loggedBlogJSON = window.localStorage.getItem('loggedBlogUser')
    if(loggedBlogJSON){
      const user = JSON.parse(loggedBlogJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const Notification = ({message}) => {
    if(message === null){
      return null
    }else{
      return <div className='error'>
        {message}
      </div>
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    }catch{
      setErrorMessage("Wrong Credentials")
      setTimeout(()=> {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogUser')
  }

  if(user === null){
    return(
      <div>
        <h2>Login to Application</h2>
        <Notification message ={errorMessage}/>
        <form onSubmit={handleLogin}>
          <label>
            Username
            <input 
              type="text" 
              value ={username} 
              onChange={({target}) => setUsername(target.value)}
              />
          </label>
          <label>
            Password
            <input
              type="password"
              value = {password}
              onChange={({target}) => setPassword(target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <p>{user.name} is logged in <button onClick={() => handleLogout()}>logout</button> </p>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App