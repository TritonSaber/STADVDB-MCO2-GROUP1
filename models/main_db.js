const { Sequelize, DataTypes } = require('sequelize');

const masterDb = new Sequelize('MASTERNODE', 'user', 'password', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 21922,
    dialect: 'mysql',
});

const nodeOneDb = new Sequelize('SLAVEONE', 'user', 'password', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 21932,
    dialect: 'mysql',
});

const nodeTwoDb = new Sequelize('SLAVETWO', 'user', 'password', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 21942,
    dialect: 'mysql',
});

// Define a function to create tables with explicit table names
const defineGameTable = (db, tableName) =>
    db.define(
        tableName,
        {
            AppID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            Name: { type: DataTypes.TEXT },
            Release_date: { type: DataTypes.DATE },
            Required_age: { type: DataTypes.INTEGER },
            Price: { type: DataTypes.FLOAT },
            Estimated_owners_min: { type: DataTypes.INTEGER },
            Estimated_owners_max: { type: DataTypes.INTEGER },
            DLC_count: { type: DataTypes.INTEGER },
            Achievements: { type: DataTypes.INTEGER },
            About_the_game: { type: DataTypes.TEXT },
            Notes: { type: DataTypes.TEXT },
            Reviews: { type: DataTypes.TEXT },
            Metacritic_score: { type: DataTypes.STRING },
            Metacritic_url: { type: DataTypes.STRING },
            Positive_reviews: { type: DataTypes.INTEGER },
            Negative_reviews: { type: DataTypes.INTEGER },
        },
        { 
            timestamps: false,
            tableName: tableName 
        }
    );

// Define tables with the correct names
const fact_table_master_pre2020 = defineGameTable(masterDb, 'game_info_pre2020');
const fact_table_master_post2020 = defineGameTable(masterDb, 'game_info_post2020');
const fact_table_nodeOne = defineGameTable(nodeOneDb, 'game_info_pre2020');
const fact_table_nodeTwo = defineGameTable(nodeTwoDb, 'game_info_post2020');

(async () => {
    try {
        // Authenticate the databases
        await masterDb.authenticate();
        await nodeOneDb.authenticate();
        await nodeTwoDb.authenticate();

        console.log('All databases connected successfully.');
    } catch (err) {
        console.error('Error connecting to databases:', err);
    }
})();

module.exports = {
    masterDb,
    nodeOneDb,
    nodeTwoDb,
    fact_table_master_pre2020,
    fact_table_master_post2020,
    fact_table_nodeOne,
    fact_table_nodeTwo,
};
