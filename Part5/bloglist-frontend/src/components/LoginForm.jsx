import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import blogService from '../services/blogs/'
import loginService from '../services/login'
import Notification from './Notification'

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const navigate = useNavigate()


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
      setUsername('')
      setPassword('')
    } catch {
      setMessage('Wrong Credentials')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 5000)
    }
  }

  return(
    <div>
      <Notification message={message} messageType={messageType} />
      <h2>Login to Application</h2>
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

export default LoginForm