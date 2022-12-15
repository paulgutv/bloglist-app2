const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.insertMany(helper.initialUsers)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs have an id', async () => {
  const result = await api
    .get('/api/blogs')

  result.body.map(a => expect(a.id).toBeDefined())
})

test('0 likes by default', async () => {
  const newBlog = {
    title: 'Ratata',
    author: 'Pokemon',
    url: 'wewewewe',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)

  const blogsAtEnd = await helper.blogsInDb()
  blogsAtEnd.map(a => expect(a.likes).toBeDefined())
})


describe('creation of a new note', () => {
  test('a valid blog can be added', async () => {
    const newLogin = {
      username: 'root',
      password: 'sekret'
    }

    const result = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)

    const token = result.body.token

    const newBlog = {
      title: 'Christmas',
      author: 'Santa Claus',
      url: 'http://www.hohoho.com',
      likes: 500000
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(a => a.title)
    expect(titles).toContain('Christmas')
  })

  test('fails with status 400 if title or url is missing', async () => {
    const newLogin = {
      username: 'root',
      password: 'sekret'
    }

    const result = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)

    const token = result.body.token

    const newBlog = {
      author: 'Heladoncio'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status 204 if user and token are correct', async () => {
    const usersAtStart = await helper.usersInDb()

    const newLogin = {
      username: 'root',
      password: 'sekret'
    }

    const result = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)

    const token = result.body.token
    const user = usersAtStart.find(a => a.username === result.body.username)
    const firstBlogId = user.blogs[0].toString()

    await api
      .delete(`/api/blogs/${firstBlogId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const ids = blogsAtEnd.map(a => a.id)
    expect(ids).not.toContain(firstBlogId)
  })

  test('fails with status 401 if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('unauthorized')

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('modification of a blog', () => {
  test('succeeds with status 204 if user and token are correct', async () => {
    const usersAtStart = await helper.usersInDb()

    const newLogin = {
      username: 'root',
      password: 'sekret'
    }

    const result = await api
      .post('/api/login')
      .send(newLogin)
      .expect(200)

    const token = result.body.token
    const user = usersAtStart.find(a => a.username === result.body.username)
    const firstBlogId = user.blogs[0].toString()

    const changedBlog = {
      title: 'other title',
      author: 'other author',
      url: 'other url',
      likes: 9999
    }

    await api
      .put(`/api/blogs/${firstBlogId}`)
      .set('Authorization', `bearer ${token}`)
      .send(changedBlog)
      .expect(204)
  })

  test('fails with status 401 if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToChange = blogsAtStart[0]

    const changedBlog = {
      title: 'other title',
      author: 'other author',
      url: 'other url',
      likes: 9999
    }

    const result = await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(changedBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('unauthorized')
  })
})

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testuser',
      name: 'test user',
      password: 'testpassword'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'test user2',
      password: 'testpassword2'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails without username or password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser1 = {
      name: 'test user2',
      password: 'testpassword2'
    }

    const result1 = await api
      .post('/api/users')
      .send(newUser1)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result1.body.error).toContain('username or password is missing')

    const newUser2 = {
      username: 'testuser3',
      name: 'test user3'
    }

    const result2 = await api
      .post('/api/users')
      .send(newUser2)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result2.body.error).toContain('username or password is missing')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})