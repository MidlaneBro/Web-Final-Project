const express = require('express');
const LeaderBoard = require('../models/leaderboard.js');

const router = express.Router();

router.get('/', (req, res) => {
    LeaderBoard.find().sort({score:-1}).exec((err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});

module.exports = router;