const User = require('../models/user')
const userRouter = require('express').Router()
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', '-user')
  response.json(users)
})

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if( !username || !password ){
    return response.status(400).json( { error: 'Username/password must be provided' })
  }else if(username.length < 3 ||  password.length < 3){
    return response.status(400).json({ error: 'username/password length must be alteast 3 characters long' })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({
    username: username,
    name: name,
    passwordHash: passwordHash,
  })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = userRouter