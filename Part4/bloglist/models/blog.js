const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

console.log('connecting to url' , url)
mongoose.connect(url,{ family:4 })
  .then(() => {
    console.log('Connected to MongoDb')
  })
  .catch(error => {
    console.error('error connectig to MongoDB: ', error.message)
  })

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform : (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)