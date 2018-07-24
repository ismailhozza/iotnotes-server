const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const Note = require("./models/note")

const logger = (req, res, next) => {
    console.log(`Method: ${req.method}`)
    console.log(`Path: ${req.path}`)
    console.log(`Body: ${req.body}`)
    console.log(`---`)
    next()
}

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(logger)
app.use(express.static('web'))


let notes = [
{
    id: 1,
    content: 'HTML on helppoa',
    date: '2017-12-10T17:30:31.098Z',
    important: true
},
{
    id: 2,
    content: 'Selain pystyy suorittamaan vain javascriptiä',
    date: '2017-12-10T18:39:34.091Z',
    important: false
},
{
    id: 3,
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    date: '2017-12-10T19:20:14.298Z',
    important: true
}
]

app.get('/', (req, res) => {
    // res.json(notes)
    Note
        .find({})
        .then(notes => {
            res.json(notes)
        })
})

const formatNote = (note) => {
    const formattedNote = { ...note._doc, id: note._id }
    delete formattedNote._id
    // delete formattedNote.__v
    return formattedNote
}
app.get('/api/notes', (req, res) => {
    Note
        .find({}, {__v: 0})
        .then(notes => {
            res.json(notes.map(formatNote))
        })
})

app.get('/api/notes/:id', (req, res) => {
    Note.findById(req.params.id, {__v: 0})
        .then((note) => {
            if (note) {
                res.json(formatNote(note))
            } else {
                res.status(404).end()
            }
            // res.json(formatNote(note))
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({error: 'malformatted id'})
        })
})

app.delete('/api/notes/:id', (req, res) => {
    // const id = Number(req.params.id)
    // notes = notes.filter((n) => n.id !== id)
    // res.status(204).end()
    console.log(req.params.id)
    Note.findByIdAndRemove(req.params.id)
        .then((result) => {
            // res.json(formatNote(note))
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({error: "malformatted id"})
        })
})

const generateId = () => {
    const maxId = notes.length > 0 ? notes.map(n => n.id).sort().reverse()[0] : 1
    return maxId + 1
}

app.post('/api/notes', (req, res) => {
    const body = req.body

    if (body.content === undefined) {
        return res.status(400).json({error: "content missing"})
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        // id: generateId()
    })

    // notes = notes.concat(note)
    note
        .save()
        .then(formatNote)
        .then(savedAndFormattedNote => {
            res.json(savedAndFormattedNote)
        })

    // res.json(note)
})

app.put('/api/notes/:id', (req, res) => {
    const body = req.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note
        .findByIdAndUpdate(req.params.id, note, { new: true})
        .then( updatedNote => {
            res.json(formatNote(updatedNote))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({error: "malformatted id"})
        })
})

app.use((req, res) => {
    res.status(404).send({error: "unknown endpoint"})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
