const errorHandler = (error, request, response, next) => {
  if(error.name === 'MongoServerError' && error.code === 11000)
    return response.status(400).json( { error: 'expected `username` to be unique' })

  next(error)
}

module.exports = {
  errorHandler,
}