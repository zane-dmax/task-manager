module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        description: {
            type: DataTypes.STRING,
            required: true
        },
        completed: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        owner: {
            type: DataTypes.INTEGER,
            required: true
        }
    })

    // override toJSON
    Task.prototype.toJSON = function() {
        const obj = Object.assign({}, this.get())
        delete obj.owner
        return obj
    }

    return Task
}