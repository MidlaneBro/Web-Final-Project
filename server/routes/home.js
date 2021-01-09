// import express from 'express';

// const router = express.Router();

// router.get('/', (req, res) => {
//     res.send('This is Lobby');
// });

// export default router

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('This is Lobby');
});

module.exports = router;