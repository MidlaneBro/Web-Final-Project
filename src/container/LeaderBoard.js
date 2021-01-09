function LeaderBoard(props){
    return(
        <div>
            <div className="head">
                <button className="button3" onClick={props.onClickReturn}>Return</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>LeaderBoard</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LeaderBoard;