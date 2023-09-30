const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const UpgrageRequest = sequelize.define('upgradeRequest', {   
    id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name: Sequelize.DataTypes.STRING,
    amount: Sequelize.DataTypes.FLOAT,
    transactionId: Sequelize.DataTypes.STRING,
    status: Sequelize.DataTypes.STRING,
    photo: Sequelize.DataTypes.BLOB('long'),

});

module.exports = UpgrageRequest;

