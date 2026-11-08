import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLoginFunc = async (event) => {
    event.preventDefault()

    handleLogin(username, password)
    setUsername('')
    setPassword('')

  }

  return(
    <div>
      <h2>Login to Application</h2>
      <form onSubmit={handleLoginFunc}>
        <div>
          <TextField
            label='Username'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            style={{ margin: 5 }}
          />
        </div>

        <div>
          <TextField
            label='Password'
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            style={{ margin: 5 }}
          />
        </div>
        <Button type='submit' variant='contained' style={{ margin:10 }}>Submit</Button>
      </form>
    </div>
  )

}

export default LoginForm