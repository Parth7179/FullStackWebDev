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
    name:{
        type : String,
        minlength: 3,
        required: true,
    },
    number:{
        type : String,
        required: true,
        minlength:8,
        validate: {
            validator: function(v){
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number`
        }
    },
})

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', phoneBookSchema)