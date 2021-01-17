const express = require('express');
const LeaderBoard = require('../models/leaderboard.js');

const router = express.Router();

router.get('/', async (req, res) => {
    let single = await LeaderBoard.find({mode:'single'}).limit(10).sort({score:-1}).exec();
    res.send(single);
})

router.post('/', async (req, res) => {
    let single = await LeaderBoard.find({mode:'single'}).limit(10).sort({score:-1}).exec();
    if(single.length===10){
        await LeaderBoard.deleteOne(single[9]).exec();
    }
    let data = await LeaderBoard.create({name:req.body.name,mode:'single',score:req.body.score}).exec();
    res.send(data);
})

module.exports = router;