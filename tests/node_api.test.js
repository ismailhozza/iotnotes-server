const supertest = require("supertest")
const { app, server } = require("../index")
const Note = require("../models/note")
// const User = require("../models/user")
const api = supertest(app)

const initialNotes = [
    {
        content: "HTML on helppoa",
        important: false
    },
    {
        content: "HTTP-protokollan tärkeimmät metodit ovat GET ja POST",
        important: true
    },
]

beforeAll(async () => {
    await Note.remove({})
    console.log("cleared")

    const noteObjects = initialNotes.map((note) => new Note(note))
    const promiseArray = noteObjects.map((note) => note.save())
    await Promise.all(promiseArray)

    // // Not working as expected
    // initialNotes.forEach(async (note) => {
    //     let noteObject = new Note(note)
    //     await noteObject.save()
    //     console.log("saved")
    // })
    console.log("done")
})

test("notes are returned as json", async () => {
    console.log("entered test")
    await api
        .get("/api/notes")
        .expect(200)
        .expect("Content-Type", /application\/json/)
})

test("there are five notes", async () => {
    const response = await api
        .get("/api/notes")

    expect(response.body.length).toBe(initialNotes.length)
})

test("the first note is about HTTP methods", async () => {
    const response = await api
        .get("/api/notes")

    const contents = response.body.map((r) => r.content)

    expect(contents).toContain("HTTP-protokollan tärkeimmät metodit ovat GET ja POST")
})

afterAll(() => {
    server.close()
})