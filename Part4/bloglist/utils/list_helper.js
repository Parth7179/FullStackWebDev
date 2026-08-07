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

module.exports = { dummy , totalLikes }