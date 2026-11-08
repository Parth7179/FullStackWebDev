import { useState } from 'react'
import { TextField, Button } from '@mui/material'
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addNewBlog = (event) => {
    event.preventDefault()
    if (title === '' || author === '' || url === '') {
      alert('Fill all the details')
      return
    }
    createBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')

  }
  return (
    <form onSubmit={addNewBlog} >
      <h2>Create new</h2>
      <div>
        <TextField
          label='Title'
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          style={{ margin: 5 }}
        />
      </div>
      <div>
        <TextField
          label='Author'
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          style={{ margin: 5 }}
        />
      </div>
      <div>
        <TextField
          label='url'
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          style={{ margin: 5 }}
        />
      </div>
      <Button type='submit' variant='contained' style={{ margin:10 }}>Submit</Button>
    </form>
  )
}

export default BlogForm
