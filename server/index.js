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
        "snake1": {uuid,alive,px,py,xv,yv,trail,tail,score}
        "snake2": {uuid,alive,px,py,xv,yv,trail,tail,score}
        "other": {gs,tcx,tcy,ax,ay}
        "gameid": setinterval of game()
    }
}*/

const game = (room, uuid1, uuid2, snake1, snake2, other, gameid) => {
    snake1.px = snake1.px + snake1.xv;
    snake1.py = snake1.py + snake1.yv;
    snake2.px = snake2.px + snake2.xv;
    snake2.py = snake2.py + snake2.yv;
    if(snake1.px < 0 && snake1.alive){
        endgame(room,uuid1,'snake1');
    }
    if(snake1.px > other.tcx-1 && snake1.alive){
        endgame(room,uuid1,'snake1');
    }
    if(snake1.py < 0 && snake1.alive){
        endgame(room,uuid1,'snake1');
    }
    if(snake1.py > other.tcy-1 && snake1.alive){
        endgame(room,uuid1,'snake1');
    }
    if(snake2.px < 0 && snake2.alive){
        endgame(room,uuid2,'snake2');
    }
    if(snake2.px > other.tcx-1 && snake2.alive){
        endgame(room,uuid2,'snake2');
    }
    if(snake2.py < 0 && snake2.alive){
        endgame(room,uuid2,'snake2');
    }
    if(snake2.py > other.tcy-1 && snake2.alive){
        endgame(room,uuid2,'snake2');
    }
    for(let i=0;i<snake1.trail.length;i++){
        if(snake1.trail[i].x === snake1.px && snake1.trail[i].y === snake1.py){
            if(snake1.xv !== 0 || snake1.yv !== 0){
                endgame(room,uuid1,'snake1');
            }
        }
        if(snake1.trail[i].x === snake2.px && snake1.trail[i].y === snake2.py){
            if(snake2.xv !==0 || snake2.yv !== 0){
                endgame(room,uuid2,'snake2');
            }
        }
    }
    for(let i=0;i<snake2.trail.length;i++){
        if(snake2.trail[i].x === snake2.px && snake2.trail[i].y === snake2.py){
            if(snake2.xv !==0 || snake2.yv !==0){
                endgame(room,uuid2,'snake2');
            }
        }
        if(snake2.trail[i].x === snake1.px && snake2.trail[i].y === snake1.py){
            if(snake1.xv !==0 || snake1.yv !== 0){
                endgame(room,uuid1,'snake1');
            }
        }
    }
    if(!snake1.alive && !snake2.alive){
        clearInterval(gameid);
    }
    snake1.trail = [...snake1.trail, { x:snake1.px, y:snake1.py }];
    snake2.trail = [...snake2.trail, { x:snake2.px, y:snake2.py }];
    while(snake1.trail.length > snake1.tail){
        snake1.trail.splice(0,1);
    }
    while(snake2.trail.length > snake2.tail){
        snake2.trail.splice(0,1);
    }
    if((other.ax === snake1.px && other.ay === snake1.py) || (other.ax === snake2.px && other.ay === snake2.py)){
        if(other.ax === snake1.px && other.ay === snake1.py){
            snake1.tail += 1;
            snake1.score += 1;
        }
        if(other.ax === snake2.px && other.ay === snake2.py){
            snake2.tail += 1;
            snake2.score += 1;
        }
        other.ax = Math.floor(Math.random()*other.tcx);
        other.ay = Math.floor(Math.random()*other.tcy);
    }
    if(uuid1 in rooms[room]){
        rooms[room][uuid1].send(JSON.stringify(["",{snake1:snake1,snake2:snake2,other:other}]));
    }
    if(uuid2 in rooms[room]){
        rooms[room][uuid2].send(JSON.stringify(["",{snake1:snake2,snake2:snake1,other:other}]));
    }
}

