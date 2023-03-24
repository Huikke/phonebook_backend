require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(cors())
  
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

// Doesn't work properly
app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${Person.length} people</p>
        <p>${Date()}</p>
    `)
})

// Explodes if id doesn't exist
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id).then(result => {
      if (result) {
        console.log('deleted')
      } else {
        console.log('not found')
      }
    })
    response.status(204).end()
})

// Obsolete
const generateRandomId = () => {
  return Math.floor(Math.random() * 1000000);
}

// Has no restrictions for now
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and/or number missing'
    })
  }
  /*if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  } in maintenance*/

  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})