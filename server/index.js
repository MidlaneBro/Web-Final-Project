import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import homeRouter from './routes/home.js';
import usersRouter from './routes/users.js';
import singleRouter from './routes/single.js';
import multipleRouter from './routes/multiple.js';
import ruleRouter from './routes/rule.js';
import leaderboardRouter from './routes/leaderboard.js';
import authorRouter from './routes/author.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv-defaults';
import User from './models/user.js';

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
app.use('/users',usersRouter);
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

const saveUser = (id, name) => {
    User.countDocuments({name}, (err, count) => {
        if (count)
            console.log(`data ${name} exists!!`);
        else {
            const user = new User({id, name});
            user.save((err) => {
                if (err) console.error(err);
                    console.log(`data ${name} saved!!!`);
            });
        }
    });
};

db.once('open', () => {
    saveUser(57, "Ric");
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});