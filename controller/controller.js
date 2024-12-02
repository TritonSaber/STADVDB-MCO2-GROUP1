const sequelize = require('../models/main_db.js');
const express = require('express');
const path = require('path');
const { masterDb, nodeOneDb, nodeTwoDb, fact_table } = require('../models/main_db.js');

const getIndex = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html')); 
};

// Function to add a game to the appropriate node
const postAddGame = async (req, res) => {
    const gameData = req.body;

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
    const { game_ID } = req.body;
    masterDb.models.fact_table = fact_table;

    try {
        const game = await masterDb.models.fact_table.findAll({
            where: { AppID: game_ID },
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

    try {
        // Delete from master node
        await masterDb.models.fact_table.destroy({ where: { AppID } });

        // Also delete from the appropriate node
        const game = await masterDb.models.fact_table.findOne({ where: { AppID } });
        let dbInstance;

        if (game && game.releaseYear < 2020) {
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