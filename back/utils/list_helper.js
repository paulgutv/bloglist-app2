const dummy = () => {
  return 1
}

const totalLikes = (array) => {
  return array
    .map(a => a.likes)
    .reduce((a, b) => a + b, 0)
}

const favouriteBlog = (array) => {
  const mostLikes = array
    .map(a => a.likes)
    .reduce((a, b) => Math.max(a, b))
  const bestBlog = array
    .filter(a => a.likes === mostLikes)[0]

  return {
    title: bestBlog.title,
    author: bestBlog.author,
    likes: bestBlog.likes
  }
}

const mostBlogs = (array) => {
  let obj = {}
  array
    .map(a => a.author)
    .forEach(a => Object.prototype.hasOwnProperty.call(obj, a) ? obj[a] += 1 : obj[a] = 1)

  const highestValue = Object.values(obj).reduce((a, b) => Math.max(a, b))

  const highestAuthor = Object.entries(obj).find(a => a[1] === highestValue)[0]

  return {
    author: highestAuthor,
    blogs: highestValue
  }
}

const mostLikes = (array) => {
  let obj = {}
  array
    .forEach(a => Object.prototype.hasOwnProperty.call(obj, a.author) ? obj[a.author] += a.likes : obj[a.author] = a.likes)

  const highestValue = Object.values(obj).reduce((a, b) => Math.max(a, b))

  const highestAuthor = Object.entries(obj).find(a => a[1] === highestValue)[0]

  return {
    author: highestAuthor,
    likes: highestValue
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}

