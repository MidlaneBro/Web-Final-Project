import "./Single.css"


const ctx = this.refs.canvas.getContext("2d");
document.addEventListener("keydown",keyPush);
setInterval(game,1000/15);

var px=10;
var py=10;
var gs=20;
var tc=20;
var ax=15;
var ay=15;
var xv=0;
var yv=0;
var trail=[];
var tail=5;
function game(){
    px+=xv;
    py+=yv;
    if(px<0){
        px=tc-1;
    }
    if(px>tc-1){
        px=0
    }
    if(py<0){
        py = tc-1;
    }
    if(py>tc-1){
        py=0;
    }
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,400,400);
    ctx.fillStyle = "lime"
    for(var i=0;i<trail.length;i++){
        ctx.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
        if(trail[i].x == px,trail[i].y ==py){
            tail = 5;
        }
    }
    trail.push({x:px,y:py});
    while(trail.length>tail){
        trail.shift();
    }
    if(ax==px && ay==py){
        tail++;
        ax = Math.floor(Math.random()*tc);
        ay = Math.floor(Math.random()*tc);
    }
    ctx.fillRect(0,0,400,400);
}
function keyPush(evt){
    switch(evt.keyCode){
        case 37:
            xv=-1;yv=0;
            break;
        case 38:
            xv=0;yv=-1;
            break;
        case 39:
            xv=1;yv=0;
            break;
        case 40:
            xv=0;yv=1;
            break;
    }
}

function Single(props){
    return(
        <div>
            <div className="head">
                <button className="button3" onClick={props.onClickReturn}>Return</button>
            </div>
            <div>
                <canvas ref="canvas" width = {400} height = {400}></canvas>
            </div>
            <div>
                <h1>point:</h1>
            </div>
        </div>
    )
}

export default Single;


//state = {
        px:10,
        py:10,
        gs:20,
        tc:20,
        ax:15,
        ay:15,
        xv:0,
        yv:0,
        trail:[],
        tail:5
    }


//import "./Single.css"
import React, { Component } from 'react';
class Single extends Component {
    state = {
        px:10,
        py:10,
        gs:20,
        tc:20,
        ax:15,
        ay:15,
        xv:0,
        yv:0,
        trail:[],
        tail:5
    }
    game = () => {
        const ctx = this.refs.canvas.getContext("2d");
        this.setState({px:this.state.px + this.state.xv,
                       py:this.state.py + this.state.yv});
        if(this.state.px<0){
            this.setState({px:this.state.tc-1});
        }
        if(this.state.px>this.state.tc-1){
           this.setState({px:0});
        }
        if(this.state.py<0){
            this.setState({py:this.state.tc-1});
        }
        if(this.state.py>this.state.tc-1){
            this.setState({py:0});
        }
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,400,400);
        ctx.fillStyle = "lime"
        for(var i=0;i<this.state.trail.length;i++){
            ctx.fillRect(this.state.trail[i].x*this.state.gs,this.state.trail[i].y*this.state.gs,this.state.gs-2,this.state.gs-2);
            if(this.state.trail[i].x == this.state.px,this.state.trail[i].y == this.state.py){
                tail = 5;
                this.setState({tail:5});
            }
        }
        trail.push({x:px,y:py});
        while(trail.length>tail){
            trail.shift();
        }
        if(ax==px && ay==py){
            tail++;
            ax = Math.floor(Math.random()*tc);
            ay = Math.floor(Math.random()*tc);
        }
        ctx.fillRect(0,0,400,400);
    }
    keyPush = (evt) =>{
        switch(evt.keyCode){
            case 37:
                xv=-1;yv=0;
                break;
            case 38:
                xv=0;yv=-1;
                break;
            case 39:
                xv=1;yv=0;
                break;
            case 40:
                xv=0;yv=1;
                break;
        }
    }
    draw = () => {
        const ctx = this.refs.canvas.getContext("2d");
        document.addEventListener("keydown",keyPush);
        setInterval(game,1000/15);
    }
    componentDidMount() {
        setInterval(() => {
        this.game();
        this.draw();
      }, 1000 / 15);
    }
    render() {
        return (
            <div>
                <div className="head">
                    <button className="button3" onClick={this.props.onClickReturn}>Return</button>
                </div>
                <div>
                    <canvas ref="canvas" width = {400} height = {400}></canvas>
                </div>
                <div>
                    <h1>point:</h1>
                </div>
            </div>
        );
    }
}export default Single;


