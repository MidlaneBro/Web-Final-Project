const express = require('express');
const LeaderBoard = require('../models/leaderboard.js');

const router = express.Router();

router.get('/', async (req, res) => {
    let single = await LeaderBoard.find({mode:'single'}).limit(10).sort({score:-1}).exec();
    let multiple = await LeaderBoard.find({mode:'multiple'}).limit(10).sort({score:-1}).exec();
    let data = [...single,...multiple];
    data.sort(function(a,b){return b.score-a.score});
    res.send(data);
});

module.exports = router;