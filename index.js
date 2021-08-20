

const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :body - '))

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
  ]

  //Get info
  app.get('/info', (request, response) => {
    var datetime = new Date();
    response.send(`Phonebook has info for ${persons.length} people. <br/><br/>
    ${datetime}`)
  })

  //Get persons
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  //Get person with ID
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  //Delete person with ID
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  //Add person with post
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      date: new Date(),
      id: generateId(),
    }
    if (persons.find(p => p.name === person.name)){
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    } else {
        persons = persons.concat(person)
        response.json(person)
        
    }
    
  })
  //generates id
  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }


  //Listening..
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })