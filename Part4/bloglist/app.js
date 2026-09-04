const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])
const mongoose = require('mongoose')
const express = require('express')
const config = require('./utils/config')
const blogRouter  = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')


const app = express()

mongoose
  .connect( config.MONGODB_URI, { family:4 })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch( error => {
    console.error('error connecting to MongoDB : ', error.message)
  })
app.use(express.json())
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)

app.use(middleware.errorHandler)

module.exports = app