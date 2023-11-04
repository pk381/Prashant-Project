// database.js
const Sequelize = require('sequelize');

const sequelize = new Sequelize('prashant', 'root', 'Prabhat123@', {
  dialect: 'mysql',
  host: 'localhost', // Set the host to IPv4 localhost
  // port: 3306, // Default MySQL port
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
