const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const BoostDetails = sequelize.define('boostDetails', {   
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
    parent: Sequelize.DataTypes.INTEGER,
    lastChild: Sequelize.DataTypes.INTEGER,

});

module.exports = BoostDetails;

