import React, { useState } from 'react'

const Blog = ({ blog, onLike, username, deleteBlog }) => {

  const [detailedView, setDetailedView] = useState(false)
  if (detailedView) {
    return(
      <div className={`blog ${blog.title}`}>
        {blog.title} <button onClick={() => setDetailedView(false)}>hide</button> <br/>
        {blog.url} <br/>
        likes {blog.likes} <button onClick={() => {onLike(blog)}}>like</button><br/>
        {blog.author}
        {blog.user.username === username && <button onClick={() => {deleteBlog(blog)}}>delete</button>}
      </div>
    )
  } else {
    return(
      <div className={`blog ${blog.title}`}>
        {blog.title} {blog.author} <button onClick={() => setDetailedView(true)}>show</button> <br/>
      </div>)
  }
}

export default Blog
