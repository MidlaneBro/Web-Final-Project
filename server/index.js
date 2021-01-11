require('dotenv-defaults').config()

const http = require("http")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const mongoose = require("mongoose")
const WebSocket = require('ws')

const Leaderboard = require('./models/leaderboard')

const app = express()
const homeRouter = require('./routes/home.js')
const singleRouter = require('./routes/single.js')
const multipleRouter = require('./routes/multiple.js')
const ruleRouter = require('./routes/rule.js')
const leaderboardRouter = require('./routes/leaderboard.js')
const authorRouter = require('./routes/author.js')
app.use(bodyParser.json())
app.use(cors())
app.use('/',homeRouter)
app.use('/single_player',singleRouter);
app.use('/multiple_player',multipleRouter);
app.use('/rule',ruleRouter);
app.use('/leaderboard',leaderboardRouter);
app.use('/author',authorRouter);
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

if (!process.env.MONGO_URL) {
    console.error('Missing MONGO_URL!!!')
    process.exit(1)
}

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', (error) => {
    console.error(error)
})

db.once('open', () => {
    console.log('MongoDB connected!')

    wss.on('connection', ws => {
        console.log('Client connected!')

        ws.on('message', data => {
            console.log(data)
            //取得所有連接中的 client
            /*let clients = wss.clients
            
            //做迴圈，發送訊息至每個 client
            clients.forEach(client => {
                client.send(data)
            })*/
        })
    
        ws.on('close', () => {
            console.log('Websocket closed!')
        })
    })

    const PORT = process.env.port || 4000
    server.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`)
    })
});