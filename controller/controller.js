
const sequelize = require('../db');
const express = require('express');
const fact_table = require('./models/main_db.js')

const sequelize = new Sequelize('steamgameswarehouse', 'root', '96ePChmajy5n', {
    host: 'localhost',
    dialect: 'mysql'
});

try {
    await sequelize.authenticate();
    console.log('Connection to MySQL has been established');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}




const getIndex = ((req,res)=>{
    res.render('index', {title: 'Main Page'})
});

const getGameDetails = ((req,res)=>{
    
});

const postAddGame = ((req,res)=>{
    
});

const postEditGame = ((req, res)=>{

});

const postDeleteGame = ((req,res)=>{

});

module.exports = {sequelize, getIndex, getGameDetails, postAddGame, postEditGame, postDeleteGame};