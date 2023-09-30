const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Admin = sequelize.define('admin', {   
    id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,  
    },
    email:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false
    },
    password:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false
    }

});

module.exports = Admin;

