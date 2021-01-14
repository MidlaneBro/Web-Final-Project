import React, { Component } from 'react';
import loading from "../img/loading.gif";
import {sendmultiplescore} from '../axios';

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
                    case 3: //speed-up
                        ctx.fillStyle = "aqua";
                        break;
                    case 4: //speed-down
                        ctx.fillStyle = "white";
                        break; 
                    case 5: //return
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
            let name = window.prompt("Type your name to record your score on the leaderboard");
            if(name){
                let msg = sendmultiplescore(name,this.state.score);
                console.log(msg);
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
            </div>
        );
    }
}

export default Multiple;