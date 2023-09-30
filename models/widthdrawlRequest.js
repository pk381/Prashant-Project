const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const WidthdrawlRequest = sequelize.define('widthdrawlRequest', {   
    id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name: Sequelize.DataTypes.STRING,
    amount: Sequelize.FLOAT,
    status: Sequelize.DataTypes.STRING
});

module.exports = WidthdrawlRequest;

