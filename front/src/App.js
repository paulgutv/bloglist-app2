import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [likes, setLikes] = useState([])


  useEffect(() => {
    async function fetchData() {
      const initialBlogs = await blogService
        .getAll()
      setBlogs(initialBlogs)
      const newArray = initialBlogs.map(a => [['id', a.id],['likes', a.likes]])
      setLikes(newArray.map(a => Object.fromEntries(a)))
    }
    fetchData()
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong username or password')
      setStatus('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }


  const handleBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const blog = await blogService
        .create(blogObject)
      setMessage(`The new blog "${blog.title}" by "${blog.author}" added`)
      setBlogs(blogs.concat(blog))
      setLikes(likes.concat({ 'id': blog.id, 'likes': blog.likes }))
      setStatus('success')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('Invalid fields', 'error')
      setStatus('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const blogFormRef = useRef()

  const handleView = () => {
    blogs.sort((a, b) => b.likes - a.likes)
    return (
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id}
            blog={blog}
            user={user}
            blogs={blogs}
            setBlogs={setBlogs}
            handleLike={handleLike}
            likes={likes}
          />
        )}
      </div>
    )
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes += 1
    }
    setLikes(likes.map(a => a.id === blog.id ? { id: a.id, likes: a.likes += 1 } : { id: a.id, likes: a.likes }))
    await blogService
      .update(blog.id, updatedBlog)
  }


  return (
    <div>
      <Notification message={message} type={status} />
      {user === null ?
        <Togglable buttonLabel = 'login'>
          <LoginForm
            username={username}
            password={password}
            handleUsername={({ target }) => setUsername(target.value)}
            handlePassword={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
        </Togglable> :
        <>
          <h2>blogs</h2>
          <p>{user.name} logged-in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={handleBlog}/>
          </Togglable>
          {handleView()}
        </>
      }
    </div>
  )
}

export default App