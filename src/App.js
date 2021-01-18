import './App.css';
import 'antd/dist/antd.css';
import {switchToLeaderboard, switchToMultiple, switchToSingle} from './axios';
import {useEffect, useState} from 'react';
import Lobby from './container/Lobby';
import Single from './container/Single';
import Multiple from './container/Multiple';
import Rule from './container/Rule';
import LeaderBoard from './container/LeaderBoard';
import Author from './container/Author';

let client = new WebSocket('ws://localhost:3000');

function App() {
  const [page, setpage] = useState("Lobby");
  //for multiple game
  const [uuid, setuuid] = useState("");
  const [status, setstatus] = useState("");
  const [game, setgame] = useState(null);
  //for leaderboard
  const [msg, setmsg] = useState("");

  const onClickSingle = async () => {
    let msg = await switchToSingle();
    setmsg(msg);
    setpage("Single");
  }

  const onClickMultiple = async () => {
    let msg = await switchToMultiple();
    setmsg(msg);
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

  const onClickRule = () => {
    setpage("Rule");
  }

  const onClickLeaderboard = async () => {
    let msg = await switchToLeaderboard();
    setmsg(msg);
    setpage("Leaderboard");
  }

  const onClickAuthor = () => {
    setpage("Author");
  }

  const onClickReturn = () => {
    setpage("Lobby");
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
        <Single onClickReturn={onClickReturn} data={msg}></Single>
      </div>
    );
  }

  if(page==="Multiple"){
    return (
      <div className="App">
        <Multiple client={client} uuid={uuid} status={status} game={game} data={msg} onClickReturn={returnFromMultiple}></Multiple>
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
