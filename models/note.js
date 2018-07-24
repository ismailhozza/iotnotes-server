const mongoose = require("mongoose")

const url = "mongodb://localhost:27017/fullstack-notes"

mongoose.connect(url)

console.log("Mongoose connected!")

const Note = mongoose.model("Note", {
    content: String,
    date: Date,
    important: Boolean
})

module.exports = Note