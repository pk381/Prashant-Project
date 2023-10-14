const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {   
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
    },
    planType: Sequelize.DataTypes.STRING,
    photo: Sequelize.DataTypes.BLOB('long'),
    direct: Sequelize.DataTypes.INTEGER,
    isActive: Sequelize.DataTypes.BOOLEAN,
    side: Sequelize.DataTypes.STRING,
    autoPool: Sequelize.DataTypes.INTEGER,
    underId: Sequelize.DataTypes.INTEGER

});

module.exports = User;

