import React, { useState } from 'react'
import PropTypes from 'prop-types'

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
      <input id="titleInput" value={newBlog.title} onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}/> <br/>
        Author:
      <input id="authorInput" value={newBlog.author} onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}/> <br/>
        Url:
      <input id="urlInput" value={newBlog.url} onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}/> <br/>
      <button id="blogSubmit" type="submit">save</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm