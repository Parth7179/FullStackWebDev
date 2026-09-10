import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')

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

  const Notification = ({message, messageType}) => {
    if(message === null){
      return null
    }else{
      return( <div className={messageType}>
        {message}
      </div>
      )
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }catch{
      setMessage("Wrong Credentials")
      setMessageType('error')
      setTimeout(()=> {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
  }
  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogUser')
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addNewBlog = (event) => {
    event.preventDefault()

    if(title === '' || author === '' || url === ''){
      alert('Fill all the details')
    }else{
      const newBlog = {
        title: title,
        url: url,
        author: author,
      }

      blogService
        .createBlog(newBlog)
        .then( res => {
          setBlogs(blogs.concat(res))
          setAuthor('')
          setUrl('')
          setTitle('')
          setMessage(`a new blog "${newBlog.title}" by ${newBlog.author} is added!`)
          setMessageType('success')
          setTimeout(() => {
            setMessage(null)
            setMessageType(null)
          }, 5000);
        })
        .catch(error => {
          setMessage(error.response.data.error)
          setMessageType('error')
          setTimeout(() => {
            setMessage(null)
            setMessageType(null)
          }, 5000)
          console.log(error.response.data.error)
        })
        
    }
  }


  if(user === null){
    return(
      <div>
        <h2>Login to Application</h2>
        <Notification message = {message} messageType={messageType}/>
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
      <Notification message = {message} messageType={messageType}/>
      <BlogForm 
        addNewBlog = {addNewBlog}
        title = {title}
        handleTitleChange = {handleTitleChange}
        author = {author}
        handleAuthorChange = {handleAuthorChange}
        url = {url}
        handleUrlChange = {handleUrlChange}
      />
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App