import React, { Component } from 'react';
import loading from "../img/loading.gif";

class Multiple extends Component {
    constructor(props){
        super(props)
        this.state = {
            score:0
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
            ctx.fillRect(this.props.game.other.ax*this.props.game.other.gs, this.props.game.other.ay*this.props.game.other.gs, this.props.game.other.gs-2, this.props.game.other.gs-2);
            this.setState({score:this.props.game.snake1.score})
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
                    {this.props.status==="start"? <canvas ref="canvas" width={1000} height={500}></canvas>:<img src={loading} alt="loading"/>}
                </div>
                <div>
                    {this.props.status==="start"? <h1>Score:{this.state.score}</h1>:<h1>Waiting for another player...</h1>}
                </div>
            </div>
        );
    }
}

export default Multiple;