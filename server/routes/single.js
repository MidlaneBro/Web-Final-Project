// import express from 'express';

// const router = express.Router();

// router.get('/', (req, res) => {
//     res.send('This is single player page');
// });

// export default router

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('This is single player page');
    console.log('yeet')
});

module.exports = router;