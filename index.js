const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const middleware = require("./utils/middleware")
const notesRouter = require("./controllers/notes")

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const url = process.env.MONGODB_URI

mongoose
    .connect(url)
    .then(() => {
        console.log("connected to database", url)
    })
    .catch((error) => {
        console.log(error)
    })

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.static("web"))
app.use(middleware.logger)

app.use("/api/notes", notesRouter)

app.use(middleware.error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
