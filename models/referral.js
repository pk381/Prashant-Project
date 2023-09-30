const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Referral = sequelize.define('referral', {   
    id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false
    },
    isActive:{
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,  
    },
    planType: Sequelize.DataTypes.STRING,
    countDown: Sequelize.DataTypes.INTEGER
});

module.exports = Referral;

