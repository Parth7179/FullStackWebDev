const BlogForm = (props) => {
  return(
    <form onSubmit={props.addNewBlog}>
      <label>Title: <input type="text" value={props.title} onChange={props.handleTitleChange} /></label>
      <label>Author: <input type="text" value={props.author} onChange={props.handleAuthorChange} /></label>
      <label>url: <input type="text" value={props.url} onChange={props.handleUrlChange}/></label>
      <button type="submit">Submit</button>
    </form>
  )
}

export default BlogForm