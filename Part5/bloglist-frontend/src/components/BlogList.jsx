import { Link } from 'react-router-dom'

const BlogList = ({ user, blogs }) => {
  return(
    <div>
      {user && (
        <div>
          {user.username} is logged in{' '}
          <br />
          <br />
        </div>
      )}
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <li key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
        </li>
      )
      )}
    </div>
  )
}
export default BlogList