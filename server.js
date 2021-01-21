require('dotenv-defaults').config()

const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const http = require("http")
const mongoose = require("mongoose")
const WebSocket = require('ws')

const app = express();
const singleRouter = require('./src/routes/single.js')
const multipleRouter = require('./src/routes/multiple.js')
const leaderboardRouter = require('./src/routes/leaderboard.js')

const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(cors())
app.use('/single_player',singleRouter);
app.use('/multiple_player',multipleRouter);
app.use('/leaderboard',leaderboardRouter);
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = http.createServer(app)
const wss = new WebSocket.Server({ server:server })

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
        "other": {gs,tcx,tcy,apple,tool,gray}
        "gameid": setinterval of game()
    }
}*/

function occupied(x, y, snake1, snake2, other) {
  for(let i=0;i<snake1.trail.length;i++){
      if(x===snake1.trail[i].x && y===snake1.trail[i].y){
          return true;
      }
  }
  for(let i=0;i<snake2.trail.length;i++){
      if(x===snake2.trail[i].x && y===snake2.trail[i].y){
          return true;
      }
  }
  if((x===snake1.px+snake1.xv && y===snake1.py+snake1.yv) || (x===snake2.px+snake2.xv && y===snake2.py+snake2.yv)){
      return true;
  }
  for(let i=0;i<other.apple.length;i++){
      if(x===other.apple[i].x && y===other.apple[i].y){
          return true;
      }
  }
  for(let i=0;i<other.tool.length;i++){
      if(x===other.tool[i].x && y===other.tool[i].y){
          return true;
      }
  }
  for(let i=0;i<other.gray.length;i++){
      if(x===other.gray[i].x && y===other.gray[i].y){
          return true;
      }
  }
  return false;
}

