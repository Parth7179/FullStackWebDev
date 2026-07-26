const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config()

const Person = require('./models/person')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('log', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  } else {
    return
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :log'))


app.get('/api/persons', (request, response, next) => {
  Person.find({})
  .then(person => {
    response.json(person)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    response.json(person)
  })
   .catch(error => next(error))
})


// const generateId = () => {
//   return String(Math.floor(Math.random() * 1000000))
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!(body.name && body.number)) {
    return response.status(400).json({ 'error': 'content missing' })
  }

  // const alreadyExists = person.find(person => person.name === body.name)
  // if (alreadyExists) {
  //   return response.status(400).json({ 'error': 'name already exists' })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
  .then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    response.json(result)

  })
   .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
     .catch(error => next(error))
})


app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      response.send(
        `<p>Phonebook has info for ${count} people</p>
    <p>${new Date()}</p>`
      )
    })
     .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({error : 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next)=>{
  console.error(error.message)
  if(error.name ==='CastError'){
    return response.status(400).send({error: 'malformatted id'})
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})