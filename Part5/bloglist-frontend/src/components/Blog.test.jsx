import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  let view
  let user
  let blog
  let addNewLike


  beforeEach(() => {
    blog = {
      title:'hey',
      author:'heyo',
      url:'https://',
      likes:0,
      user:{
        id:'123'
      }
    }
    user = null

    addNewLike = vi.fn()

    view = render(
      <MemoryRouter>
        <Blog blog={blog} user={user} addNewLike={addNewLike}/>
      </MemoryRouter>
    )
  })

  test('Blogs title and author are visible but cannot like if unauthenticated', () => {

    const title =  screen.getAllByText(/hey/)
    expect(title[0]).toBeVisible()

    const author = screen.getAllByText(/heyo/)
    expect(author[0]).toBeVisible()
    const likes = screen.getByText(/Likes 0/)
    expect(likes).toBeVisible()

    const likeButton = screen.queryByRole('button', { name: 'Like' } )
    expect(likeButton).toBeNull()

  })

  test('Authenticated users who are not blog creator can only see like button', async () => {
    user = {
      id:'3423',
      username:'test-user2',
      token:'fake-token2'
    }
    view.rerender(
      <MemoryRouter>
        <Blog blog={blog} user={user} addNewLike={addNewLike}/>
      </MemoryRouter>
    )

    const userEv = userEvent.setup()
    const likeButton = screen.getByText('Like')
    await userEv.click(likeButton)
    await userEv.click(likeButton)
    expect(addNewLike.mock.calls).toHaveLength(2)

    const removeButton = screen.queryByRole('button', { name:'Remove' })
    expect(removeButton).toBeNull()
  })

  test('blog creator can see the delete button', () => {
    user = {
      id:'123',
      username:'test-user',
      token:'fake-token'
    }
    view.rerender(
      <MemoryRouter>
        <Blog blog={blog} user={user} addNewLike={addNewLike}/>
      </MemoryRouter>
    )
    const deleteButton = screen.getByText('Remove')
    expect(deleteButton).toBeVisible()

  })

})