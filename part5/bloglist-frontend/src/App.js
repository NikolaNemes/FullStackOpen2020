import React, { useState, useEffect, useRef } from 'react'
import { Blogs, BlogForm } from './components/Blog'
import { Login, Logout } from './components/Login'
import Togglable from './components/Toggleable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const blogFormRef = useRef()

  const addBlog = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      setBlogs(blogs.concat(newBlog))
      displayMessage('Successfully added new blog', 'notify')
    } catch (e) {
      if (e.response.data.error) {
        displayMessage(e.response.data.error, 'error')
      } else {
        displayMessage('something went wrong', 'error')
      }
    }
  }

  const displayMessage = (message, type) => {
    setErrorMessage({ message, type })
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const onLike = async (blog) => {
    const resultingBlog = await blogService.like(blog)
    setBlogs(blogs.map(blog => blog.id === resultingBlog.id ? resultingBlog: blog))
  }

  const deleteBlog = async (toDelete) => {
    if (window.confirm(`Are you sure you want to delete blog ${toDelete.title} by ${toDelete.author}?`)) {
      try {
        await blogService.remove(toDelete)
        setBlogs(blogs.filter((blog) => blog.id !== toDelete.id))
      } catch (e) {
        if (e.response.data.error) {
          displayMessage(e.response.data.error, 'error')
        } else {
          displayMessage('something went wrong', 'error')
        }
      }
    }

  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      displayMessage('successfully logged in', 'notify')
    } catch (exception) {
      console.log(exception)
      displayMessage('wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.setItem(
      'loggedBlogappUser', ''
    )
    displayMessage('successfully logged out', 'notify')
    setUser(null)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {user === null ? <h2> Login </h2> : <h2>Blogs</h2>}
      <Notification message={errorMessage}/>
      {user !== null && <Logout user={user} handleLogout={handleLogout} />}
      {user === null &&
        <Login setPassword={setPassword} setUsername={setUsername} username={username}
          password={password} handleLogin={handleLogin} />}
      {user !== null &&
        <Togglable buttonLabel="add blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>}
      {user !== null && <Blogs  blogs={sortedBlogs} username={user.username} onLike={onLike} deleteBlog={deleteBlog}/>}
    </div>
  )
}

export default App