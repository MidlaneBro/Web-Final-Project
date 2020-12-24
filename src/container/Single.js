import "./Single.css"
import React, { Component, useRef } from 'react';

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
                //this.setState({tail:5});
            }
        }
        this.setState({ trail: [...this.state.trail, {x:this.state.px,y:this.state.py}] }) //simple value
        while(this.state.trail.length>this.state.tail){
            var array = [...this.state.trail]; // make a separate copy of the array
                array.splice(0,1);
                this.setState({trail: array});
        }
        if(this.state.ax==this.state.px && this.state.ay==this.state.py){
            this.setState({ax:Math.floor(Math.random()*this.state.tc),
                           ay:Math.floor(Math.random()*this.state.tc),
                           tail:this.state.tail + 1});
        }
        ctx.fillStyle = "red";
        ctx.fillRect(this.state.ax*this.state.gs,this.state.ay*this.state.gs,this.state.gs-2,this.state.gs-2);
    }
    keyPush = (evt) =>{
        switch(evt.keyCode){
            case 37:
                this.setState({xv:-1,yv:0})
                break;
            case 38:
                this.setState({xv:0,yv:-1})
                break;
            case 39:
                this.setState({xv:1,yv:0})
                break;
            case 40:
                this.setState({xv:0,yv:1})
                break;
        }
    }

    componentDidMount() {
        setInterval(() => {this.game()}, 1000 / 15);
        document.addEventListener("keydown",e=>this.keyPush(e));
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


