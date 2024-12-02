const { Sequelize, DataTypes } = require('sequelize');

const masterDb = new Sequelize('MASTERNODE', 'user', 'password', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 21922,
    dialect: 'mysql'
});

const nodeOneDb = new Sequelize('SLAVEONE', 'user', 'password', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 21932,
    dialect: 'mysql'
});

const nodeTwoDb = new Sequelize('SLAVETWO', 'user', 'password', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 21942,
    dialect: 'mysql'
});

const fact_table = masterDb.define('fact_table', {
    AppID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    Name: { type: DataTypes.TEXT('long'), allowNull: true },
    Required_age: { type: DataTypes.INTEGER, allowNull: true },
    Price: { type: DataTypes.FLOAT, allowNull: true },
    Estimated_owners_min: { type: DataTypes.INTEGER, allowNull: true },
    Estimated_owners_max: { type: DataTypes.INTEGER, allowNull: true },
    DLC_count: { type: DataTypes.INTEGER, allowNull: true },
    Achievements: { type: DataTypes.INTEGER, allowNull: true },
    About_the_game: { type: DataTypes.TEXT('long'), allowNull: true },
    Notes: { type: DataTypes.TEXT('long'), allowNull: true },
    Reviews: { type: DataTypes.TEXT, allowNull: true },
    Metacritic_score: { type: DataTypes.STRING(1000), allowNull: true },
    Metacritic_URL: { type: DataTypes.STRING(1000), allowNull: true },
    Positive_reviews: { type: DataTypes.INTEGER, allowNull: true },
    Negative_reviews: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'dim_gameinfo', timestamps: false });


module.exports = { masterDb, nodeOneDb, nodeTwoDb, fact_table };