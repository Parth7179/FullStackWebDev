const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

console.log('Connecting to ', url);
mongoose.connect(url, {family:4})
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch(error=>{
        console.log('Error connecting to MongoDB: ', error.message);
    })

const phoneBookSchema = mongoose.Schema({
    name:String,
    number:String
})

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', phoneBookSchema)