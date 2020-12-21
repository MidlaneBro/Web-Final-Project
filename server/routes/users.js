import express from 'express';
import User from '../models/user.js'

const router = express.Router();

router.post('/', (req, res) => {
 return res.send('POST HTTP method on users resource');
});

router.put('/:userId',(req, res) => {
 return res.send(`PUT HTTP method on users/${req.params.userId} resource`);
});

router.get('/', async (req, res) => {
    const userList = await User.find();
    if (userList.length)
        res.status(200).send({contents:userList});
    else
        res.status(500).send([]);
});

export default router