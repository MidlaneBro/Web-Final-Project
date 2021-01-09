import React from 'react';

class LeaderBoard extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        console.log(this.props.msg);
    }
    
    render(){
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
}

export default LeaderBoard;