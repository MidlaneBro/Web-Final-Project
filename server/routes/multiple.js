const express = require('express');
const LeaderBoard = require('../models/leaderboard.js');

const router = express.Router();

router.get('/', async (req, res) => {
    let multiple = await LeaderBoard.find({mode:'multiple'}).limit(10).sort({score:-1}).exec();
    res.send(multiple);
})

router.post('/', async (req, res) => {
    let multiple = await LeaderBoard.find({mode:'multiple'}).limit(10).sort({score:-1}).exec();
    if(multiple.length===10){
        await LeaderBoard.deleteOne(multiple[9]).exec();
    }
    let data = await LeaderBoard.create({name:req.body.name,mode:"multiple",score:req.body.score}).exec();
    res.send(data);
})

module.exports = router;