import { useState } from 'react'
const Blog = ({ blog, addNewLike, deleteBlogReq }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const addLike = (event) => {
    event.preventDefault()
    addNewLike({ ...blog,likes: blog.likes+1 })
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    const conf = confirm(`Remove blog '${blog.title}'?`)
    if(conf){
      console.log(blog)
      deleteBlogReq(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(true)}>View</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} <button onClick={() => setVisible(false)}>Hide</button>
        <br />
        {blog.url} <br />
        Likes {blog.likes} <button onClick={addLike}>Like</button> <br />
        {blog.author} <br />
        <button onClick={deleteBlog}>Remove</button>
      </div>
    </div>
  )
}

export default Blog
