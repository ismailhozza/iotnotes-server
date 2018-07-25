const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const notesRouter = require("./controllers/notes")

const logger = (req, res, next) => {
    console.log(`Method: ${req.method}`)
    console.log(`Path: ${req.path}`)
    console.log(`Body: ${req.body}`)
    console.log("---")
    next()
}

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(logger)
app.use(express.static("web"))
app.use("/api/notes", notesRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
