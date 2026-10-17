import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('Creating new blog' , async () => {

  const blog = {
    title:'Titleo',
    author:'Authoro',
    url : 'https://url.com',
  }

  const createBlog = vi.fn()
  const user = userEvent.setup()
  render(<BlogForm createBlog={createBlog}/>)

  const titleInput = screen.getByLabelText('Title:')
  await user.type(titleInput, 'Titleo')

  const authorInput = screen.getByLabelText('Author:')
  await user.type(authorInput, 'Authoro')

  const urlInput = screen.getByLabelText('url:')
  await user.type(urlInput, 'https://url.com')

  const submitButton = screen.getByText('Submit')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toStrictEqual(blog)


})