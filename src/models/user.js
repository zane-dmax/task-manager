const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            required: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
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
    },
    {
        hooks: {
          beforeSave: async function(user, options) {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 8)
            }
          },
          beforeUpdate: async function(user, options) {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 8)
            }
          }
        }
    })

    User.findByCredentials = async function(email, password) {
        const user = await User.findOne({ email })

        if (!user) {
            throw new Error('Invalid email/password')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new Error('Invalid email/password')
        }

        return user
    }

    return User
}
  