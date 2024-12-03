const { Sequelize } = require("sequelize");
const {
  fact_table_master_pre2020,
  fact_table_master_post2020,
  //   fact_table_nodeOne,
  //   fact_table_nodeTwo,
} = require("../models/main_db.js");

const postAddGame = async (req, res) => {
  try {
    const gameData = req.body; // The gameData should include all necessary fields
    const releaseDate = new Date(gameData.Release_date);

    // Remove AppID from gameData if it exists (it should not exist, because it's auto-incremented)
    delete gameData.AppID;

    // Insert the new game into the correct table in MASTERNODE based on release year
    let createdGame;
    if (releaseDate.getFullYear() < 2020) {
      // Insert into MASTERNODE pre2020 table
      createdGame = await fact_table_master_pre2020.create(gameData);
    } else {
      // Insert into MASTERNODE post2020 table
      createdGame = await fact_table_master_post2020.create(gameData);
    }

    // Send back the created game data as a response
    res.status(201).json(createdGame);
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({ error: "Failed to add game." });
  }
};

const getGameDetails = async (req, res) => {
  try {
    const { appId } = req.body;

    // Search for the game in MASTERNODE tables only
    const gamePre2020 = await fact_table_master_pre2020.findOne({
      where: { AppID: appId },
    });
    if (gamePre2020) return res.status(200).json(gamePre2020);

    const gamePost2020 = await fact_table_master_post2020.findOne({
      where: { AppID: appId },
    });
    if (gamePost2020) return res.status(200).json(gamePost2020);

    res.status(404).json({ message: "Game not found." });
  } catch (error) {
    console.error("Error retrieving game details:", error);
    res.status(500).json({ error: "Failed to retrieve game details." });
  }
};

const getAllGames = async (req, res) => {
  try {
    // Fetch all games only from MASTERNODE tables
    const gamesPre2020 = await fact_table_master_pre2020.findAll();
    const gamesPost2020 = await fact_table_master_post2020.findAll();

    // Combine both lists of games
    const allGames = [...gamesPre2020, ...gamesPost2020];

    // Send all games back as a response
    res.status(200).json(allGames);
  } catch (error) {
    console.error("Error fetching all games:", error);
    res.status(500).json({ error: "Failed to fetch all games." });
  }
};

const updateGameDetails = async (req, res) => {
  try {
    const { AppID, ...updatedData } = req.body;

    // Ensure that the AppID is valid and present in the request body
    if (!AppID) {
      return res
        .status(400)
        .json({ error: "AppID is required to update a game." });
    }

    // Check if the game exists in the MASTERNODE pre2020 table
    const gamePre2020 = await fact_table_master_pre2020.findOne({
      where: { AppID },
    });
    if (gamePre2020) {
      await fact_table_master_pre2020.update(updatedData, { where: { AppID } });
      return res
        .status(200)
        .json({ message: "Game updated successfully in pre2020 table." });
    }

    // Check if the game exists in the MASTERNODE post2020 table
    const gamePost2020 = await fact_table_master_post2020.findOne({
      where: { AppID },
    });
    if (gamePost2020) {
      await fact_table_master_post2020.update(updatedData, {
        where: { AppID },
      });
      return res
        .status(200)
        .json({ message: "Game updated successfully in post2020 table." });
    }

    // If no game was found in either table
    return res.status(404).json({ message: "Game not found." });
  } catch (error) {
    console.error("Error updating game details:", error);
    res.status(500).json({ error: "Failed to update game details." });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { AppID } = req.body;

    // Ensure AppID exists
    if (!AppID) {
      return res
        .status(400)
        .json({ error: "AppID is required to delete a game." });
    }

    // Delete from the pre-2020 tables in MASTERNODE
    const gamePre2020 = await fact_table_master_pre2020.findOne({
      where: { AppID },
    });
    if (gamePre2020) {
      await fact_table_master_pre2020.destroy({ where: { AppID } });
      return res
        .status(200)
        .json({ message: "Game deleted successfully from pre2020 tables." });
    }

    // Delete from the post-2020 tables in MASTERNODE
    const gamePost2020 = await fact_table_master_post2020.findOne({
      where: { AppID },
    });
    if (gamePost2020) {
      await fact_table_master_post2020.destroy({ where: { AppID } });
      return res
        .status(200)
        .json({ message: "Game deleted successfully from post2020 tables." });
    }

    // If no game was found in either table
    return res.status(404).json({ message: "Game not found." });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ error: "Failed to delete game." });
  }
};

module.exports = {
  postAddGame,
  getGameDetails,
  getAllGames,
  updateGameDetails,
  deleteGame,
};
