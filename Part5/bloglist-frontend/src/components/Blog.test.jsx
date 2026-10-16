import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  beforeEach(() => {
    const blog = {
      title:'hey',
      author:'heyo',
      url:'https://',
      likes:0,
    }
    render( <Blog blog={blog}/>)
  })

  test('Blogs title and author are visible but lik and url are not', () => {
    const title =  screen.getAllByText(/hey/)
    expect(title[0]).toBeVisible()

    const author = screen.getAllByText(/heyo/)
    expect(author[0]).toBeVisible()

    const url = screen.getByText(/https:/)
    expect(url).not.toBeVisible()

    const likes = screen.getByText(/Likes/)
    expect(likes).not.toBeVisible()
  })

  test('Blogs like and url is only visible after button is clicked', async () => {
    const user = userEvent.setup()

    const url = screen.getByText(/https:/)
    expect(url).not.toBeVisible()

    const likes = screen.getByText(/Likes/)
    expect(likes).not.toBeVisible()


    const viewButton = screen.getByText('View')
    await user.click(viewButton)

    expect(url).toBeVisible()
    expect(likes).toBeVisible()

  })

})