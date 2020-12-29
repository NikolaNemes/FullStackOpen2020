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

describe('when user successfully registers', () => {
  test('users sends valid data and is registered', async () => {
    const toSend = {
      username: 'root2',
      name: 'A name2',
      password: 'password',
    }
    let usersInDb = await helper.usersInDb()
    expect(usersInDb.length).toBe(1)
    await api
      .post('/api/users')
      .send(toSend)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    usersInDb = await helper.usersInDb()
    expect(usersInDb.length).toBe(2)
    expect(usersInDb.map((user) => user.username)).toContain(toSend.username)
  })
})

describe('when user does not fill data properly', () => {
  test('missing username', async () => {
    const toSend = {
      name: 'A name2',
      password: 'password',
    }
    let usersInDb = await helper.usersInDb()
    expect(usersInDb.length).toBe(1)
    const { body } = await api
      .post('/api/users')
      .send(toSend)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    usersInDb = await helper.usersInDb()
    expect(usersInDb.length).toBe(1)
    expect(usersInDb.map((user) => user.name)).not.toContain(toSend.name)
    expect(body.error).toBe('User validation failed: username: Path `username` is required.')
  })

  test('username is not long enough', async () => {
    const toSend = {
      name: 'A name2',
      password: 'password',
      username: 'ro',
    }
    let usersInDb = await helper.usersInDb()
    expect(usersInDb.length).toBe(1)
    const { body } = await api
      .post('/api/users')
      .send(toSend)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    usersInDb = await helper.usersInDb()
    expect(usersInDb.length).toBe(1)
    expect(usersInDb.map((user) => user.name)).not.toContain(toSend.name)
    expect(body.error).toBe('User validation failed: username: Path `username` (`ro`) is shorter than the minimum allowed length (3).')
  })

  test('missing password', async () => {
    const toSend = {
      username: 'root2',
      name: 'A name2',
    }
    let usersInDb = await helper.usersInDb()
    expect(usersInDb.length).toBe(1)
    const { body } = await api
      .post('/api/users')
      .send(toSend)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    usersInDb = await helper.usersInDb()
    expect(usersInDb.length).toBe(1)
    expect(usersInDb.map((user) => user.username)).not.toContain(toSend.username)
    expect(body.error).toBe('Password is required')
  })

  test('password not long enough', async () => {
    const toSend = {
      username: 'root2',
      name: 'A name2',
      password: '12',
    }
    let usersInDb = await helper.usersInDb()
    expect(usersInDb.length).toBe(1)
    const { body } = await api
      .post('/api/users')
      .send(toSend)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    usersInDb = await helper.usersInDb()
    expect(usersInDb.length).toBe(1)
    expect(usersInDb.map((user) => user.username)).not.toContain(toSend.username)
    expect(body.error).toBe('Password has to be at least 3 characters long')
  })
})
