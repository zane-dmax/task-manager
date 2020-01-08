const express = require('express')
const {User} = require('../db/sqlDB')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send( {user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    
    try {
        const user = await User.findByPk(_id)
        if (!user) { return res.status(404).send() }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const pkeys = Object.keys(req.body)
    const vkeys = Object.keys(User.rawAttributes)
    const isValid = pkeys.every((key) => vkeys.includes(key))

    if (!isValid) {
        return res.status(400).send({ error: "One or more of the provided properties do not belong to User" })
    }

    try {
        await req.user.update(req.body)
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(400).send('error')
    }
})

const upload = multer({
    dest: 'avatars'
})

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {

})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.destroy()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        if (!user) { return res.status(404).send() }
        await user.destroy()
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

///////////////////////////dev only//////////////////////////////////////////
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})
/////////////////////////////////////////////////////////////////////////////

module.exports = router