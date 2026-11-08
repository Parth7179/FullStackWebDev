import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Paper, Button, Typography, Box } from '@mui/material'

import Notification from './Notification'
const Blog = ({ blog, addNewLike, deleteBlogReq, user }) => {
  const navigate = useNavigate()
  const [notification, setNotification] = useState(null)

  const style = {
    padding: 1,
    marginTop: 1
  }
  const removeBtn = {
    color: 'red',
    border: 2,
    margin: 0.5,
    fontSize: 15
  }
  const likeBtn = {
    color: 'blue',
    border: 2,
    margin: 0.5,
    fontSize: 15
  }

  const addLike = (event) => {
    if(!user){
      setNotification({ text:'Please Login in first!', type:'error' })
      setTimeout(() => {
        setNotification(null)
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
  return (
    <Container component={Paper} sx={style}>
      <Notification notification={notification}/>

      <Typography variant = 'h5' sx={{ marginBottom:0.5 }} >{blog.title}</Typography>
      <Typography sx={{ marginBottom:2 }}>By  {blog.author}</Typography>
      <Box sx={{ marginBottom: 1 }}> <a href={blog.url}>{blog.url}</a> </Box>
      <Typography>Added by {blog.user.username} </Typography>
      <Typography>{blog.likes} Likes {user && <Button onClick={addLike} sx={likeBtn}>Like</Button>}
        { blogOwner && <Button onClick={deleteBlog} sx={removeBtn}>Remove</Button> }
      </Typography>
    </Container>
  )
}

export default Blog
