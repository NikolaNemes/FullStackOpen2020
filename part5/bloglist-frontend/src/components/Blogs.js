import React from 'react'
import Blog from './Blog'

const Blogs = ({ blogs, onLike, username, deleteBlog }) => (
  <div>
    {blogs.map(blog => <Blog key={blog.id} blog={blog} onLike={onLike} username={username} deleteBlog={deleteBlog}/>)}
  </div>)

export default Blogs