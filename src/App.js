import './App.css';
import {switchToSingle, switchToMultiple, switchToRule, switchToLeaderboard, switchToAuthor, backToLobby} from './axios';
import {useState} from 'react';
import Lobby from './container/Lobby';
import Single from './container/Single';
import Multiple from './container/Multiple';
import Rule from './container/Rule';
import LeaderBoard from './container/LeaderBoard';
import Author from './container/Author';

function App() {
  const [page, setpage] = useState("Lobby");
  const [msg, setmsg] = useState("");

  const onClickSingle = async () => {
    let msg = await switchToSingle();
    setpage("Single");
    setmsg(msg);
  }

  const onClickMultiple = async () => {
    let msg = await switchToMultiple();
    setpage("Multiple");
    setmsg(msg);
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

  if(page==="Lobby"){
    return (
      <div className="App">
        <Lobby onClickSingle={onClickSingle} onClickMultiple={onClickMultiple} onClickRule={onClickRule} onClickLeaderboard={onClickLeaderboard} onClickAuthor={onClickAuthor}></Lobby>
      </div>
    );
  }

  if(page==="Single"){
    console.log("singleplayer now!")
    return (
      <div className="App">
        <Single onClickReturn={onClickReturn}></Single>
      </div>
    );
  }

  if(page==="Multiple"){
    return (
      <div className="App">
        {msg}
        <button onClick={onClickReturn}>return</button>
      </div>
    )
  }

  if(page==="Rule"){
    return (
      <div className="App">
        {msg}
        <button onClick={onClickReturn}>return</button>
      </div>
    )
  }

  if(page==="Leaderboard"){
    return (
      <div className="App">
        {msg}
        <button onClick={onClickReturn}>return</button>
      </div>
    )
  }

  if(page==="Author"){
    return (
      <div className="App">
        {msg}
        <button onClick={onClickReturn}>return</button>
      </div>
    )
  }
} 

export default App;
