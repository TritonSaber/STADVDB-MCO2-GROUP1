const sequelize = require('../models/main_db.js');
const express = require('express');
const path = require('path');
const Op = require('sequelize');
const { masterDb, nodeOneDb, nodeTwoDb, fact_table } = require('../models/main_db.js');

const getIndex = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html')); 
};

const checkSlaveAvailability = async () => {
    try {
        // Check if nodeOneDb is up
        await nodeOneDb.authenticate();
        console.log('Node One is available');
    } catch (error) {
        console.error('Node One is not available:', error);
        return false;
    }

    try {
        // Check if nodeTwoDb is up
        await nodeTwoDb.authenticate();
        console.log('Node Two is available');
    } catch (error) {
        console.error('Node Two is not available:', error);
        return false;
    }

    return true; // Both nodes are available
};

// Function to add a game to the appropriate node
const postAddGame = async (req, res) => {
    const gameData = req.body;

    // Check slave availability before proceeding
    const slavesAvailable = await checkSlaveAvailability();
    if (!slavesAvailable) {
        return res.status(503).send('One or more slave databases are not available.');
    }

    try {
        // Determine where to insert based on release year
        const releaseYear = new Date(gameData.release_date).getFullYear();
        
        console.log(releaseYear);
        let dbInstance;

        if (releaseYear < 2020) {
            dbInstance = nodeOneDb;
        } else {
            dbInstance = nodeTwoDb;
        }

        // Insert into the appropriate node
        await dbInstance.models.fact_table.create(gameData);

        // Replicate to master node
        await masterDb.models.fact_table.create(gameData);

        res.status(201).send('Game added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding game');
    }
};

// Function to get game details from the central node
const getGameDetails = async (req, res) => {
    const { game_ID, labeled_date_period } = req.body;
    masterDb.models.fact_table = fact_table;

    const yearThreshold = new Date("2020-01-01").getFullYear()
    console.log(yearThreshold)
    var dateCondition = {
        AppID: game_ID
    };

    if(labeled_date_period === 'All'){
        console.log("All")
        dateCondition = {
            AppID: game_ID
        };
    }
    else if(labeled_date_period === 'Before 2020'){
        console.log("Before 2020");
        dateCondition.Release_date = {
                [Op.lt]: yearThreshold,
            };
        console.log(dateCondition);
    }
    else{
        console.log("After 2020");
            dateCondition.Release_date = {
                [Op.gte]: yearThreshold,
            };
        console.log(dateCondition);
    }

    try {
        const game = await masterDb.models.fact_table.findAll({
            where: dateCondition,
            attributes: ['Release_date', 'Name', 'Required_age', 'Price', 'DLC_count', 'Achievements',
                'Metacritic_score', 'Positive_reviews', 'Negative_reviews'
            ],
            raw:true
        });
    

        if (!game.length) {
            return res.status(404).send('Games not found');
        }

        res.status(200).json(game);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching game details');
    }
};


const postEditGame = async (req, res) => {
    const { AppID, updates } = req.body;

    // Check slave availability before proceeding
    const slavesAvailable = await checkSlaveAvailability();
    if (!slavesAvailable) {
        return res.status(503).send('One or more slave databases are not available.');
    }

    const transaction = await masterDb.transaction();

    try {
        const game = await masterDb.models.fact_table.findOne({ where: { AppID } }, { transaction });

        if (!game) {
            return res.status(404).send('Game not found');
        }

        // Update game details
        await game.update(updates, { transaction });

        // Replicate changes to other nodes
        await nodeOneDb.models.fact_table.update(updates, { where: { AppID }, transaction });
        await nodeTwoDb.models.fact_table.update(updates, { where: { AppID }, transaction });

        await transaction.commit();
        res.status(200).send('Game updated successfully');
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).send('Error updating game');
    }
};

const postDeleteGame = async (req, res) => {
    const { AppID } = req.body;

    // Check slave availability before proceeding
    const slavesAvailable = await checkSlaveAvailability();
    if (!slavesAvailable) {
        return res.status(503).send('One or more slave databases are not available.');
    }

    try {
        // Delete from master node
        await masterDb.models.fact_table.destroy({ where: { AppID } });

        // Also delete from the appropriate node
        const game = await masterDb.models.fact_table.findOne({ where: { AppID } });
        let dbInstance;

        if (game && game.release_date.getFullYear() < 2020) {
            dbInstance = nodeOneDb; // Node 2
        } else {
            dbInstance = nodeTwoDb; // Node 3
        }

        await dbInstance.models.fact_table.destroy({ where: { AppID } });

        res.status(200).send('Game deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting game');
    }
};

module.exports = {
    postAddGame,
    getGameDetails,
    postEditGame,
    postDeleteGame,
    getIndex
};