const express = require('express');
const LeaderBoard = require('../models/leaderboard.js');

const router = express.Router();

router.get('/', (req, res) => {
    LeaderBoard.find({mode:'multiple'}).limit(10).sort({score:-1}).exec((err,result)=>{
        if (err) throw err;
        res.send(result);
    });
})

router.post('/', async (req, res) => {
    LeaderBoard.find({mode:'multiple'}).limit(10).sort({score:-1}).exec((err,result)=>{
        if (err) throw err;
        else if (result.length===10){
            LeaderBoard.deleteOne(result[9],function(err,result){
                if (err) throw err;
                LeaderBoard.create({name:req.body.name,mode:'multiple',score:req.body.score},function(err,result){
                    if (err) throw err;
                    res.send(result);
                })
            })
        }
        else{
            LeaderBoard.create({name:req.body.name,mode:'multiple',score:req.body.score},function(err,result){
                if (err) throw err;
                res.send(result);
            })
        }
    })
})

module.exports = router;