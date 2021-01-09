const dotenv = require("dotenv")
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const http = require("http")
const cors = require('cors');
const homeRouter = require('./routes/home.js');
const singleRouter = require('./routes/single.js');
const multipleRouter = require('./routes/multiple.js');
const MONGO_URL='mongodb+srv://User0:0000@cluster0.bwyum.mongodb.net/Cluster0?retryWrites=true&w=majority'
dotenv.config();

if (!MONGO_URL) {
    console.error('Missing MONGO_URL!!!');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 4000
const server = http.createServer(app).listen(port, () => console.log(`App listening on port ${port}!`))

const WebSocket = require('ws')
const wss = new WebSocket.Server({ server })


const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

app.use(bodyParser.json());
app.use(cors());
app.use('/',homeRouter);
app.use('/single_player',singleRouter);
app.use('/multiple_player',multipleRouter);
// app.use('/rule',ruleRouter);
// app.use('/leaderboard',leaderboardRouter);
// app.use('/author',authorRouter);

mongoose.connect(MONGO_URL, dbOptions)
.then(res => {
    console.log('mongo db connection created')
})

const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error)
})

db.once('open', () => {
    //app.listen(port, () => console.log(`App listening on port ${port}!`))
});

//監聽 Server 連線後的所有事件，並捕捉事件 socket 執行
wss.on('connection', ws => {

    //連結時執行此 console 提示
    console.log('Client connected')

    ws.on('message', data => {
        //取得所有連接中的 client
        let clients = wss.clients
        
        //做迴圈，發送訊息至每個 client
        clients.forEach(client => {
            client.send(data)
        })
    })

    ws.on('close', () => {
        console.log('Close connected')
    })
})