function endgame(room,uuid,snake) {
    rooms[room][snake].alive = false;
    rooms[room][snake].xv = 0;
    rooms[room][snake].yv = 0;
    rooms[room][snake].tail = 0;
    rooms[room][uuid].send(JSON.stringify([uuid,'end']));
}

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
                        if(Object.keys(rooms[room]).length===5){
                            if(rooms[room]['snake1'].uuid === uuid){
                                rooms[room]['snake1'].alive = false;
                                rooms[room]['snake1'].xv = 0;
                                rooms[room]['snake1'].yv = 0;
                                rooms[room]['snake1'].tail = 0;
                            }
                            if(rooms[room]['snake2'].uuid === uuid){
                                rooms[room]['snake2'].alive = false;
                                rooms[room]['snake2'].xv = 0;
                                rooms[room]['snake2'].yv = 0;
                                rooms[room]['snake2'].tail = 0;
                            }
                        }
                        else if(Object.keys(rooms[room]).length===4){
                            console.log(`End game with gameid:${rooms[room]['gameid']}`);
                            clearInterval(rooms[room]['gameid']);
                            delete rooms[room]['snake1'];
                            delete rooms[room]['snake2'];
                            delete rooms[room]['other'];
                            delete rooms[room]['gameid'];
                            delete rooms[room];
                        }
                        else if(Object.keys(rooms[room]).length===0){
                            delete rooms[room];
                        }
                        flag = true;
                        break;
                    }
                }
                if(flag){
                    break;
                }
            }
        }

        ws.on('message', data => {

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
                            let users = [];
                            for(const [key,value] of Object.entries(rooms[room])){
                                value.send(JSON.stringify([uuid,'start']));
                                users.push({uuid:key,ws:value});
                            }
                            rooms[room]['snake1'] = {
                                uuid: users[0].uuid,
                                alive: true,
                                px: 15,
                                py: 5,
                                xv: 0,
                                yv: 1,
                                trail: [],
                                tail: 5,
                                score: 0
                            };
                            rooms[room]['snake2'] = {
                                uuid: users[1].uuid,
                                alive: true,
                                px: 35,
                                py: 5,
                                xv: 0,
                                yv: 1,
                                trail: [],
                                tail: 5,
                                score: 0
                            };
                            rooms[room]['other'] = {
                                gs: 20,
                                tcx: 50,
                                tcy: 25,
                                ax: Math.floor(Math.random()*50),
                                ay: Math.floor(Math.random()*25)
                            }
                            rooms[room]['gameid'] = setInterval(()=>game(room,users[0].uuid,users[1].uuid,rooms[room]['snake1'],rooms[room]['snake2'],rooms[room]['other'],rooms[room]['gameid']),1000/10);
                            console.log(`Start game with gameid:${rooms[room]['gameid']}`);
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
                console.log(rooms);
            }

            if(JSON.parse(data)[1]==="leave"){
                console.log(`Remove client with uuid:${uuid}`);
                leave(uuid);
                console.log(rooms);
            }

            if(JSON.parse(data)[1]===37||JSON.parse(data)[1]===38||JSON.parse(data)[1]===39||JSON.parse(data)[1]===40){
                for(room in rooms){
                    let flag = false;
                    for(user in rooms[room]){
                        if(user===uuid && ('gameid' in rooms[room])){
                            if(rooms[room]['snake1'].uuid===uuid && rooms[room]['snake1'].alive){
                                switch (JSON.parse(data)[1]) {
                                    case 37: //left arrow
                                        if(rooms[room]['snake1'].xv !== 1){
                                            rooms[room]['snake1'].xv = -1;
                                            rooms[room]['snake1'].yv = 0;
                                        }
                                        break;
                                    case 38: //up arrow
                                        if(rooms[room]['snake1'].yv !== 1){
                                            rooms[room]['snake1'].xv = 0;
                                            rooms[room]['snake1'].yv = -1;
                                        }
                                        break;
                                    case 39: //right arrow
                                        if(rooms[room]['snake1'].xv !== -1){
                                            rooms[room]['snake1'].xv = 1;
                                            rooms[room]['snake1'].yv = 0;
                                        }
                                        break;
                                    case 40: //down arrow
                                        if(rooms[room]['snake1'].yv !== -1){
                                            rooms[room]['snake1'].xv = 0;
                                            rooms[room]['snake1'].yv = 1;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                            if(rooms[room]['snake2'].uuid===uuid && rooms[room]['snake2'].alive){
                                switch (JSON.parse(data)[1]) {
                                    case 37: //left arrow
                                        if(rooms[room]['snake2'].xv !== 1){
                                            rooms[room]['snake2'].xv = -1;
                                            rooms[room]['snake2'].yv = 0;
                                        }
                                        break;
                                    case 38: //up arrow
                                        if(rooms[room]['snake2'].yv !== 1){
                                            rooms[room]['snake2'].xv = 0;
                                            rooms[room]['snake2'].yv = -1;
                                        }
                                        break;
                                    case 39: //right arrow
                                        if(rooms[room]['snake2'].xv !== -1){
                                            rooms[room]['snake2'].xv = 1;
                                            rooms[room]['snake2'].yv = 0;
                                        }
                                        break;
                                    case 40: //down arrow
                                        if(rooms[room]['snake2'].yv !== -1){
                                            rooms[room]['snake2'].xv = 0;
                                            rooms[room]['snake2'].yv = 1;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                            flag = true;
                            break;
                        }
                    }
                    if(flag){
                        break;
                    }
                }
            }
        })
    
        ws.on('close', () => {
            leave(uuid);
        })
    })

    const PORT = process.env.port || 4000
    server.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`)
    })
});