const game = (room, uuid1, uuid2, snake1, snake2, other) => {
  snake1.px = snake1.px + snake1.xv;
  snake1.py = snake1.py + snake1.yv;
  snake2.px = snake2.px + snake2.xv;
  snake2.py = snake2.py + snake2.yv;
  if((snake1.px < 0 || snake1.px > other.tcx-1 || snake1.py < 0 || snake1.py > other.tcy-1) && snake1.alive){
      endgame(room,uuid1,'snake1');
  }
  if((snake2.px < 0 || snake2.px > other.tcx-1 || snake2.py < 0 || snake2.py > other.tcy-1) && snake2.alive){
      endgame(room,uuid2,'snake2');
  }
  //hit snake1
  for(let i=0;i<snake1.trail.length;i++){
      if(snake1.trail[i].x === snake1.px && snake1.trail[i].y === snake1.py && snake1.alive){
          if(snake1.xv !== 0 || snake1.yv !== 0){
              endgame(room,uuid1,'snake1');
          }
      }
      if(snake1.trail[i].x === snake2.px && snake1.trail[i].y === snake2.py && snake2.alive){
          if(snake2.xv !==0 || snake2.yv !== 0){
              endgame(room,uuid2,'snake2');
          }
      }
  }
  //hit snake2
  for(let i=0;i<snake2.trail.length;i++){
      if(snake2.trail[i].x === snake2.px && snake2.trail[i].y === snake2.py && snake2.alive){
          if(snake2.xv !==0 || snake2.yv !==0){
              endgame(room,uuid2,'snake2');
          }
      }
      if(snake2.trail[i].x === snake1.px && snake2.trail[i].y === snake1.py && snake1.alive){
          if(snake1.xv !==0 || snake1.yv !== 0){
              endgame(room,uuid1,'snake1');
          }
      }
  }
  //snake hit gray
  for(let i=0;i<other.gray.length;i++){
      if(snake1.px === other.gray[i].x && snake1.py === other.gray[i].y && snake1.alive)
          endgame(room,uuid1,'snake1');
      if(snake2.px === other.gray[i].x && snake2.py === other.gray[i].y && snake2.alive)
          endgame(room,uuid2,'snake2');
  }
  if(!snake1.alive && !snake2.alive){
      clearInterval(rooms[room]['gameid']);
  }
  snake1.trail = [...snake1.trail, { x:snake1.px, y:snake1.py }];
  snake2.trail = [...snake2.trail, { x:snake2.px, y:snake2.py }];
  while(snake1.trail.length > snake1.tail){
      snake1.trail.splice(0,1);
  }
  while(snake2.trail.length > snake2.tail){
      snake2.trail.splice(0,1);
  }
  //eat apple
  for(let i=0;i<other.apple.length;i++){
      if((snake1.px === other.apple[i].x && snake1.py === other.apple[i].y) || (snake2.px === other.apple[i].x && snake2.py === other.apple[i].y)){
          if(snake1.px === other.apple[i].x && snake1.py === other.apple[i].y){
              snake1.tail += 1;
              snake1.score += 1;
          }
          if(snake2.px === other.apple[i].x && snake2.py === other.apple[i].y){
              snake2.tail +=1;
              snake2.score += 1;
          }
          other.count += 1;
          let apple_x = Math.floor(Math.random()*other.tcx);
          let apple_y = Math.floor(Math.random()*other.tcy);
          while(occupied(apple_x,apple_y,snake1,snake2,other)){
              apple_x = Math.floor(Math.random()*other.tcx);
              apple_y = Math.floor(Math.random()*other.tcy);
          }
          other.apple[i].x = apple_x;
          other.apple[i].y = apple_y;
          if(other.count%3===0){
              let tool_x = Math.floor(Math.random()*other.tcx);
              let tool_y = Math.floor(Math.random()*other.tcy);
              while(occupied(tool_x,tool_y,snake1,snake2,other)){
                  tool_x = Math.floor(Math.random()*other.tcx);
                  tool_y = Math.floor(Math.random()*other.tcy);
              }
              other.tool = [...other.tool, {type:Math.floor(Math.random()*4),x:tool_x,y:tool_y}];
          }
          let gray_x = Math.floor(Math.random()*other.tcx);
          let gray_y = Math.floor(Math.random()*other.tcy);
          while(occupied(gray_x,gray_y,snake1,snake2,other)){
              gray_x = Math.floor(Math.random()*other.tcx);
              gray_y = Math.floor(Math.random()*other.tcy);
          }
          other.gray = [...other.gray, {x:gray_x,y:gray_y}];
      }
  }
  for(let i=0;i<other.tool.length;i++){
      if((snake1.px === other.tool[i].x && snake1.py === other.tool[i].y) || (snake2.px === other.tool[i].x && snake2.py === other.tool[i].y)){
          if(snake1.px === other.tool[i].x && snake1.py === other.tool[i].y){
              switch (other.tool[i].type) {
                  case 0: //point
                      snake1.score += 5;
                      break;
                  case 1: //grow
                      snake1.tail += 10;
                      snake1.score += 3;
                      break;
                  case 2: //molt
                      for(let i=0;i<snake1.trail.length-1;i++){
                          other.gray = [...other.gray,{x:snake1.trail[i].x,y:snake1.trail[i].y}];
                      }
                      snake1.tail = 1;
                      snake1.score += 3;
                      break;
                  /*case 3: //speed-up
                      other.speed *= 1.2;
                      console.log(`reset interal of game with gameid:${rooms[room]['gameid']}`);
                      clearInterval(rooms[room]['gameid']);
                      rooms[room]['gameid'] = setInterval(()=>game(rooms[room],rooms[room][uuid1],rooms[room][uuid2],rooms[room]['snake1'],rooms[room]['snake2'],rooms[room]['other']),1000/other.speed);
                      snake1.score += 3;
                      break;
                  case 4: //speed-down
                      other.speed /= 1.2;
                      console.log(`reset interal of game with gameid:${rooms[room]['gameid']}`);
                      clearInterval(rooms[room]['gameid']);
                      rooms[room]['gameid'] = setInterval(()=>game(rooms[room],rooms[room][uuid1],rooms[room][uuid2],rooms[room]['snake1'],rooms[room]['snake2'],rooms[room]['other']),1000/other.speed);
                      break;*/
                  case 3: //return
                      snake1.px = snake1.trail[0].x;
                      snake1.py = snake1.trail[0].y;
                      if(snake1.trail.length===1){
                          snake1.xv = -snake1.xv;
                          snake1.yv = -snake1.yv;
                      }
                      else{
                          snake1.xv = snake1.trail[0].x - snake1.trail[1].x;
                          snake1.yv = snake1.trail[0].y - snake1.trail[1].y;
                      }
                      snake1.trail = snake1.trail.reverse();
                      snake1.score += 3;
                      break;
                  default:
                      break;
              }
          }
          if(snake2.px === other.tool[i].x && snake2.py === other.tool[i].y){
              switch (other.tool[i].type) {
                  case 0: //point
                      snake2.score += 5;
                      break;
                  case 1: //grow
                      snake2.tail += 10;
                      snake2.score += 3;
                      break;
                  case 2: //molt
                      for(let i=0;i<snake2.trail.length-1;i++){
                          other.gray = [...other.gray,{x:snake2.trail[i].x,y:snake2.trail[i].y}];
                      }
                      snake2.tail = 1;
                      snake2.score += 3;
                      break;
                  /*case 3: //speed-up
                      other.speed *= 1.2;
                      console.log(`reset interal of game with gameid:${rooms[room]['gameid']}`);
                      clearInterval(rooms[room]['gameid']);
                      rooms[room]['gameid'] = setInterval(()=>game(rooms[room],rooms[room][uuid1],rooms[room][uuid2],rooms[room]['snake1'],rooms[room]['snake2'],rooms[room]['other']),1000/other.speed);
                      snake2.score += 3;
                      break;
                  case 4: //speed-down
                      other.speed /= 1.2;
                      console.log(`reset interal of game with gameid:${rooms[room]['gameid']}`);
                      clearInterval(rooms[room]['gameid']);
                      rooms[room]['gameid'] = setInterval(()=>game(rooms[room],rooms[room][uuid1],rooms[room][uuid2],rooms[room]['snake1'],rooms[room]['snake2'],rooms[room]['other']),1000/other.speed);
                      break;*/
                  case 3: //return
                      snake2.px = snake2.trail[0].x;
                      snake2.py = snake2.trail[0].y;
                      if(snake2.trail.length===1){
                          snake2.xv = -snake2.xv;
                          snake2.yv = -snake2.yv;
                      }
                      else{
                          snake2.xv = snake2.trail[0].x - snake2.trail[1].x;
                          snake2.yv = snake2.trail[0].y - snake2.trail[1].y;
                      }
                      snake2.trail = snake2.trail.reverse();
                      snake2.score += 3;
                      break;
                  default:
                      break;
              }
          }
          other.tool[i] = null;
      }
  }
  other.tool = other.tool.filter(e=>e!==null);
  if(uuid1 in rooms[room]){
      rooms[room][uuid1].send(JSON.stringify(["",{snake1:{trail:snake1.trail,score:snake1.score},snake2:{trail:snake2.trail,score:snake2.score},other:other}]));
  }
  if(uuid2 in rooms[room]){
      rooms[room][uuid2].send(JSON.stringify(["",{snake1:{trail:snake2.trail,score:snake2.score},snake2:{trail:snake1.trail,score:snake1.score},other:other}]));
  }
}

