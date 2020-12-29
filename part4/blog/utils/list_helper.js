const collection = require('lodash/collection')

const dummy = () => 1

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const byAuthor = collection.groupBy(blogs, (blog) => blog.author)
  const authorAndNumberOfBlogs = Object.keys(byAuthor)
    .map((key) => ({ author: key, blogs: byAuthor[key].length }))
  return authorAndNumberOfBlogs
    .reduce((maxAuthor, current) => ((maxAuthor.blogs < current.blogs)
      ? current
      : maxAuthor), { blogs: -Infinity })
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const byAuthor = collection.groupBy(blogs, (blog) => blog.author)
  const authorAndNumberOfLikes = Object.keys(byAuthor)
    .map((key) => ({
      author: key,
      likes: byAuthor[key].reduce((total, current) => total + current.likes, 0),
    }))
  return authorAndNumberOfLikes
    .reduce((maxAuthor, current) => ((maxAuthor.likes < current.likes)
      ? current
      : maxAuthor), { likes: -Infinity })
}

const totalLikes = (blogs) => (blogs.length === 0
  ? 0
  : blogs.reduce((sum, blog) => sum + blog.likes, 0))

const favoriteBlog = (blogs) => (blogs.length === 0
  ? null
  : blogs.reduce((maxBlog, current) => (maxBlog.likes <= current.likes
    ? current
    : maxBlog), { likes: -Infinity }))

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
}
