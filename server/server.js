import dotenv from 'dotenv-defaults';

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import LeaderBoard from './models/leaderboard.js';

import homeRouter from './routes/home.js';
import singleRouter from './routes/single.js';
import multipleRouter from './routes/multiple.js';
import ruleRouter from './routes/rule.js';
import leaderboardRouter from './routes/leaderboard.js';
import authorRouter from './routes/author.js';

dotenv.config();

if (!process.env.MONGO_URL) {
    console.error('Missing MONGO_URL!!!');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 4000
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

app.use(bodyParser.json());
app.use(cors());
app.use('/',homeRouter);
app.use('/single_player',singleRouter);
app.use('/multiple_player',multipleRouter);
app.use('/rule',ruleRouter);
app.use('/leaderboard',leaderboardRouter);
app.use('/author',authorRouter);

mongoose.connect(process.env.MONGO_URL, dbOptions)
.then(res => {
    console.log('mongo db connection created')
})

const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error)
})

db.once('open', () => {
    app.listen(port, () => console.log(`App listening on port ${port}!`))
});