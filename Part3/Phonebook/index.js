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


app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})


const generateId = () => {
  return String(Math.floor(Math.random() * 1000000))
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!(body.name && body.number)) {
    return response.status(400).json({ 'error': 'content missing' })
  }
  const alreadyExists = persons.find(person => person.name === body.name)
  if (alreadyExists) {
    return response.status(400).json({ 'error': 'name already exists' })
  }
  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(newPerson)
  response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})


app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  )
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})