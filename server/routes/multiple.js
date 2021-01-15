const express = require('express');
const LeaderBoard = require('../models/leaderboard.js');

const router = express.Router();

router.post('/', (req, res) => {
    let data = LeaderBoard.create({name:req.body.name,mode:"multiple",score:req.body.score});
    res.send(data);
})

module.exports = router;