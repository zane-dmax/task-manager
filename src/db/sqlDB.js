const Sequelize = require('sequelize')

const sequelize = new Sequelize('test', 'User1', '1234', {
    host: 'localhost',
    dialect: 'mysql'
  })
const User = sequelize.import('../models/user')
const Task = sequelize.import('../models/task')


//sequelize.sync({ force: true }).then(() => {
//sequelize.sync({ alter: true }).then(() => {
sequelize.sync().then(() => {
    console.log('Synced')
}).catch((error) => {
    console.log('Error:', error)
})

module.exports = {sequelize, User, Task}