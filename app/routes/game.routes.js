module.exports = app => {
    const games = require("../controllers/game.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", games.create);
  
    // Retrieve all games
    router.get("/", games.findAll);
  
    // Retrieve all published games
    router.get("/published", games.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", games.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", games.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", games.delete);
  
    // Delete all games
    router.delete("/", games.deleteAll);
  
    app.use('/api/games', router);
  };