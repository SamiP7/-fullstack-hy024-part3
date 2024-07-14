require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/phonebook')
const morgan = require('morgan')
const PORT = process.env.PORT

const cors = require('cors')

app.use(cors())

app.use(express.json())

app.use(express.static('dist'))

morgan.token('type', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

app.get('/info', (request, response) => {
    const time = Date(Date.now())
    response.send(
        `<div>Phonebook has info for ${persons.length} people</div>
        <br>
        <div>${time.toString()}</div>`
    )
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(p => {
        response.json(p)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})


app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const note = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(p => {
        response.json(p)
      })
      .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    Person.find({name: body.name}).then(p => {
        if (p.length > 0) {
            const person = {
                name: body.name,
                number: body.number,
            }
            Person.findOneAndUpdate({name: body.name}, person, {new: true})
                .then(p=> {
                    response.json(p)
                })
                .catch(error => next(error))
        } else {
            const person = new Person({
                name: body.name,
                number: body.number,
            })
            person.save().then(savedPerson => {
                response.json(savedPerson)
            })
        }
    })
    .catch(error => next(error))
})



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
}

app.use(errorHandler)