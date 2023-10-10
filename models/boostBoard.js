const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const BoostBoard = sequelize.define('boostBoard', {   
    id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    planType:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,  
    },
    nodeNo: Sequelize.DataTypes.INTEGER,
    userId: Sequelize.DataTypes.INTEGER,
    parent: Sequelize.DataTypes.INTEGER,
    leftChild: Sequelize.DataTypes.INTEGER,
    rightChild: Sequelize.DataTypes.INTEGER
});

module.exports = BoostBoard;

