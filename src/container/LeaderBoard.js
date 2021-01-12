function LeaderBoard(props){
    return(
        <div>
            <div className="head">
                <button className="button3" onClick={props.onClickReturn}>Return</button>
            </div>
            <div className="leaderboard">
                <h1>LeaderBoard</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data.map(e=>
                            <tr>
                                <td>{e.name}</td>
                                <td>{e.score}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <h2>Top 10</h2>
            </div>
        </div>
    );
}

export default LeaderBoard;