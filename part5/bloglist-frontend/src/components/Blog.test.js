import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders simplified view', () => {
  const blog = {
    author: 'Anon author',
    url: 'www.url.com',
    likes: 5,
    title: 'Fancy title',
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).not.toHaveTextContent(blog.likes)
  expect(component.container).not.toHaveTextContent(blog.url)
})

test('renders detailed view', () => {
  const blog = {
    author: 'Anon author',
    url: 'www.url.com',
    likes: 5,
    title: 'Fancy title',
    user: {
      username: 'A username'
    },
  }

  const component = render(
    <Blog blog={blog} username={'A username'}/>
  )

  const button = component.getByText('show')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.likes)
  expect(component.container).toHaveTextContent(blog.url)
})

test('like button callback is called apropriate number of times', () => {
  const blog = {
    author: 'Anon author',
    url: 'www.url.com',
    likes: 5,
    title: 'Fancy title',
    user: {
      username: 'A username'
    },
  }

  const mockLikeHandler = jest.fn()

  const component = render(
    <Blog blog={blog} username={'A username'} onLike={mockLikeHandler}/>
  )

  const showButton = component.getByText('show')
  fireEvent.click(showButton)

  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockLikeHandler.mock.calls).toHaveLength(2)
})

