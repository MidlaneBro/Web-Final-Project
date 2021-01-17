import React, { Component } from 'react';
import {sendsinglescore} from '../axios';

class Single extends Component {
    constructor(props){
        super(props);
        this.px = 25; //position-x
        this.py = 12; //position-y
        this.xv = 0; //x-velocity
        this.yv = 0; //y-velocity
        this.trail = []; //[{x,y},{x,y},...]
        this.tail = 5; //length of snake
        this.state = { score:0 };
        this.gs = 20; //grid size
        this.tcx = 50; //tile-count-x
        this.tcy = 25; //tile-count-y
        this.apple = [
            {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
            {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
            {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)}
        ];
        this.count = 0;//when count%3===0, generate 1 tool
        this.tool = [];//type:0->point,1->grow,2->shrink,3->speed-up,4->speed-down,5->return
        this.gray = [];
        this.id = null;
        this.speed = 10;
    }

    occupied = (x,y) => { //check whether the tile is occupied by trail, apple or gray
        for(let i=0;i<this.trail.length;i++){
            if(x===this.trail[i].x && y===this.trail[i].y){
                return true;
            }
        }
        if(x===this.px+this.xv && y===this.py+this.yv){
            return true;
        }
        for(let i=0;i<this.apple.length;i++){
            if(x===this.apple[i].x && y===this.apple[i].y){
                return true;
            }
        }
        for(let i=0;i<this.tool.length;i++){
            if(x===this.tool[i].x && y===this.tool[i].y){
                return true;
            }
        }
        for(let i=0;i<this.gray.length;i++){
            if(x===this.gray[i].x && y===this.gray[i].y){
                return true;
            }
        }
        return false;
    }

    game = () => {
        const ctx = this.refs.canvas.getContext("2d");
        this.px = this.px + this.xv;
        this.py = this.py + this.yv;
        if(this.px<0){//hit left wall
            this.endgame();
        }
        if(this.px>this.tcx-1){//hit right wall
            this.endgame();
        }
        if(this.py<0){//hit upper wall
            this.endgame();
        }
        if(this.py>this.tcy-1){//hit bottom wall
            this.endgame();
        }
        for(let i=0;i<this.trail.length;i++){//snake hit itself?
            if(this.trail[i].x === this.px && this.trail[i].y === this.py ){
                if(this.xv!==0 || this.yv!==0){
                    this.endgame();
                }
            }
        }
        for(let i=0;i<this.gray.length;i++){//snake hit gray
            if(this.px === this.gray[i].x && this.py === this.gray[i].y)
                this.endgame();
        }
        this.trail = [...this.trail, {x:this.px,y:this.py}];//extend trail
        while(this.trail.length>this.tail){//slice the snake to fit length
            this.trail.splice(0,1);
        }
        for(let i=0;i<this.apple.length;i++){//eat an apple
            if(this.px === this.apple[i].x && this.py === this.apple[i].y){
                this.tail += 1;
                this.setState({score: this.state.score + 1});
                this.count += 1;
                let apple_x = Math.floor(Math.random()*this.tcx);
                let apple_y = Math.floor(Math.random()*this.tcy);
                while(this.occupied(apple_x,apple_y)){
                    apple_x = Math.floor(Math.random()*this.tcx);
                    apple_y = Math.floor(Math.random()*this.tcy);
                }
                this.apple[i].x = apple_x;
                this.apple[i].y = apple_y;
                if(this.count%3===0){
                    let tool_x = Math.floor(Math.random()*this.tcx);
                    let tool_y = Math.floor(Math.random()*this.tcy);
                    while(this.occupied(tool_x,tool_y)){
                        tool_x = Math.floor(Math.random()*this.tcx);
                        tool_y = Math.floor(Math.random()*this.tcy);
                    }
                    this.tool = [...this.tool,{type:Math.floor(Math.random()*6),x:tool_x,y:tool_y}];
                }
                let gray_x = Math.floor(Math.random()*this.tcx);
                let gray_y = Math.floor(Math.random()*this.tcy);
                while(this.occupied(gray_x,gray_y)){
                    gray_x = Math.floor(Math.random()*this.tcx);
                    gray_y = Math.floor(Math.random()*this.tcy);
                }
                this.gray = [...this.gray, {x:gray_x,y:gray_y}];
                break;
            }
        }
        for(let i=0;i<this.tool.length;i++){//eat an tool
            if(this.px === this.tool[i].x && this.py === this.tool[i].y){
                switch (this.tool[i].type) {
                    case 0: //point
                        this.setState({score:this.state.score + 5})
                        break;
                    case 1: //grow
                        this.tail += 10;
                        this.setState({score:this.state.score + 3});
                        break;
                    case 2: //molt
                        for(let i=0;i<this.trail.length-1;i++){
                            this.gray = [...this.gray,{x:this.trail[i].x,y:this.trail[i].y}];
                        }
                        this.tail = 1;
                        this.setState({score:this.state.score + 3});
                        break;
                    case 3: //speed-up
                        this.speed *= 1.2;
                        clearInterval(this.id);
                        this.id = setInterval(this.game,1000/this.speed);
                        this.setState({
                            score:this.state.score + 3
                        });
                        break;
                    case 4: //speed-down
                        this.speed /= 1.2;
                        clearInterval(this.id);
                        this.id = setInterval(this.game,1000/this.speed);
                        break;
                    case 5: //return
                        this.px = this.trail[0].x;
                        this.py = this.trail[0].y;
                        if(this.trail.length===1){
                            this.xv = -this.xv;
                            this.yv = -this.yv;
                        }
                        else{
                            this.xv = this.trail[0].x - this.trail[1].x;
                            this.yv = this.trail[0].y - this.trail[1].y;
                        }
                        this.trail = this.trail.reverse();
                        this.setState({score: this.state.score + 3})
                        break;
                    default:
                        break;
                }
                this.tool.splice(i,1);
                break;
            }
        }
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,this.gs*this.tcx,this.gs*this.tcy);
        ctx.fillStyle = "lime";
        for(let i=0;i<this.trail.length;i++){
            ctx.fillRect(this.trail[i].x*this.gs,this.trail[i].y*this.gs,this.gs-2,this.gs-2);
        }
        ctx.fillStyle = "red";
        for(let i=0;i<this.apple.length;i++){
            ctx.fillRect(this.apple[i].x*this.gs,this.apple[i].y*this.gs,this.gs-2,this.gs-2);
        }
        for(let i=0;i<this.tool.length;i++){
            switch (this.tool[i].type) {
                case 0: //point
                    ctx.fillStyle = "yellow";
                    break;
                case 1: //grow
                    ctx.fillStyle = "green";
                    break;
                case 2: //shrink
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
            ctx.fillRect(this.tool[i].x*this.gs,this.tool[i].y*this.gs,this.gs-2,this.gs-2);
        }
        ctx.fillStyle = "gray";
        for(let i=0;i<this.gray.length;i++){
            ctx.fillRect(this.gray[i].x*this.gs,this.gray[i].y*this.gs,this.gs-2,this.gs-2);
        }
    }

    endgame(){
        if(this.props.data.length<10 || this.state.score>this.props.data[9].score){
            let name = window.prompt("Congratulation, you are ranked Top 10. Type your name to save record on leaderboard!");
            if(name){
                let msg = sendsinglescore(name,this.state.score);
                console.log(msg);
            }
        }
        this.px = 25; //position-x
        this.py = 12; //position-y
        this.xv = 0; //x-velocity
        this.yv = 0; //y-velocity
        this.trail = []; //[{x,y},{x,y},...]
        this.tail = 5; //length of snake
        this.setState({score:0});
        this.apple = [
            {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
            {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
            {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)}
        ];
        this.count = 0;
        this.tool = [];//type:0->point,1->grow,2->shrink,3->speed-up,4->speed-down,5->return
        this.gray = [];
        this.speed = 10;
        clearInterval(this.id);
        this.id = setInterval(this.game,1000/this.speed);
    }

    keyPush = (evt) =>{
        switch(evt.keyCode){
            case 37: //left arrow
                if(this.trail.length===1 || (this.trail[this.trail.length-1].x - this.trail[this.trail.length-2].x !== 1)){
                    this.xv = -1;
                    this.yv = 0;
                }
                break;
            case 38: //up arrow
                if(this.trail.length===1 || (this.trail[this.trail.length-1].y - this.trail[this.trail.length-2].y !== 1)){
                    this.xv = 0;
                    this.yv = -1;
                }
                break;
            case 39: //right arrow
                if(this.trail.length===1 || (this.trail[this.trail.length-1].x - this.trail[this.trail.length-2].x !== -1)){
                    this.xv = 1;
                    this.yv = 0;
                }
                break;
            case 40: //down arrow
                if(this.trail.length===1 || (this.trail[this.trail.length-1].y - this.trail[this.trail.length-2].y !== -1)){
                    this.xv = 0;
                    this.yv = 1;
                }
                break;
            default:
                break;
        }
    }

    componentDidMount() {
        this.id = setInterval(this.game,1000/this.speed);
        document.addEventListener("keydown",e=>this.keyPush(e));
    }

    componentWillUnmount() {
        clearInterval(this.id);
    }

    render() {
        return (
            <div>
                <div className="head">
                    <button className="button3" onClick={this.props.onClickReturn}>Return</button>
                </div>
                <div>
                    <canvas ref="canvas" width={1000} height={500}></canvas>
                </div>
                <div>
                    <h1>Score:{this.state.score}</h1>
                </div>
            </div>
        );
    }
}

export default Single;