
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




export const getIndex = async (req,res)=>{
    res.render('index', {title: 'Main Page'})
};

export const getGameDetails = async (req,res)=>{
    try {
        const game = await Fact_Game.findOne({
            where: { game_ID },
            include: [{
                model: fact_table,
                as: 'details'
            }]
        });

        if (!game) {
            return null;
        }

        details_ID = game.details_ID
        return game.details.toJSON();
    }catch (err) {
        console.error(err);
        throw err;
    }
};

export const postAddGame = async (req,res)=>{
    
};

export const postEditGame = async (req, res)=>{
    
};

export const postDeleteGame = async (req,res)=>{
    const {App_ID} = req.body
    
    if(App_ID !== null){

    }
};

module.exports = {sequelize};