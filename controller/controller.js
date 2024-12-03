const {
    fact_table_master_pre2020,
    fact_table_master_post2020,
    fact_table_nodeOne,
    fact_table_nodeTwo,
} = require('../models/main_db');

const postAddGame = async (req, res) => {
    try {
        const gameData = req.body;  // The gameData should include all necessary fields
        const releaseDate = new Date(gameData.Release_date);

        // Remove AppID from gameData if it exists (it should not exist, because it's auto-incremented)
        delete gameData.AppID;

        // Insert the new game into the correct table based on release year
        if (releaseDate.getFullYear() < 2020) {
            await fact_table_master_pre2020.create(gameData);
            await fact_table_nodeOne.create(gameData);
        } else {
            await fact_table_master_post2020.create(gameData);
            await fact_table_nodeTwo.create(gameData);
        }

        res.status(201).json({ message: 'Game added successfully.' });
    } catch (error) {
        console.error('Error adding game:', error);
        res.status(500).json({ error: 'Failed to add game.' });
    }
};

const getGameDetails = async (req, res) => {
    try {
        const { appId } = req.body;

        const gamePre2020 = await fact_table_master_pre2020.findOne({ where: { AppID: appId } });
        if (gamePre2020) return res.status(200).json(gamePre2020);

        const gamePost2020 = await fact_table_master_post2020.findOne({ where: { AppID: appId } });
        if (gamePost2020) return res.status(200).json(gamePost2020);

        res.status(404).json({ message: 'Game not found.' });
    } catch (error) {
        console.error('Error retrieving game details:', error);
        res.status(500).json({ error: 'Failed to retrieve game details.' });
    }
};

// Retrieve all added games
const getAllGames = async (req, res) => {
    try {
        const gamesPre2020 = await fact_table_master_pre2020.findAll();
        const gamesPost2020 = await fact_table_master_post2020.findAll();

        // Combine both lists of games
        const allGames = [...gamesPre2020, ...gamesPost2020];

        res.status(200).json(allGames);
    } catch (error) {
        console.error('Error fetching all games:', error);
        res.status(500).json({ error: 'Failed to fetch all games.' });
    }
};

// Update Game Details
const updateGameDetails = async (req, res) => {
    try {
        const { AppID, ...updatedData } = req.body;

        // Ensure that the AppID is valid and present in the request body
        if (!AppID) {
            return res.status(400).json({ error: 'AppID is required to update a game.' });
        }

        const gamePre2020 = await fact_table_master_pre2020.findOne({ where: { AppID } });
        if (gamePre2020) {
            // If the game exists in the pre-2020 table, update the game
            await fact_table_master_pre2020.update(updatedData, { where: { AppID } });
            await fact_table_nodeOne.update(updatedData, { where: { AppID } });
            return res.status(200).json({ message: 'Game updated successfully.' });
        }

        const gamePost2020 = await fact_table_master_post2020.findOne({ where: { AppID } });
        if (gamePost2020) {
            // If the game exists in the post-2020 table, update the game
            await fact_table_master_post2020.update(updatedData, { where: { AppID } });
            await fact_table_nodeTwo.update(updatedData, { where: { AppID } });
            return res.status(200).json({ message: 'Game updated successfully.' });
        }

        // If no game was found in both tables
        res.status(404).json({ message: 'Game not found.' });
    } catch (error) {
        console.error('Error updating game details:', error);
        res.status(500).json({ error: 'Failed to update game details.' });
    }
};

// Delete Game
const deleteGame = async (req, res) => {
    try {
        const { AppID } = req.body;

        const gamePre2020 = await fact_table_master_pre2020.findOne({ where: { AppID } });
        if (gamePre2020) {
            await fact_table_master_pre2020.destroy({ where: { AppID } });
            await fact_table_nodeOne.destroy({ where: { AppID } });
            return res.status(200).json({ message: 'Game deleted successfully.' });
        }

        const gamePost2020 = await fact_table_master_post2020.findOne({ where: { AppID } });
        if (gamePost2020) {
            await fact_table_master_post2020.destroy({ where: { AppID } });
            await fact_table_nodeTwo.destroy({ where: { AppID } });
            return res.status(200).json({ message: 'Game deleted successfully.' });
        }

        res.status(404).json({ message: 'Game not found.' });
    } catch (error) {
        console.error('Error deleting game:', error);
        res.status(500).json({ error: 'Failed to delete game.' });
    }
};

module.exports = {
    postAddGame,
    getGameDetails,
    getAllGames,
    updateGameDetails,
    deleteGame,
};
