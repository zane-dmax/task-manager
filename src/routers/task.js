const express = require('express')
const {Task} = require('../db/sqlDB')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task(req.body)
    task.owner = req.user.id
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks/me', auth, async (req, res) => {
    var limit = 10
    var offset = 0
    var where = {}
    var order = [['id','ASC']]

    if (req.query.limit) { limit = parseInt(req.query.limit) }
    if (req.query.offset) { offset = parseInt(req.query.offset) }

    if (req.query.completed) {
        where.completed = req.query.completed === 'true'
    }

    if (req.query.order) {
        order = [req.query.order.split('_')]
    }
    
    try {
        const tasks = await req.user.getTasks({ 
            where,
            limit,
            offset,
            order
        })
        res.send(tasks)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id
    
    try {
        const task = await Task.findOne({ where: {id, owner: req.user.id} })
        if (!task) { return res.status(404).send() }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const pkeys = Object.keys(req.body)
    const vkeys = Object.keys(Task.rawAttributes)
    const isValid = pkeys.every((key) => vkeys.includes(key))

    if (!isValid) {
        return res.status(400).send({ error: "One or more of the provided properties do not belong to Task" })
    }

    try {
        const changed = await Task.update(req.body,{ where: {id: req.params.id, owner: req.user.id} })
        if (changed < 1) { return res.status(404).send() }
        res.send(changed)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ where: {id, owner: req.user.id} })
        if (!task) { return res.status(404).send() }
        await task.destroy()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

///////////////////////////dev only//////////////////////////////////////////
router.get('/tasks', (req, res) => {
    Task.findAll().then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.status(500).send()
    })
})
/////////////////////////////////////////////////////////////////////////////

module.exports = router