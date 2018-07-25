const http = require("http")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const config = require("./utils/config")
const middleware = require("./utils/middleware")
const notesRouter = require("./controllers/notes")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")

mongoose
    .connect(config.mongoUrl)
    .then(() => {
        console.log("connected to database", config.mongoUrl)
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
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

app.use(middleware.error)

const server = http.createServer(app)
server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

server.on("close", () => {
    mongoose.connection.close()
})

module.exports = {
    app, server
}