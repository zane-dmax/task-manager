const express = require('express')
const {sequelize, User, Task} = require('./db/sqlDB')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    
    try {
        const user = await User.findByPk(_id)
        if (!user) { return res.status(404).send() }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

app.patch('/users/:id', async (req, res) => {
    const pkeys = Object.keys(req.body)
    const vkeys = Object.keys(User.rawAttributes)
    const isValid = pkeys.every((key) => vkeys.includes(key))

    if (!isValid) {
        return res.status(400).send({ error: "One or more of the provided properties does not belong to User" })
    }

    try {
        const changed = await User.update(req.body,{ where: {id: req.params.id} })
        if (changed < 1) { return res.status(404).send() }
        res.send(changed)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        if (!user) { return res.status(404).send() }
        await user.destroy()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/tasks', (req, res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get('/tasks', (req, res) => {
    Task.findAll().then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    
    Task.findByPk(_id).then((task) => {
        if (!task) { return res.status(404).send() }
        res.send(task)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.patch('/tasks/:id', async (req, res) => {
    const pkeys = Object.keys(req.body)
    const vkeys = Object.keys(Task.rawAttributes)
    const isValid = pkeys.every((key) => vkeys.includes(key))

    if (!isValid) {
        return res.status(400).send({ error: "One or more of the provided properties does not belong to Task" })
    }

    try {
        const changed = await Task.update(req.body,{ where: {id: req.params.id} })
        if (changed < 1) { return res.status(404).send() }
        res.send(changed)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id)
        if (!task) { return res.status(404).send() }
        await task.destroy()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})
////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
    console.log('Server up on port ' + port)
})