const notesRouter = require("express").Router()
const Note = require("./models/note")

const formatNote = (note) => {
    const formattedNote = { ...note._doc, id: note._id }
    delete formattedNote._id
    delete formattedNote.__v
    return formattedNote
}

notesRouter.get("/", (req, res) => {
    Note
        .find({}, { __v: 0 })
        .then( (notes) => {
            res.json(notes.map(formatNote))
        })
})

notesRouter.get("/:id", (req, res) => {
    Note.findById(req.params.id, { __v: 0 })
        .then((note) => {
            if (note) {
                res.json(formatNote(note))
            } else {
                res.status(404).end()
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({ error: "malformatted id" })
        })
})

notesRouter.delete("/:id", (req, res) => {
    console.log(req.params.id)
    Note.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({ error: "malformatted id" })
        })
})

notesRouter.post("", (req, res) => {
    const body = req.body

    if (body.content === undefined) {
        return res.status(400).json({ error: "content missing" })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note
        .save()
        .then(formatNote)
        .then((savedAndFormattedNote) => {
            res.json(savedAndFormattedNote)
        })
})

notesRouter.put("/:id", (req, res) => {
    const body = req.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note
        .findByIdAndUpdate(req.params.id, note, { new: true })
        .then( (updatedNote) => {
            res.json(formatNote(updatedNote))
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({ error: "malformatted id" })
        })
})

notesRouter.use((req, res) => {
    res.status(404).send({ error: "unknown endpoint" })
})

module.exports = notesRouter