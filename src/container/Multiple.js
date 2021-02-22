import React, { Component } from 'react';
import loading from "../img/loading.gif";
import {sendmultiplescore} from '../axios';
import {Button} from 'antd';

class Multiple extends Component {
    constructor(props){
        super(props)
        this.state = {
            score:0,
            score_r:0
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.game!==this.props.game && this.props.game!==null){
            const ctx = this.refs.canvas.getContext("2d");
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,1000,500);
            ctx.fillStyle = "lime";
            for(let i=0;i<this.props.game.snake1.trail.length;i++){//plot the snake1 according to trail
                ctx.fillRect(this.props.game.snake1.trail[i].x*this.props.game.other.gs, this.props.game.snake1.trail[i].y*this.props.game.other.gs, this.props.game.other.gs-2, this.props.game.other.gs-2);
            }
            ctx.fillStyle = "orange";
            for(let i=0;i<this.props.game.snake2.trail.length;i++){//plot the snake2 according to trail
                ctx.fillRect(this.props.game.snake2.trail[i].x*this.props.game.other.gs, this.props.game.snake2.trail[i].y*this.props.game.other.gs, this.props.game.other.gs-2, this.props.game.other.gs-2);
            }
            ctx.fillStyle = "red";
            for(let i=0;i<this.props.game.other.apple.length;i++){
                ctx.fillRect(this.props.game.other.apple[i].x*this.props.game.other.gs, this.props.game.other.apple[i].y*this.props.game.other.gs, this.props.game.other.gs-2, this.props.game.other.gs-2);
            }
            for(let i=0;i<this.props.game.other.tool.length;i++){
                switch(this.props.game.other.tool[i].type){
                    case 0: //point
                        ctx.fillStyle = "yellow";
                        break;
                    case 1: //grow
                        ctx.fillStyle = "green";
                        break;
                    case 2: //molt
                        ctx.fillStyle = "purple";
                        break;
                    /*case 3: //speed-up
                        ctx.fillStyle = "aqua";
                        break;
                    case 4: //speed-down
                        ctx.fillStyle = "white";
                        break; */
                    case 3: //return
                        ctx.fillStyle = "blue";
                        break;
                    default:
                        break;
                }
                ctx.fillRect(this.props.game.other.tool[i].x*this.props.game.other.gs, this.props.game.other.tool[i].y*this.props.game.other.gs, this.props.game.other.gs-2, this.props.game.other.gs-2);
            }
            ctx.fillStyle = "gray";
            for(let i=0;i<this.props.game.other.gray.length;i++){
                ctx.fillRect(this.props.game.other.gray[i].x*this.props.game.other.gs,this.props.game.other.gray[i].y*this.props.game.other.gs,this.props.game.other.gs-2,this.props.game.other.gs-2);
            }
            this.setState({score:this.props.game.snake1.score,score_r:this.props.game.snake2.score});
        }
        if(prevProps.status!==this.props.status && this.props.status==='end'){
            if(this.props.data.length<10 || this.state.score>this.props.data[9].score){
                let name = window.prompt("Congratulation, you are ranked Top 10. Type your name to save record on leaderboard!");
                if(name){
                    let msg = sendmultiplescore(name,this.state.score);
                    console.log(msg);
                }
            }
        }
    }

    componentDidMount(){
        document.addEventListener("keydown",e=>this.keyPush(e));
    }

    keyPush = (evt) => {
        this.props.client.send(JSON.stringify([this.props.uuid,evt.keyCode]));
    }

    render() {
        return (
            <div>
                <div className="head">
                    <button className="button3" onClick={this.props.onClickReturn}>Return</button>
                </div>
                <div>
                    {this.props.status==="wait"? <img src={loading} alt="loading"/>:<canvas ref="canvas" width={1000} height={500}></canvas>}
                </div>
                <div>
                    {this.props.status==="wait"? <h1>Waiting for another player...</h1>:<h1>Your Score:{this.state.score}&nbsp;&nbsp;&nbsp;&nbsp;Opponent's Score:{this.state.score_r}</h1>}
                </div>
                <div className="control">
                    <Button type="primary" shape="round" onClick={()=>this.keyPush({keyCode:37})}>&#8592;</Button>
                    <Button type="primary" shape="round" onClick={()=>this.keyPush({keyCode:39})}>&#8594;</Button>
                </div>
                <div className="control2">
                <Button type="primary" shape="round" onClick={()=>this.keyPush({keyCode:38})}>&#8593;</Button>
                <br></br>
                <Button type="primary" shape="round" onClick={()=>this.keyPush({keyCode:40})}>&#8595;</Button>
                </div>
            </div>
        );
    }
}

export default Multiple;