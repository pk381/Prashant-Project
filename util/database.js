const Sequelize = require('sequelize');

const sequelize = new Sequelize('prashant', 'admin', 'YgPrjZrJ', {
    dialect: 'mysql',
    host: 'mysql-151814-0.cloudclusters.net',
    port: 19405,
});


module.exports = sequelize;

