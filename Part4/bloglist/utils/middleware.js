const errorHandler = (error, request, response, next) => {
  if(error.name === 'MongoServerError' && error.code === 11000)
    return response.status(400).json( { error: 'expected `username` to be unique' })
  //implemented exercise 4.19 in 4.18 so commenting out that part
  // else if(error.name === 'JsonWebTokenError') {
  //   return response.status(401).json({ error:'invalid token' })
  // }

  next(error)
}

module.exports = {
  errorHandler,
}