import React, { Component } from 'react';

let ws = new WebSocket('ws://localhost:4000')
class Multiple extends Component {
    constructor(props){
        super(props)
        this.state = {
            px:25, //position-x
            py:12, //position-y
            gs:20, //grid size
            tcx:50, //tile-count-x
            tcy:25, //tile-count-y
            ax:15, //apple-x
            ay:15, //apple-y
            xv:0, //x-velocity
            yv:0, //y-velocity
            trail:[], //[{x,y},{x,y},...]
            tail:5, //length of snake
            score:0,
            
            r_px:25, //position-x
            r_py:12, //position-y
            r_xv:0, //x-velocity
            r_yv:0, //y-velocity
            r_trail:[], //[{x,y},{x,y},...]
            r_tail:5, //length of snake
            r_score:0,

        }
        this.id = null;
    }

    game = () => {
        const ctx = this.refs.canvas.getContext("2d");
        this.setState({
            px:this.state.px + this.state.xv,
            py:this.state.py + this.state.yv,
            r_px:this.state.r_px + this.state.r_xv,
            r_py:this.state.r_py + this.state.r_yv
        });
        if(this.state.px<0){//hit left wall
            //this.endgame();
            this.setState({px:this.state.tcx-1})
        }
        if(this.state.px>this.state.tcx-1){//hit right wall
            //this.endgame();
        }
        if(this.state.py<0){//hit upper wall
            //this.endgame();
        }
        if(this.state.py>this.state.tcy-1){//hit bottom wall
            //this.endgame();
        }
        if(this.state.r_px<0){//hit left wall
            //this.endgame();
            this.setState({r_px:this.state.tcx-1})
        }
        if(this.state.r_px>this.state.tcx-1){//hit right wall
            //this.endgame();
        }
        if(this.state.r_py<0){//hit upper wall
            //this.endgame();
        }
        if(this.state.r_py>this.state.tcy-1){//hit bottom wall
            //this.endgame();
        }
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,1000,500);
        ctx.fillStyle = "lime"
        for(let i=0;i<this.state.trail.length;i++){//plot the snake according to trail
            ctx.fillRect(this.state.trail[i].x*this.state.gs,this.state.trail[i].y*this.state.gs,this.state.gs-2,this.state.gs-2);
            if(this.state.trail[i].x === this.state.px && this.state.trail[i].y === this.state.py){//player hits himself
                if(this.state.xv === 0 && this.state.yv === 0){
                    this.setState({tail:5, score:0, px:25, py:12, xv:0, yv:0});
                }
                else{
                    //this.endgame();
                }
            }
        }
        this.setState({ trail: [...this.state.trail, {x:this.state.px,y:this.state.py}] }) //simple value
        while(this.state.trail.length>this.state.tail){//shorten the snake(end the game)
            let array = [...this.state.trail]; // make a separate copy of the array
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
        //player2
        ctx.fillStyle = "orange"
        for(let i=0;i<this.state.r_trail.length;i++){//plot the snake according to trail
            ctx.fillRect(this.state.r_trail[i].x*this.state.gs,this.state.r_trail[i].y*this.state.gs,this.state.gs-2,this.state.gs-2);
            if(this.state.r_trail[i].x === this.state.r_px && this.state.r_trail[i].y === this.state.r_py){//player hits himself
                if(this.state.r_xv === 0 && this.state.r_yv === 0){
                    this.setState({r_tail:5, r_score:0, r_px:25, r_py:12, r_xv:0, r_yv:0});
                }
                else{
                    //this.endgame();
                }
            }
        }
        this.setState({ r_trail: [...this.state.r_trail, {x:this.state.r_px,y:this.state.r_py}] }) //simple value
        while(this.state.r_trail.length>this.state.r_tail){//shorten the snake(end the game)
            let array = [...this.state.r_trail]; // make a separate copy of the array
            array.splice(0,1);
            this.setState({r_trail: array});
        }
        if(this.state.r_ax === this.state.r_px && this.state.r_ay === this.state.r_py){//eat an apple
            this.setState({
                ax:Math.floor(Math.random()*this.state.tcx),
                ay:Math.floor(Math.random()*this.state.tcy),
                r_tail:this.state.r_tail + 1,
                r_score:this.state.r_score + 1
            });
        }

        ctx.fillStyle = "red";
        ctx.fillRect(this.state.ax*this.state.gs,this.state.ay*this.state.gs,this.state.gs-2,this.state.gs-2);
    }

    endgame(){
        var name = window.prompt("Type your name to record your score on the leaderboard");
        if(name){
            //let msg = sendsinglescore(name,this.state.score);
            //console.log(msg);
        }
        this.setState({tail:5, score:0, px:25, py:12, xv:0, yv:0});
    }

    keyPush = (evt) =>{
    	//socket.emit('move',evt);
        ws.send(evt.keyCode);
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
        this.id = setInterval(()=>this.game(),1000/10);

        document.addEventListener("keydown",e=>this.keyPush(e));



        //開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
        ws.onopen = () => {
            console.log('open connection')
        }

        //關閉後執行的動作，指定一個 function 會在連結中斷後執行
        ws.onclose = () => {
            console.log('close connection')
        }

        ws.onmessage = event => {
            console.log(event);
            /*var key = event.data
            switch(parseInt(key)){
                    case 37: //left arrow
                        if(this.state.r_xv !== 1)
                            this.setState({r_xv:-1,r_yv:0})
                        break;
                    case 38: //up arrow
                        if(this.state.r_yv !== 1)
                            this.setState({r_xv:0,r_yv:-1})
                        break;
                    case 39: //right arrow
                        if(this.state.r_xv !== -1)
                            this.setState({r_xv:1,r_yv:0})
                        break;
                    case 40: //down arrow
                        if(this.state.r_yv !== -1)
                            this.setState({r_xv:0,r_yv:1})
                        break;
                    default:
                        console.log(key)
                        break;
                }*/
        }

    }

    componentWillUnmount() {
        clearInterval(this.id);
        //socket.off("move");
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


