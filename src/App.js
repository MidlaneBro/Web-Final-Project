import './App.css';
import 'antd/dist/antd.css';
import {switchToSingle, switchToRule, switchToLeaderboard, switchToAuthor, backToLobby} from './axios';
import {useEffect, useState} from 'react';
import Lobby from './container/Lobby';
import Single from './container/Single';
import Multiple from './container/Multiple';
import Rule from './container/Rule';
import LeaderBoard from './container/LeaderBoard';
import Author from './container/Author';

let client = new WebSocket('ws://localhost:4000');

function App() {
  const [page, setpage] = useState("Lobby");
  const [msg, setmsg] = useState("");
  //for multiple game
  const [uuid, setuuid] = useState("");
  const [status, setstatus] = useState("");
  const [game, setgame] = useState(null);
  //---------------------------------------

  const onClickSingle = async () => {
    let msg = await switchToSingle();
    setpage("Single");
    setmsg(msg);
  }

  const onClickMultiple = () => {
    client.send(JSON.stringify(['','join']));
    setpage("Multiple");
  }

  const returnFromMultiple = () => {
    client.send(JSON.stringify([uuid,'leave']));
    setuuid("");
    setstatus("");
    setgame(null);
    setpage('Lobby');
  }

  const onClickRule = async () => {
    let msg = await switchToRule();
    setpage("Rule");
    setmsg(msg);
  }

  const onClickLeaderboard = async () => {
    let msg = await switchToLeaderboard();
    setmsg(msg);
    setpage("Leaderboard");
  }

  const onClickAuthor = async () => {
    let msg = await switchToAuthor();
    setpage("Author");
    setmsg(msg);
  }

  const onClickReturn = async () => {
    let msg = await backToLobby();
    setpage("Lobby");
    setmsg(msg);
  }

  useEffect(() => {
    client.onmessage = event => {
      if(uuid===""){
        setuuid(JSON.parse(event.data)[0]);
      }
      if(JSON.parse(event.data)[1]==='wait'||JSON.parse(event.data)[1]==='start'||JSON.parse(event.data)[1]==='end'){
        console.log(JSON.parse(event.data));
        setstatus(JSON.parse(event.data)[1]);
      }
      if(JSON.parse(event.data)[0]===""){
        setgame(JSON.parse(event.data)[1]);
      }
    }
  })

  if(page==="Lobby"){
    return (
      <div className="App">
        <Lobby onClickSingle={onClickSingle} onClickMultiple={onClickMultiple} onClickRule={onClickRule} onClickLeaderboard={onClickLeaderboard} onClickAuthor={onClickAuthor}></Lobby>
      </div>
    );
  }

  if(page==="Single"){
    return (
      <div className="App">
        <Single onClickReturn={onClickReturn}></Single>
      </div>
    );
  }

  if(page==="Multiple"){
    return (
      <div className="App">
        <Multiple client={client} uuid={uuid} status={status} game={game} onClickReturn={returnFromMultiple}></Multiple>
      </div>
    )
  }

  if(page==="Rule"){
    return (
      <div className="App">
        <Rule onClickReturn={onClickReturn}></Rule>
      </div>
    )
  }

  if(page==="Leaderboard"){
    return (
      <div className="App">
        <LeaderBoard onClickReturn={onClickReturn} data={msg}></LeaderBoard>
      </div>
    )
  }

  if(page==="Author"){
    return (
      <div className="App">
        <Author onClickReturn={onClickReturn} data={msg}></Author>
      </div>
    )
  }
} 

export default App;
