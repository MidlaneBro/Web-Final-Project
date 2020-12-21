import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('This is Lobby');
});

router.post('/', (req, res) => {
    res.send('Received a POST HTTP method');
});

router.put('/', (req, res) => {
    res.send('Received a PUT HTTP method');
});

router.delete('/', (req, res) => {
    res.send('Received a DELETE HTTP method');
});

export default router