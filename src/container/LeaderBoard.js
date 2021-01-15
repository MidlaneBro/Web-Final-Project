import {useState} from 'react';
import {Button} from 'antd';

function LeaderBoard(props){
    const [mode, setmode] = useState('all');

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
                            <th>Mode</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data.filter(e=>e.mode!==mode).map(e=>
                            <tr>
                                <td>{e.name}</td>
                                <td>{e.mode}</td>
                                <td>{e.score}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="footer">
                <Button type="primary" size="large" onClick={()=>setmode('all')}>All</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" size="large" onClick={()=>setmode('multiple')}>Single</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" size="large" onClick={()=>setmode('single')}>Multiple</Button>
                <br></br>
                <br></br>
                <br></br>
            </div>
        </div>
    );
}

export default LeaderBoard;