const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Earning = sequelize.define('earning', {   
    id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    total: Sequelize.FLOAT,
    today: Sequelize.FLOAT,
    direct: Sequelize.FLOAT,
    dailyClub: Sequelize.FLOAT,
    level: Sequelize.FLOAT,
    boost: Sequelize.FLOAT,
    widthdrawl: Sequelize.FLOAT

});

module.exports = Earning;

