import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('Blog form calls submit handler with correct data', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const blogInput = {
    url: 'www.url.com',
    author: 'A author',
    title: 'A title',
  }

  const titleInput = component.container.querySelector('#titleInput')
  const authorInput = component.container.querySelector('#authorInput')
  const urlInput = component.container.querySelector('#urlInput')
  const form = component.container.querySelector('form')

  fireEvent.change(titleInput, {
    target: { value: blogInput.title }
  })
  fireEvent.change(authorInput, {
    target: { value: blogInput.author }
  })
  fireEvent.change(urlInput, {
    target: { value: blogInput.url }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(blogInput)
})