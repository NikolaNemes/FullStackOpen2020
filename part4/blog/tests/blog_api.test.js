const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await helper.populateDatabase()
})

afterAll(() => {
  mongoose.connection.close()
})

describe('when blogs are retrieved', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have id property', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('when blogs are sent to the server', () => {
  test('blogs are saved to database', async () => {
    const login = {
      username: 'root',
      password: '123',
    }

    const tokenResponse = await api
      .post('/api/login')
      .send(login)
      .expect(200)
    const token = tokenResponse.body

    const newBlog = {
      title: 'New title',
      author: 'Author of blog',
      url: 'www.fancyurl.com',
      likes: 4,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token.token}`)
      .send(newBlog)
      .expect(201)

    const blogsAfterAddition = await helper.blogsInDb()

    expect(blogsAfterAddition.length).toBe(1 + helper.initialBlogs.length)

    const savedObject = blogsAfterAddition.find((blog) => blog.id === response.body.id)
    expect(newBlog.title).toBe(savedObject.title)
    expect(newBlog.author).toBe(savedObject.author)
    expect(newBlog.url).toBe(savedObject.url)
    expect(newBlog.likes).toBe(savedObject.likes)
  })

  test('token has to be sent in order to add new blog', async () => {
    const newBlog = {
      title: 'New title',
      author: 'Author of blog',
      url: 'www.fancyurl.com',
      likes: 4,
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
    expect(response.body.error).toBe('token missing')
  })

  test('blog likes defaults to 0', async () => {
    const login = {
      username: 'root',
      password: '123',
    }

    const tokenResponse = await api
      .post('/api/login')
      .send(login)
      .expect(200)
    const token = tokenResponse.body

    const newBlog = {
      title: 'New title',
      author: 'Author of blog',
      url: 'www.fancyurl.com',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token.token}`)
      .send(newBlog)
      .expect(201)

    expect(response.body.likes).toBe(0)

    const blogsAfterAddition = await helper.blogsInDb()
    const savedObject = blogsAfterAddition.find((blog) => blog.id === response.body.id)

    expect(savedObject.likes).toBe(0)
  })

  test('blog has to have title and url', async () => {
    const login = {
      username: 'root',
      password: '123',
    }

    const tokenResponse = await api
      .post('/api/login')
      .send(login)
      .expect(200)
    const token = tokenResponse.body

    const noUrl = {
      author: 'Author of blog',
      title: 'New title',
    }
    const noTitle = {
      author: 'Author of blog',
      url: 'www.fancyurl.com',
    }
    const noUrlNoTitle = {
      author: 'Author of blog',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token.token}`)
      .send(noUrl)
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token.token}`)
      .send(noTitle)
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token.token}`)
      .send(noUrlNoTitle)
      .expect(400)
  })
})

describe('when blogs are deleted', () => {
  test('blog is deleted when correct id is selected', async () => {
    const login = {
      username: 'root',
      password: '123',
    }

    const tokenResponse = await api
      .post('/api/login')
      .send(login)
      .expect(200)
    const token = tokenResponse.body

    const blogsBeforeDeletion = await helper.blogsInDb()
    const idOfBlog = blogsBeforeDeletion[0].id
    await api.delete(`/api/blogs/${idOfBlog}`)
      .set('Authorization', `Bearer ${token.token}`)
      .expect(204)
    const blogsAfterDeletion = await helper.blogsInDb()
    expect(blogsBeforeDeletion.length).toBe(1 + blogsAfterDeletion.length)
  })

  test('if id is malformed, appropriate response is returned', async () => {
    const login = {
      username: 'root',
      password: '123',
    }

    const tokenResponse = await api
      .post('/api/login')
      .send(login)
      .expect(200)
    const token = tokenResponse.body

    await api.delete(`/api/blogs/${'MalformedId'}`)
      .set('Authorization', `Bearer ${token.token}`)
      .expect(400)
  })

  test('if no blog with given id exists, no extra deletions happen and 204 is returned', async () => {
    const login = {
      username: 'root',
      password: '123',
    }

    const tokenResponse = await api
      .post('/api/login')
      .send(login)
      .expect(200)
    const token = tokenResponse.body

    const blogsBeforeDeletion = await helper.blogsInDb()
    const idOfBlog = blogsBeforeDeletion[0].id
    await api.delete(`/api/blogs/${idOfBlog}`)
      .set('Authorization', `Bearer ${token.token}`)
      .expect(204)
    let blogsAfterDeletion = await helper.blogsInDb()
    expect(blogsBeforeDeletion.length).toBe(1 + blogsAfterDeletion.length)
    await api.delete(`/api/blogs/${idOfBlog}`)
      .set('Authorization', `Bearer ${token.token}`)
      .expect(204)
    blogsAfterDeletion = await helper.blogsInDb()
    expect(blogsBeforeDeletion.length).toBe(1 + blogsAfterDeletion.length)
  })
})

describe('when blgos are updated', () => {
  test('if found, blog likes are updated', async () => {
    const updateInfo = { likes: 99 }
    const beforeUpdate = await helper.blogsInDb()
    expect(beforeUpdate.map((blog) => blog.likes)).not.toContain(updateInfo.likes)
    const toUpdate = beforeUpdate[0]
    const response = await api.put(`/api/blogs/${toUpdate.id}`)
      .send(updateInfo).expect(200)
    expect(response.body.likes).toBe(updateInfo.likes)
    const afterUpdate = await helper.blogsInDb()
    const changedInDatabase = afterUpdate.find((blog) => blog.id === toUpdate.id)
    expect(changedInDatabase.likes).toBe(updateInfo.likes)
  })

  test('if id is malformed, appropriate response is returned', async () => {
    await api.put(`/api/blogs/${'MalformedId'}`)
      .send({ likes: 99 })
      .expect(400)
  })

  test('if no blog with given id exists, appropriate response is returned', async () => {
    const login = {
      username: 'root',
      password: '123',
    }

    const tokenResponse = await api
      .post('/api/login')
      .send(login)
      .expect(200)
    const token = tokenResponse.body

    const blogsBeforeDeletion = await helper.blogsInDb()
    const idOfBlog = blogsBeforeDeletion[0].id
    await api.delete(`/api/blogs/${idOfBlog}`)
      .set('Authorization', `Bearer ${token.token}`)
      .expect(204)

    await api.put(`/api/blogs/${idOfBlog}`)
      .send({ likes: 99 })
      .expect(404)
  })
})
