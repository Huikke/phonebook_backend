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
  
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

// Doesn't work properly
app.get('/info', (request, response, next) => {
  response.send(`
    <p>Phonebook has info for ${Person.length} people</p>
    <p>${Date()}</p>
  `).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(result => {
    if (result) {
      console.log('deleted')
    } else {
      console.log('not found')
    }
    response.status(204).end()
  }).catch(error => next(error))
})

// Obsolete
const generateRandomId = () => {
  return Math.floor(Math.random() * 1000000);
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name and/or number missing'
    })
  }
  Person.find({}).then(persons => {
    if (persons.some(person => person.name === body.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

    const person = new Person ({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})