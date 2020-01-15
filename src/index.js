const express = require('express')
const {sequelize, User, Task} = require('./db/sqlDB')
const rtrUser = require('./routers/user.js')
const rtrTask = require('./routers/task.js')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(rtrUser)
app.use(rtrTask)



app.listen(port, () => {
    console.log('Server up on port ' + port)
})