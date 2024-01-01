require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')




app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log("method: ", request.method)
    console.log("path: ", request.path)
    console.log('body: ', request.body)
    console.log('-----')
    next()
}

app.use(requestLogger)

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => {
    return note.id === id
    })

    if (note){
        response.json(note)
    } else {
        response.statusMessage = 'Sorry :('
        response.status(404).end()
    }
})

const generateId = () => {
    const maxId = notes.length>0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1;
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    
    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId()
    }

    notes=notes.concat(note)
    response.json(note)

})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unkown path'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})
