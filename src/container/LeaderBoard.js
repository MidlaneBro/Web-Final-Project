import { Table } from 'antd'

function LeaderBoard(props){
    const columns = [
        {
            title:'Name',
            dataIndex:'name',
            key:'name',
        },
        {
            title:'Score',
            dataIndex:'score',
            key:'score',
        }
    ]
    return(
        <div>
            <div className="head">
                <button className="button3" onClick={props.onClick}>Return</button>
            </div>
            <div className="leaderboard">
                <h1>LeaderBoard</h1>
                <Table dataSource={props.data} columns={columns}></Table>
            </div>
        </div>
    );
}

export default LeaderBoard;