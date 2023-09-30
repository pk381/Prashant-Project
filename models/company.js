const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Company = sequelize.define('company', {   
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
    earningInLifetime: Sequelize.DataTypes.FLOAT,
    earningInThisMonth: Sequelize.DataTypes.FLOAT,
    greenMemberInLifetime:Sequelize.DataTypes.INTEGER,
    greenMemberInThisMonth:Sequelize.DataTypes.INTEGER,
    redMemberInLifetime:Sequelize.DataTypes.INTEGER,
    redMemberInThisMonth:Sequelize.DataTypes.INTEGER

});

module.exports = Company;

