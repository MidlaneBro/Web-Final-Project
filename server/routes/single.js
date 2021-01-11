const express = require('express');
const LeaderBoard = require('../models/leaderboard.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('This is single player page');
});

router.post('/', (req, res) => {
    let data = LeaderBoard.create({name:req.body.name,score:req.body.score});
    res.send(data);
})

module.exports = router;