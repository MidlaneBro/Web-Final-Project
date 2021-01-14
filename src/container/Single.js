import React, { Component } from 'react';
import {sendsinglescore} from '../axios';

class Single extends Component {
    constructor(props){
        super(props)
        this.state = {
            px:25, //position-x
            py:12, //position-y
            xv:0, //x-velocity
            yv:0, //y-velocity
            trail:[], //[{x,y},{x,y},...]
            tail:5, //length of snake
            score:0,
            gs:20, //grid size
            tcx:50, //tile-count-x
            tcy:25, //tile-count-y
            apple:[
                {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
                {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
                {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)}
            ],
            tool:[
                {type:5,x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
                {type:5,x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
            ],//type:0->point,1->grow,2->shrink,3->speed-up,4->speed-down,5->return
            gray:[],
            return:false
        }
        this.id = null;
        this.speed = 10;
    }

    occupied = (x,y) => { //check whether the tile is occupied by trail, apple or gray
        for(let i=0;i<this.state.trail.length;i++){
            if(x===this.state.trail[i].x && y===this.state.trail[i].y){
                return true;
            }
        }
        for(let i=0;i<this.state.apple.length;i++){
            if(x===this.state.apple[i].x && y===this.state.apple[i].y){
                return true;
            }
        }
        for(let i=0;i<this.state.tool.length;i++){
            if(x===this.state.tool[i].x && y===this.state.tool[i].y){
                return true;
            }
        }
        for(let i=0;i<this.state.gray.length;i++){
            if(x===this.state.gray[i].x && y===this.state.gray[i].y){
                return true;
            }
        }
        return false;
    }

    game = () => {
        console.log(this.state)
        const ctx = this.refs.canvas.getContext("2d");
        this.setState({
            px:this.state.px + this.state.xv,
            py:this.state.py + this.state.yv
        });
        if(this.state.px<0){//hit left wall
            this.endgame();
        }
        if(this.state.px>this.state.tcx-1){//hit right wall
            this.endgame();
        }
        if(this.state.py<0){//hit upper wall
            this.endgame();
        }
        if(this.state.py>this.state.tcy-1){//hit bottom wall
            this.endgame();
        }
        for(let i=0;i<this.state.trail.length;i++){//snake hit itself?
            if(this.state.trail[i].x === this.state.px && this.state.trail[i].y === this.state.py ){
                if(this.state.xv === 0 && this.state.yv === 0){
                    this.setState({tail:5, score:0, px:25, py:12, xv:0, yv:0});
                }
                else{
                    this.endgame();
                }
            }
        }
        for(let i=0;i<this.state.gray.length;i++){//snake hit gray
            if(this.state.px === this.state.gray[i].x && this.state.py === this.state.gray[i].y)
                this.endgame();
        }
        this.setState({ trail: [...this.state.trail, {x:this.state.px,y:this.state.py}] }) //extend trail
        while(this.state.trail.length>this.state.tail){//slice the snake to fit length
            let array = this.state.trail;
            array.splice(0,1);
            this.setState({trail:array});
        }
        for(let i=0;i<this.state.apple.length;i++){//eat an apple
            if(this.state.px === this.state.apple[i].x && this.state.py === this.state.apple[i].y){
                let apple_x = Math.floor(Math.random()*this.state.tcx);
                let apple_y = Math.floor(Math.random()*this.state.tcy);
                while(this.occupied(apple_x,apple_y)){
                    apple_x = Math.floor(Math.random()*this.state.tcx);
                    apple_y = Math.floor(Math.random()*this.state.tcy);
                }
                let array = this.state.apple;
                array[i].x = apple_x;
                array[i].y = apple_y;
                this.setState({
                    apple:array,
                    tail: this.state.tail + 1,
                    score: this.state.score + 1
                })
                break;
            }
        }
        for(let i=0;i<this.state.tool.length;i++){//eat an tool
            if(this.state.px === this.state.tool[i].x && this.state.py === this.state.tool[i].y){
                switch (this.state.tool[i].type) {
                    case 0: //point
                        this.setState({
                            score:this.state.score + 5
                        })
                        break;
                    case 1: //grow
                        this.setState({
                            tail:this.state.tail + 10,
                            score:this.state.score + 3
                        });
                        break;
                    case 2: //molt
                        for(let i=0;i<this.state.trail.length-1;i++){
                            this.setState({
                                gray:[...this.state.gray,{x:this.state.trail[i].x,y:this.state.trail[i].y}]
                            });
                        }
                        this.setState({
                            tail:1,
                            score:this.state.score + 3
                        });
                        break;
                    case 3: //speed-up
                        this.speed += 1;
                        clearInterval(this.id);
                        this.id = setInterval(this.game,1000/this.speed);
                        this.setState({
                            score:this.state.score + 3
                        });
                        break;
                    case 4: //speed-down
                        this.speed = this.speed>1? this.speed-1 : this.speed;
                        clearInterval(this.id);
                        this.id = setInterval(this.game,1000/this.speed);
                        break;
                    case 5: //return
                        this.setState({
                            return: true,
                            score: this.state.score + 3
                        })
                        break;
                    default:
                        break;
                }
                let tool_x = Math.floor(Math.random()*this.state.tcx);
                let tool_y = Math.floor(Math.random()*this.state.tcy);
                while(this.occupied(tool_x,tool_y)){
                    tool_x = Math.floor(Math.random()*this.state.tcx);
                    tool_y = Math.floor(Math.random()*this.state.tcy);
                }
                let array = this.state.tool;
                array[i].type = Math.floor(Math.random()*6);
                //array[i].type = 5;
                array[i].x = tool_x;
                array[i].y = tool_y;
                this.setState({tool:array});
                let gray_x = Math.floor(Math.random()*this.state.tcx);
                let gray_y = Math.floor(Math.random()*this.state.tcy);
                while(this.occupied(gray_x,gray_y)){
                    gray_x = Math.floor(Math.random()*this.state.tcx);
                    gray_y = Math.floor(Math.random()*this.state.tcy);
                }
                this.setState({gray: [...this.state.gray, {x:gray_x,y:gray_y}]});
                break;
            }
        }
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,this.state.gs*this.state.tcx,this.state.gs*this.state.tcy);
        ctx.fillStyle = "lime";
        for(let i=0;i<this.state.trail.length;i++){
            ctx.fillRect(this.state.trail[i].x*this.state.gs,this.state.trail[i].y*this.state.gs,this.state.gs-2,this.state.gs-2);
        }
        ctx.fillStyle = "red";
        for(let i=0;i<this.state.apple.length;i++){
            ctx.fillRect(this.state.apple[i].x*this.state.gs,this.state.apple[i].y*this.state.gs,this.state.gs-2,this.state.gs-2);
        }
        for(let i=0;i<this.state.tool.length;i++){
            switch (this.state.tool[i].type) {
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
            ctx.fillRect(this.state.tool[i].x*this.state.gs,this.state.tool[i].y*this.state.gs,this.state.gs-2,this.state.gs-2);
        }
        ctx.fillStyle = "gray";
        for(let i=0;i<this.state.gray.length;i++){
            ctx.fillRect(this.state.gray[i].x*this.state.gs,this.state.gray[i].y*this.state.gs,this.state.gs-2,this.state.gs-2);
        }
    }

    endgame(){
        let name = window.prompt("Type your name to record your score on the leaderboard");
        if(name){
            let msg = sendsinglescore(name,this.state.score);
            console.log(msg);
        }
        this.setState({
            tail:5,
            score:0,
            px:25,
            py:12,
            xv:0,
            yv:0,
            apple:[
                {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
                {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
                {x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)}
            ],
            tool:[
                {type:Math.floor(Math.random()*6),x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
                {type:Math.floor(Math.random()*6),x:Math.floor(Math.random()*50),y:Math.floor(Math.random()*25)},
            ],
            gray:[]
        });
        this.speed = 10;
        clearInterval(this.id);
        this.id = setInterval(this.game,1000/this.speed);
    }

    keyPush = (evt) =>{
        switch(evt.keyCode){
            case 37: //left arrow
                if(this.state.xv !== 1)
                    this.setState({xv:-1,yv:0})
                break;
            case 38: //up arrow
                if(this.state.yv !== 1)
                    this.setState({xv:0,yv:-1})
                break;
            case 39: //right arrow
                if(this.state.xv !== -1)
                    this.setState({xv:1,yv:0})
                break;
            case 40: //down arrow
                if(this.state.yv !== -1)
                    this.setState({xv:0,yv:1})
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