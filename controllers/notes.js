const notesRouter = require("express").Router()
const User = require("../models/user")
const Note = require("../models/note")

const formatNote = (note) => {
    const formattedNote = { ...note._doc, id: note._id }
    delete formattedNote._id
    delete formattedNote.__v
    return formattedNote
}

notesRouter.get("/", async (req, res) => {
    const notes = await Note
        .find({}, { __v: 0 })
        .populate("user", { username: 1, name: 1 })
    res.json(notes.map(formatNote))
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

notesRouter.post("", async (req, res) => {

    try {
        const body = req.body

        if (body.content === undefined) {
            return res.status(400).json({ error: "content missing" })
        }

        const user = await User.findById(body.userId)

        const note = new Note({
            content: body.content,
            important: body.important || false,
            date: new Date(),
            user: user._id,
        })

        const savedNote = await note.save()

        user.notes = user.notes.concat(savedNote._id)
        await user.save()

        res.json(Note.format(note))
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "something went wrong..." })
    }

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