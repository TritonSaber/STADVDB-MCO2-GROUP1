const express = require('express');
const controller = require('../controller/controller.js');
const app = express.Router();

app.get('/', controller.getIndex);
app.post('/get-games', controller.getGameDetails);
app.post('/add', controller.postAddGame);
app.post('/edit/:id', controller.postEditGame);
app.post('/delete/:id', controller.postDeleteGame);

module.exports = app;