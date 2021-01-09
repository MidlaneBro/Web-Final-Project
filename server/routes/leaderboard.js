import express from 'express';
import LeaderBoard from '../models/leaderboard.js';

const router = express.Router();

router.get('/', (req, res) => {
    LeaderBoard.find().limit(10).sort({score:-1}).exec((err,result)=>{
        if (err) throw err;
        res.send(result);
    });
});

export default router;