/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful1',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Go To Statement Considered Harmful2',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 7,
  },
  {

    title: 'Go To Statement Considered Harmful3',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 3,
  },
]

const initialUser = {
  name: 'A name',
  passwordHash: '123', // this is actually the password, but it will be hashed
  username: 'root',
}

const populateDatabase = async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const userToSave = {
    ...initialUser,
    passwordHash: await bcrypt.hash(initialUser.passwordHash, 10),
  }

  const user = new User(userToSave)
  const savedUser = await user.save()

  const blogsObjects = initialBlogs
    .map((blog) => new Blog({ ...blog, user: savedUser._id }))
  const promiseArray = blogsObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
  const allBlogs = await Blog.find({})
  savedUser.blogs = allBlogs.map((blog) => blog._id)
  await savedUser.save()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  populateDatabase, initialBlogs, blogsInDb, usersInDb,
}
