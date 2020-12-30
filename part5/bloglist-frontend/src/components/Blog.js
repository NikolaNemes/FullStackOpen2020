import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLike, username, deleteBlog }) => {

  const [detailedView, setDetailedView] = useState(false)
  if (detailedView) {
    return(
      <div className="blog">
        {blog.title} <button onClick={() => setDetailedView(false)}>hide</button> <br/>
        {blog.url} <br/>
        likes {blog.likes} <button onClick={() => {onLike(blog)}}>like</button><br/>
        {blog.author}
        {blog.user.username === username && <button onClick={() => {deleteBlog(blog)}}>delete</button>}
      </div>
    )
  } else {
    return(
      <div className="blog">
        {blog.title} {blog.author} <button onClick={() => setDetailedView(true)}>show</button> <br/>
      </div>)
  }
}

const Blogs = ({ blogs, onLike, username, deleteBlog }) => (
  <div>
    {blogs.map(blog => <Blog key={blog.id} blog={blog} onLike={onLike} username={username} deleteBlog={deleteBlog}/>)}
  </div>)


const BlogForm = ({ createBlog }) => {

  const [newBlog, setNewBlog] = useState({
    url: '', title: '', author: ''
  })

  const addBlog = async (e) => {
    e.preventDefault()
    createBlog(newBlog)
    setNewBlog({ url: '', title: '', author: '' })
  }

  return (
    <form onSubmit={addBlog}>
      Title:
      <input value={newBlog.title} onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}/> <br/>
      Author:
      <input value={newBlog.author} onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}/> <br/>
      Url:
      <input value={newBlog.url} onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}/> <br/>
      <button type="submit">save</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export { Blog, Blogs, BlogForm }
