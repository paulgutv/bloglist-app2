import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('A blog is created with the right details', async () => {
  const user = userEvent.setup()
  const mockHandler = jest.fn()

  render(<BlogForm createBlog={mockHandler}/>)

  const input1 = screen.getByPlaceholderText('title')
  const input2 = screen.getByPlaceholderText('author')
  const input3 = screen.getByPlaceholderText('url')
  const button = screen.getByText('create')

  await user.type(input1, 'title1' )
  await user.type(input2, 'author1' )
  await user.type(input3, 'url1' )
  await user.click(button)

  expect(mockHandler.mock.calls.length).toBe(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('title1')
  expect(mockHandler.mock.calls[0][0].author).toBe('author1')
  expect(mockHandler.mock.calls[0][0].url).toBe('url1')
})