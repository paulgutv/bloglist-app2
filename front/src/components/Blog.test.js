import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'title',
  author: 'author',
  url: 'url',
  user: {
    name: 'Pepe'
  },
  id: '12345'
}

const user = {
  name: 'Pepe'
}

const likes = [
  { id: '12345', likes: 55 }
]

test('render author and title by default', () => {
  render(<Blog blog={blog} />)

  const element = screen.getByText('title - author')
  expect(element).toBeDefined()

  const element2 = screen.queryByText('url')
  expect(element2).toBeNull()
})

test('render url and likes when button is clicked', async () => {
  const user1 = userEvent.setup()

  render(<Blog blog={blog} user={user} likes={likes} />)

  const button = screen.getByText('show')
  await user1.click(button)

  const element = screen.getByText('url')
  expect(element).toBeDefined()

  const element2 = screen.getByText('likes 55')
  expect(element2).toBeDefined()
})

test('like button is clicked twice', async () => {
  const user1 = userEvent.setup()
  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} user={user} likes={likes} handleLike={mockHandler}/>
  )
  const button1 = screen.getByText('show')
  await user1.click(button1)

  const button2 = screen.getByText('like')
  await user1.click(button2)

  expect(mockHandler.mock.calls.length).toBe(1)
})