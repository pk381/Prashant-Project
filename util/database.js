const Sequelize = require('sequelize');

const sequelize = new Sequelize('prashant', 'root', 'Prabhat123@', {
    dialect: 'mysql',
    host: '193.203.160.12:8443'
});


module.exports = sequelize;

