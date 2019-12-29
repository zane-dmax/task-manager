const express = require('express')
const {Task} = require('../db/sqlDB')
const router = new express.Router()

router.post('/tasks', (req, res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.get('/tasks', (req, res) => {
    Task.findAll().then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.status(500).send()
    })
})

router.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    
    Task.findByPk(_id).then((task) => {
        if (!task) { return res.status(404).send() }
        res.send(task)
    }).catch((e) => {
        res.status(500).send()
    })
})

router.patch('/tasks/:id', async (req, res) => {
    const pkeys = Object.keys(req.body)
    const vkeys = Object.keys(Task.rawAttributes)
    const isValid = pkeys.every((key) => vkeys.includes(key))

    if (!isValid) {
        return res.status(400).send({ error: "One or more of the provided properties do not belong to Task" })
    }

    try {
        const changed = await Task.update(req.body,{ where: {id: req.params.id} })
        if (changed < 1) { return res.status(404).send() }
        res.send(changed)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id)
        if (!task) { return res.status(404).send() }
        await task.destroy()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router