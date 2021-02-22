import logo from "../img/logo.jpg";

function Lobby(props){
    return(
        <div>
            <div>
                <img className="Logo" src={logo} alt="snake logo"></img>
            </div>
            <div>
                <button className="button1" onClick={props.onClickSingle}>Single<br></br>Player</button>
                <button className="button1" onClick={props.onClickMultiple}>Multiple Player</button>
            </div>
           <div>
                <button className="button2" onClick={props.onClickRule}>Rule</button>
            </div> 
            <div>
                <button className="button2" onClick={props.onClickLeaderboard}>Leaderboard</button>
            </div>
            <div>
                <button className="button2" onClick={props.onClickAuthor}>Developer</button>
            </div>
        </div>
    );
}

export default Lobby;