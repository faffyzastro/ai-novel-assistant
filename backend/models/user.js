// backend/models/user.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs'); // <--- ADD THIS LINE to import bcryptjs

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true // Good practice: add email format validation
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    // --- ADD THIS 'hooks' PROPERTY ---
    hooks: {
        beforeCreate: async (user) => {
            // Hash the password only if it's new (on creation)
            if (user.password) {
                const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
                user.password = await bcrypt.hash(user.password, salt); // Hash the password
            }
        },
        beforeUpdate: async (user) => {
            // Hash the password only if it has been changed (on update)
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

module.exports = User;