function endgame(room,uuid,snake) {
  for(let i=0;i<rooms[room][snake].trail.length;i++){
      rooms[room]['other'].gray.push({x:rooms[room][snake].trail[i].x,y:rooms[room][snake].trail[i].y});
  }
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
                              apple:[
                                  {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
                                  {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
                                  {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)}
                              ],
                              count: 0,
                              tool: [],
                              gray: [],
                              speed: 10
                          }
                          rooms[room]['gameid'] = setInterval(()=>game(room,users[0].uuid,users[1].uuid,rooms[room]['snake1'],rooms[room]['snake2'],rooms[room]['other']),1000/10);
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
          }

          if(JSON.parse(data)[1]==="leave"){
              console.log(`Remove client with uuid:${uuid}`);
              leave(uuid);
          }

          if(JSON.parse(data)[1]===37||JSON.parse(data)[1]===38||JSON.parse(data)[1]===39||JSON.parse(data)[1]===40){
              for(room in rooms){
                  let flag = false;
                  for(user in rooms[room]){
                      if(user===uuid && ('gameid' in rooms[room])){
                          if(rooms[room]['snake1'].uuid===uuid && rooms[room]['snake1'].alive){
                              let t = rooms[room]['snake1'].trail;
                              switch (JSON.parse(data)[1]) {
                                  case 37: //left arrow
                                      if(t.length===1 || t[t.length-1].x-t[t.length-2].x!==1){
                                          rooms[room]['snake1'].xv = -1;
                                          rooms[room]['snake1'].yv = 0;
                                      }
                                      break;
                                  case 38: //up arrow
                                      if(t.length===1 || t[t.length-1].y-t[t.length-2].y!==1){
                                          rooms[room]['snake1'].xv = 0;
                                          rooms[room]['snake1'].yv = -1;
                                      }
                                      break;
                                  case 39: //right arrow
                                      if(t.length===1 || t[t.length-1].x-t[t.length-2].x!==-1){
                                          rooms[room]['snake1'].xv = 1;
                                          rooms[room]['snake1'].yv = 0;
                                      }
                                      break;
                                  case 40: //down arrow
                                      if(t.length===1 || t[t.length-1].y-t[t.length-2].y!==-1){
                                          rooms[room]['snake1'].xv = 0;
                                          rooms[room]['snake1'].yv = 1;
                                      }
                                      break;
                                  default:
                                      break;
                              }
                          }
                          if(rooms[room]['snake2'].uuid===uuid && rooms[room]['snake2'].alive){
                              let t = rooms[room]['snake2'].trail;
                              switch (JSON.parse(data)[1]) {
                                  case 37: //left arrow
                                      if(t.length===1 || t[t.length-1].x-t[t.length-2].x!==1){
                                          rooms[room]['snake2'].xv = -1;
                                          rooms[room]['snake2'].yv = 0;
                                      }
                                      break;
                                  case 38: //up arrow
                                      if(t.length===1 || t[t.length-1].y-t[t.length-2].y!==1){
                                          rooms[room]['snake2'].xv = 0;
                                          rooms[room]['snake2'].yv = -1;
                                      }
                                      break;
                                  case 39: //right arrow
                                      if(t.length===1 || t[t.length-1].x-t[t.length-2].x!==-1){
                                          rooms[room]['snake2'].xv = 1;
                                          rooms[room]['snake2'].yv = 0;
                                      }
                                      break;
                                  case 40: //down arrow
                                      if(t.length===1 || t[t.length-1].y-t[t.length-2].y!==-1){
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

  const port = process.env.PORT || 3000
  server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
  })
});