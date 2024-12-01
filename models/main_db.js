const {DataTypes} = require('sequelize');
const sequelize = require('../db')

const fact_table = sequelize.define('fact_table', {
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
}, { tableName: 'fact_table', timestamps: false });

module.exports = {fact_table};