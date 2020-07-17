const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.use(morgan('tiny', {
  skip: (req,res) => req.method === 'POST'
}))

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: (req,res) => req.method !== 'POST'
}))

let phonebook = [
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 1
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 2
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 3
  },
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 4
  }
]

app.get('/api/persons', (req,res) => {
  res.json(phonebook)
})

app.get('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  const person = phonebook.find(person => person.id === id)

  if (person) {
    return res.json(person)
  } else {
    return res.status(404).send('<h1>404 Person does not exist</h1>')
  }

})

app.delete('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  phonebook = phonebook.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req,res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  if (phonebook.filter(person => person.name === body.name).length > 0) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: Math.floor(Math.random() * 1000),
    name: body.name,
    number: body.number,
  }

  phonebook = phonebook.concat(person)

  res.json(person)
})

app.get('/info', (req,res) => {
  res.send(`<p>Phonebook has info for ${phonebook.length} people</p>` + new Date())
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})