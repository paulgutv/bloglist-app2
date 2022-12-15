import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitle = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthor = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrl = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }


  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id='title'
            value={title}
            onChange={handleTitle}
            placeholder='title'
          />
        </div>
        <div>
          author:
          <input
            id='author'
            value={author}
            onChange={handleAuthor}
            placeholder='author'
          />
        </div>
        <div>
          url:
          <input
            id='url'
            value={url}
            onChange={handleUrl}
            placeholder='url'
          />
        </div>
        <button id='createButton' type='submit'>create</button>
      </form>
    </>
  )
}

export default BlogForm