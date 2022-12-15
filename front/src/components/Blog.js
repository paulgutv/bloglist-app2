import { useState } from 'react'

import blogService from '../services/blogs'

const Blog = ({ blog, user, handleLike, blogs, setBlogs, likes }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const handleVisibility = () => {
    setVisible(!visible)
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by "${blog.author}?"`)) {
      await blogService
        .remove(blog.id)
      const newArr = blogs.filter(a => a === blog ? null : a)
      setBlogs(newArr)
    }
  }

  return (
    <>
      {visible === false ?
        <div style={blogStyle} className='blog'>
          {blog.title} - {blog.author}
          <button id='showButton' onClick={handleVisibility}>show</button>
        </div> :
        <div style={blogStyle} className='blog'>
          {blog.title} - {blog.author}
          <button onClick={handleVisibility}>hide</button>
          <p>{blog.url}</p>
          <p>
            likes {likes.find(a => a.id === blog.id).likes}
            <button id='likeButton' onClick={() => handleLike(blog)}>like</button>
          </p>
          <p>Owner:{blog.user.name}</p>
          {blog.user.name === user.name ?
            <button id='deleteButton' onClick={handleDelete}>remove</button> :
            null
          }
        </div>
      }
    </>
  )
}

export default Blog