module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            required: true
        },
        email: {
            type: DataTypes.STRING,
            required: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            required: true,
            set(value) {this.setDataValue('password',value.trim())},
            validate: {
                len: [6,100],
                notContains: 'password'
            }
        },
        age: {
            type: DataTypes.INTEGER,
            required: false,
            validate: {
               min: 0
            }
        }
    })
}