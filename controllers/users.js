const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.post("/", async (req, res) => {
    try {
        const body = req.body

        const existingUser = await User.find({ username: body.username })
        if (existingUser.length>0) {
            return res.status(400).json({ error: "username must be unique" })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })

        const savedUser = await user.save()
        res.json(User.format(savedUser))
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "something went wrong..." })
    }
})

usersRouter.get("/", async (req, res) => {
    const users = await User
        .find({})
        .populate("notes", { content: 1, date: 1 })
    res.json(users.map(User.format))
})

module.exports = usersRouter