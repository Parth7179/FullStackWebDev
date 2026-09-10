import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const response = axios.get(baseUrl)
  return response.then(response => response.data)
}

const createBlog = async (Blog) => {
  const config = {
    headers: {Authorization: token}
  }
  const response = await axios.post(baseUrl,Blog, config)
  return response.data
}

export default { getAll, createBlog, setToken }