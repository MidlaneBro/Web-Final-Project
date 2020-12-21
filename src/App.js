import './App.css';
import {switchToSingle, switchToMultiple, switchToRule, switchToLeaderboard, switchToAuthor, backToLobby} from './axios';
import {useState} from 'react';
import Lobby from './container/Lobby';
import Single from './container/Single';
import Multiple from './container/Multiple';
import Rule from './container/Rule';
import Author from './container/Author';

function App() {
  const [page, setpage] = useState("Lobby");
  const [msg, setmsg] = useState("");

  const onClickSingle = async () => {
    await switchToSingle();
    setpage("Single");
    setmsg("");
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
    setpage("Leaderboard");
    setmsg(msg);
  }

  const onClickAuthor = async () => {
    let msg = await switchToAuthor();
    setpage("Author");
    setmsg(msg);
  }

  const onClickReturn = async () => {
    await backToLobby();
    setpage("Lobby");
    setmsg("");
  }

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
