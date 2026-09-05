const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
  if(error.name === 'MongoServerError' && error.code === 11000)
    return response.status(400).json( { error: 'expected `username` to be unique' })
  else if(error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error:'invalid token' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    request.token = authorization.replace('Bearer ', '')
  }else{
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodedToken){
    return response.status(401).json({ error:'invalid token' })
  }
  request.user = await User.findById(decodedToken.id)

  next()
}
module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
}