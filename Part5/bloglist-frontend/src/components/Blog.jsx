import { useState } from "react"
const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? "none" : "" }
  const showWhenVisible = { display: visible ? "" : "none" }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
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
        Likes {blog.likes} <button>Like</button> <br />
        {blog.author} <br />
      </div>
    </div>
  )
}

export default Blog
