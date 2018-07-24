const mongoose = require("mongoose")

const url = "mongodb://localhost:27017/fullstack-notes"

mongoose.connect(url)

const Note = mongoose.model("Note", {
    content: String,
    date: Date,
    important: Boolean
})

const note = new Note({
    content: "HTML on helppoa",
    date: new Date(),
    important: true
})

note
    .save()
    .then(response => {
        console.log("note saved")
        mongoose.connection.close()
    })