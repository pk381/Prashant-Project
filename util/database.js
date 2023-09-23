const Sequelize = require('sequelize');

const sequelize = new Sequelize('prashant', 'root', 'Prabhat123@', {
    dialect: 'mysql',
    host: 'localhost'
});


module.exports = sequelize;

