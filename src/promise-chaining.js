const {sequelize, User, Task} = require('./db/sqlDB')

Task.findByPk(1).then((task) => {
    console.log(task)
    return Task.destroy({ where: {id: task.id} })
}).then((result) => {
    console.log(result + ' task deleted')
    return Task.count({ where: {completed: false} })
}).then((result) => {
    console.log(result + ' incomplete task(s) remain.')
}).catch((e) => {
    console.log(e)
})