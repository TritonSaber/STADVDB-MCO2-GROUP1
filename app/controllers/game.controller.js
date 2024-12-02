const db = require("../models");
const GameInfo = db.GameInfo; // Updated to match the new model name
const Op = db.Sequelize.Op;

// Create and Save a new GameInfo
exports.create = (req, res) => {
  // Validate request
  if (!req.body.Name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a GameInfo entry
  const gameInfo = {
    Name: req.body.Name,
    Release_date: req.body.Release_date,
    Required_age: req.body.Required_age,
    Price: req.body.Price,
    Estimated_owners_min: req.body.Estimated_owners_min,
    Estimated_owners_max: req.body.Estimated_owners_max,
    DLC_count: req.body.DLC_count,
    Achievements: req.body.Achievements,
    About_the_game: req.body.About_the_game,
    Notes: req.body.Notes,
    Reviews: req.body.Reviews,
    Metacritic_score: req.body.Metacritic_score,
    Metacritic_url: req.body.Metacritic_url,
    Positive_reviews: req.body.Positive_reviews,
    Negative_reviews: req.body.Negative_reviews,
  };

  // Save GameInfo in the database
  GameInfo.create(gameInfo)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the GameInfo.",
      });
    });
};

// Retrieve all GameInfo entries from the database.
exports.findAll = (req, res) => {
  const name = req.query.Name;
  const condition = name ? { Name: { [Op.like]: `%${name}%` } } : null;

  GameInfo.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving GameInfo entries.",
      });
    });
};

// Find a single GameInfo entry with an AppID
exports.findOne = (req, res) => {
  const id = req.params.id;

  GameInfo.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find GameInfo with AppID=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving GameInfo with AppID=" + id,
      });
    });
};

// Update a GameInfo entry by the AppID in the request
exports.update = (req, res) => {
  const id = req.params.id;

  GameInfo.update(req.body, {
    where: { AppID: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "GameInfo was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update GameInfo with AppID=${id}. Maybe GameInfo was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating GameInfo with AppID=" + id,
      });
    });
};

// Delete a GameInfo entry with the specified AppID in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  GameInfo.destroy({
    where: { AppID: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "GameInfo was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete GameInfo with AppID=${id}. Maybe GameInfo was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete GameInfo with AppID=" + id,
      });
    });
};

// Delete all GameInfo entries from the database.
exports.deleteAll = (req, res) => {
  GameInfo.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} GameInfo entries were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all GameInfo entries.",
      });
    });
};

// Find all GameInfo entries with a specific condition (e.g., Positive reviews > 1000)
exports.findAllWithCondition = (req, res) => {
  const minPositiveReviews = req.query.minPositiveReviews || 0;

  GameInfo.findAll({ where: { Positive_reviews: { [Op.gte]: minPositiveReviews } } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving GameInfo entries.",
      });
    });
};