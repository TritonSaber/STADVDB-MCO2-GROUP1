const { Sequelize } = require('sequelize');

const masterDb = new Sequelize('steamgameswarehouse', 'user', 'password', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 21922,
    dialect: 'mysql'
});

const nodeOneDb = new Sequelize('steamgameswarehouse', 'user', 'password', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 21932,
    dialect: 'mysql'
});

const nodeTwoDb = new Sequelize('steamgameswarehouse', 'user', 'password', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 21942,
    dialect: 'mysql'
});

module.exports = { masterDb, nodeOneDb, nodeTwoDb };