const jwt = require('jsonwebtoken')
const {User} = require('../db/sqlDB')
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findByPk(decoded.id)
        if (!user || !user.tokens.some(e => e === token)) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
        console.log(e)
    }
}
module.exports = auth