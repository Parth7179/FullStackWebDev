import { useState } from "react"
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const addNewBlog = (event) => {
    event.preventDefault()
    if (title === "" || author === "" || url === "") {
      alert("Fill all the details")
      return
    }
      createBlog({
        title: title,
        author: author,
        url: url,
      })
      setTitle("")
      setAuthor("")
      setUrl("")
    
  }
  return (
    <form onSubmit={addNewBlog}>
      <div>
        <label>
          Title:
          <input
            type='text'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Author:
          <input
            type='text'
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          url:
          <input
            type='text'
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>
      </div>
      <button type='submit'>Submit</button>
    </form>
  )
}

export default BlogForm
