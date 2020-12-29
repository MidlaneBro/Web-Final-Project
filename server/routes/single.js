import express from 'express';
import LeaderBoard from '../models/leaderboard.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('This is single player page');
});

router.post('/', (req,res) => {
    LeaderBoard.create({name:req.body.name,score:req.body.score});
    res.send('Success');
});

export default router;