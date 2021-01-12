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

const rooms = {}
/*rooms = {
    room1 : {
        uuid1: ws1
        uuid2: ws2
    }
}*/

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

db.once('open', () => {
    console.log('MongoDB connected!')


    wss.on('connection', ws => {
        const uuid = uuidv4();
        const leave = uuid => {
            for(room in rooms){
                let flag = false;
                for(user in rooms[room]){
                    if(uuid===user){
                        delete rooms[room][user];
                        flag = true;
                        break;
                    }
                }
                if(flag){
                    if(Object.keys(rooms[room]).length===0){
                        delete rooms[room];
                    }
                    else if(Object.keys(rooms[room]).length===1){
                        for(const [key,value] of Object.entries(rooms[room])){
                            value.send(JSON.stringify([uuid,'leave']));
                        }
                    }
                    break;
                }
            }
        }
        ws.on('message', data => {
            console.log(JSON.parse(data));
            if(JSON.parse(data)[1]==='join'){
                console.log(`Add client with uuid:${uuid}`);
                if(rooms==={}){
                    const room = uuidv4();
                    rooms[room] = {};
                    rooms[room][uuid] = ws;
                    console.log(`Create new room with id:${room}`);
                    ws.send(JSON.stringify([uuid,'wait']));
                }
                else{
                    flag = false;
                    for(room in rooms){
                        if(Object.keys(rooms[room]).length===1){
                            rooms[room][uuid] = ws;
                            for(const [key,value] of Object.entries(rooms[room])){
                                value.send(JSON.stringify([uuid,'start']));
                            }
                            flag = true;
                            break;
                        }
                    }
                    if(!flag){
                        const room = uuidv4();
                        rooms[room] = {};
                        rooms[room][uuid] = ws;
                        console.log(`Create new room with id:${room}`);
                        ws.send(JSON.stringify([uuid,'wait']));
                    }
                }
            }
            if(JSON.parse(data)[1]==="leave"){
                console.log(`Remove client with uuid:${uuid}`);
                leave(uuid);
            }
            console.log(rooms);
        })
    
        ws.on('close', () => {
            leave(uuid);
            console.log(rooms);
        })
    })

    const PORT = process.env.port || 4000
    server.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`)
    })
});