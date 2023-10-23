const Sequelize = require('sequelize');

const sequelize = new Sequelize('prashant', 'root', '', {
    dialect: 'mysql',
    host: 'localhost'
});


module.exports = sequelize;

