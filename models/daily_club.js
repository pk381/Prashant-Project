const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const DailyClub = sequelize.define('dailyClub', {   
    id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    date: Sequelize.DataTypes.STRING,
    amount: Sequelize.FLOAT,
    starter: Sequelize.INTEGER,
    basic: Sequelize.INTEGER,
    star: Sequelize.INTEGER,
    superStart: Sequelize.INTEGER,
    prime: Sequelize.INTEGER,
    royal: Sequelize.INTEGER,
});

module.exports = DailyClub;

