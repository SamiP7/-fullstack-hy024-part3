const express = require('express')
const app = express()
'mongodb+srv://samip:<password>@cluster0.'
'vmx2ufi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const morgan = require('morgan')

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
let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const time = Date(Date.now())
    response.send(
        `<div>Phonebook has info for ${persons.length} people</div>
        <br>
        <div>${time.toString()}</div>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateID = () => {
    const ID = Math.floor(Math.random() * 10000)

    return String(ID)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    if (persons.some(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })   
    } else {
        const person = {
            name: body.name,
            number: body.number,
            id: generateID(),
        }
        persons = persons.concat(person)
        response.json(person)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})