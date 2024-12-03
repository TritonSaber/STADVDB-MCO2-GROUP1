const express = require('express');
const controller = require('../controller/controller');

const router = express.Router();

router.post('/get-games', controller.getGameDetails);
router.post('/add-game', controller.postAddGame);
router.put('/update-game', controller.updateGameDetails);
router.delete('/delete-game', controller.deleteGame);

module.exports = router;
