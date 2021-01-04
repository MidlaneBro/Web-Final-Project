//import "./Single.css"
import React, { useState, useEffect, Component } from 'react';
import webSocket from 'socket.io-client'

function Multiple(props) {
    const [px,setPx] = useState(25) //position-x
    const [py,setPy] = useState(12) //position-y
    const [gs,setGs] = useState(20) //grid size
    const [tcx,setTcx] = useState(50) //tile-count-x
    const [tcy,setTcy] = useState(25) //tile-count-y
    const [ax,setAx] = useState(15) //apple-x
    const [ay,setAy] = useState(15) //apple-y
    const [xv,setXv] = useState(0) //x-velocity
    const [yv,setYv] = useState(0) //y-velocity
    const [trail,setTrail] = useState([]) //[{x,y},{x,y},...]
    const [tail,setTail] = useState(5) //length of snake
    const [score,setScore] = useState(0)
    const [ws,setWs] = useState(null)
    var id = null;
    

    const connectWebSocket = () => {
        //開啟
        setWs(webSocket('http://localhost:4000'))
    }

    useEffect(()=>{
        if(ws){
            //連線成功在 console 中打印訊息
            console.log('success connect!')
            //設定監聽
            initWebSocket()
        }
        id = setInterval(()=>game(),1000/10);
        document.addEventListener("keydown",e=>keyPush(e));
        return clearInterval(this.id);
    },[ws])



    const game = () => {
        const ctx = refs.canvas.getContext("2d");
        setPx(px+xv);
        setPy(py+yv);
        if(px<0){//hit left wall
            endgame();
        }
        if(px>tcx-1){//hit right wall
            endgame();
        }
        if(py<0){//hit upper wall
            endgame();
        }
        if(py>tcy-1){//hit bottom wall
            endgame();
        }
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,1000,500);
        ctx.fillStyle = "lime"
        for(let i=0;i<trail.length;i++){//plot the snake according to trail
            ctx.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
            if(trail[i].x === px && trail[i].y === py){//player hits himself
                if(xv === 0 && yv === 0){
                    setTail(5);
                    setScore(0);
                    setPx(25);
                    setPy(12);
                    setXv(0);
                    setYv(0)
                }
                else{
                    endgame();
                }
            }
        }
        setTrail([...trail, {x:px,y:py}]) //simple value
        while(trail.length>tail){//shorten the snake(end the game)
            var array = [...this.state.trail]; // make a separate copy of the array
            array.splice(0,1);
            this.setState({trail: array});
        }
        if(this.state.ax === this.state.px && this.state.ay === this.state.py){//eat an apple
            this.setState({
                ax:Math.floor(Math.random()*this.state.tcx),
                ay:Math.floor(Math.random()*this.state.tcy),
                tail:this.state.tail + 1,
                score:this.state.score + 1
            });
        }
        ctx.fillStyle = "red";
        ctx.fillRect(this.state.ax*this.state.gs,this.state.ay*this.state.gs,this.state.gs-2,this.state.gs-2);
    }

    const endgame = () =>{
        var name = window.prompt("Type your name to record your score on the leaderboard");
        if(name){
            //let msg = sendsinglescore(name,this.state.score);
            //console.log(msg);
        }
        this.setState({tail:5, score:0, px:25, py:12, xv:0, yv:0});
    }

    const keyPush = (evt) =>{
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
}export default Multiple;


