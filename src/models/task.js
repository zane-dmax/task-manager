module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Task', {
        description: DataTypes.STRING,
        completed: DataTypes.BOOLEAN,
        owner: DataTypes.STRING
    })
}