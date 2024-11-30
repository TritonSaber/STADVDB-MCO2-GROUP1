const sequelize = require('../db')

const sequelize = new Sequelize('steamgameswarehouse', 'root', '96ePChmajy5n', {
    host: 'localhost',
    dialect: 'mysql'
});

try {
    await sequelize.authenticate();
    console.log('Connection to MySQL has been established');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

module.exports = sequelize;