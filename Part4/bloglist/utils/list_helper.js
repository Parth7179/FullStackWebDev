// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(likes,0)
}

const favBlog = (blogs) => {
  let fav = blogs[0]
  blogs.forEach(blog => {
    if(blog.likes > fav.likes){
      fav = blog
    }
  })
  return fav
}

const mostBlogs = (blogs) => {
  const author = {}
  blogs.forEach(blog => {
    if(author[blog.author]){
      author[blog.author]++
    }else{
      author[blog.author] = 1
    }
  })
  const mostblogscount = Math.max(...Object.values(author))
  const mostBlogsAuthor = Object.keys(author).find(key => author[key]=== mostblogscount)
  return {
    author: mostBlogsAuthor,
    blogs: mostblogscount
  }
}

const mostLikes = (blogs) => {
  const author = {}
  blogs.forEach(blog => {
    author[blog.author] = (author[blog.author] || 0) + blog.likes
  })
  const maxLikes = Math.max(...Object.values(author))
  const mostLikedAuthor = Object.keys(author).find(key => author[key] === maxLikes)
  return {
    author: mostLikedAuthor,
    likes: maxLikes
  }
}


module.exports = { dummy , totalLikes, favBlog, mostBlogs, mostLikes }