import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('This is multiple player page');
});

export default router

// const express = require('express');

// const router = express.Router();

// router.get('/', (req, res) => {
//     res.send('This is multiple player page');
// });

// module.exports = router;