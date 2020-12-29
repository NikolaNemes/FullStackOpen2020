const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { token } = request
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  // eslint-disable-next-line no-underscore-dangle
  const blog = new Blog({ ...request.body, user: user._id })
  const savedBlog = await blog.save()
  // eslint-disable-next-line no-underscore-dangle
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  return response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const { token } = request
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  /* till now our behaviour has been to return 204 for
   missing blogs, because delete should be 'idempotent' */
  if (!blog) {
    return response.status(204).end()
  }
  if (blog.user.toString() !== decodedToken.id) {
    return response.status(401).json({ error: 'user does not own this blog' })
  }
  await Blog.findByIdAndRemove(request.params.id)
  const user = await User.findById(decodedToken.id)
  user.blogs = user.blogs.filter((userBlog) => userBlog !== request.token.id)
  await user.save()
  return response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { body } = request
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes: body.likes }, { new: true, runValidators: true, context: 'query' })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogRouter
