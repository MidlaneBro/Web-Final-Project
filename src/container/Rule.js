import keys from '../img/keys.gif';
import back from '../img/back.png';
import next from '../img/next.png';
import {useEffect, useRef, useState} from 'react';

function Rule(props){
    const [index, setindex] = useState(0);
    const canvasRef = useRef(null);

    let px = 20;
    let py = 12;
    let xv = 1;
    let yv = 0;
    let trail = [];
    let tail = 5;
    let gs = 20;
    let tcx = 50;
    let tcy = 25;
    let apple
    if(index===2){
        apple = [{x:30,y:12}];
    }
    else if(index===9){
        apple = [{x:30,y:12},{x:35,y:12},{x:40,y:12}];
    }
    else{
        apple = [];
    }
    let count = 0;
    let tool;
    if(index>=3 && index<=8){
        tool = [{type:index-3,x:30,y:12}];
    }
    else{
        tool = [];
    }
    let gray = [];
    let id = null;
    let speed = 10;

    const occupied = (x,y)=> { //check whether the tile is occupied by trail, apple or gray
        for(let i=0;i<trail.length;i++){
            if(x===trail[i].x && y===trail[i].y){
                return true;
            }
        }
        for(let i=0;i<apple.length;i++){
            if(x===apple[i].x && y===apple[i].y){
                return true;
            }
        }
        for(let i=0;i<tool.length;i++){
            if(x===tool[i].x && y===tool[i].y){
                return true;
            }
        }
        for(let i=0;i<gray.length;i++){
            if(x===gray[i].x && y===gray[i].y){
                return true;
            }
        }
        return false;
    }

    const game = (ctx) => {
        px = px + xv;
        py = py + yv;
        if(px<0 || px>tcx-1 || py<0 || py>tcy-1){
            endgame(ctx);
        }
        for(let i=0;i<trail.length;i++){
            if(trail[i].x === px && trail[i].y === py ){
                if(xv!==0 || yv!==0){
                    endgame(ctx);
                }
            }
        }
        for(let i=0;i<gray.length;i++){
            if(px === gray[i].x && py === gray[i].y){
                endgame(ctx);
            }
        }
        trail = [...trail, {x:px,y:py}];
        while(trail.length>tail){
            trail.splice(0,1);
        }
        for(let i=0;i<apple.length;i++){//eat an apple
            if(px === apple[i].x && py === apple[i].y){
                tail += 1;
                count += 1;
                let apple_x = Math.floor(Math.random()*tcx);
                let apple_y = Math.floor(Math.random()*tcy);
                while(occupied(apple_x,apple_y)){
                    apple_x = Math.floor(Math.random()*tcx);
                    apple_y = Math.floor(Math.random()*tcy);
                }
                apple[i].x = apple_x;
                apple[i].y = apple_y;
                if(count%3===0){
                    let tool_x = Math.floor(Math.random()*tcx);
                    let tool_y = Math.floor(Math.random()*tcy);
                    while(occupied(tool_x,tool_y)){
                        tool_x = Math.floor(Math.random()*tcx);
                        tool_y = Math.floor(Math.random()*tcy);
                    }
                    tool = [...tool,{type:Math.floor(Math.random()*6),x:tool_x,y:tool_y}];
                }
                let gray_x = Math.floor(Math.random()*tcx);
                let gray_y = Math.floor(Math.random()*tcy);
                while(occupied(gray_x,gray_y)){
                    gray_x = Math.floor(Math.random()*tcx);
                    gray_y = Math.floor(Math.random()*tcy);
                }
                gray = [...gray, {x:gray_x,y:gray_y}];
                break;
            }
        }
        for(let i=0;i<tool.length;i++){//eat an tool
            if(px === tool[i].x && py === tool[i].y){
                switch (tool[i].type) {
                    case 0: //point
                        break;
                    case 1: //grow
                        tail += 10;
                        break;
                    case 2: //molt
                        for(let i=0;i<trail.length-1;i++){
                            gray = [...gray,{x:trail[i].x,y:trail[i].y}];
                        }
                        tail = 1;
                        break;
                    case 3: //speed-up
                        speed *= 1.2;
                        clearInterval(id);
                        id = setInterval(()=>game(ctx),1000/speed);
                        break;
                    case 4: //speed-down
                        speed /= 1.2;
                        clearInterval(id);
                        id = setInterval(()=>game(ctx),1000/speed);
                        break;
                    case 5: //return
                        px = trail[0].x;
                        py = trail[0].y;
                        if(trail.length===1){
                            xv = -xv;
                            yv = -yv;
                        }
                        else{
                            xv = trail[0].x - trail[1].x;
                            yv = trail[0].y - trail[1].y;
                        }
                        trail = trail.reverse();
                        break;
                    default:
                        break;
                }
                tool.splice(i,1);
                break;
            }
        }
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,gs*tcx,gs*tcy);
        ctx.fillStyle = "lime";
        for(let i=0;i<trail.length;i++){
            ctx.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
        }
        ctx.fillStyle = "red";
        for(let i=0;i<apple.length;i++){
            ctx.fillRect(apple[i].x*gs,apple[i].y*gs,gs-2,gs-2);
        }
        for(let i=0;i<tool.length;i++){
            switch (tool[i].type) {
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
            ctx.fillRect(tool[i].x*gs,tool[i].y*gs,gs-2,gs-2);
        }
        ctx.fillStyle = "gray";
        for(let i=0;i<gray.length;i++){
            ctx.fillRect(gray[i].x*gs,gray[i].y*gs,gs-2,gs-2);
        }
    }

    const endgame = (ctx) => {
        px = 20;
        py = 12;
        xv = 1;
        trail = [];
        tail = 5;
        count = 0;
        if(index===2){
            apple = [{x:30,y:12}];
        }
        else if(index===9){
            apple = [{x:30,y:12},{x:35,y:12},{x:40,y:12}];
        }
        else{
            apple = [];
        }
        if(index>=3 && index<=8){
            tool = [{type:index-3,x:30,y:12}];
        }
        else{
            tool = [];
        }
        if(index===1 && gray.length===0){
            gray = [{x:30,y:12}];
        }
        else{
            gray = [];
        }
        speed = 10;
        clearInterval(id);
        id = setInterval(()=>game(ctx),1000/speed)
    }

    useEffect(()=>{
        if(index>0 && index<10){
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0,0,1000,500);
            // eslint-disable-next-line
            id = setInterval(()=>game(ctx),1000/speed);
        }
        return ()=>clearInterval(id);
    },[index])

    useEffect(()=>{
        const keyPush = evt => {
            switch (evt.keyCode) {
                case 37:
                    setindex(index===0? 0:index-1);
                    break;
                case 39:
                    setindex(index===10? 10:index+1);
                    break;
                default:
                    break;
            }
        }
        document.addEventListener("keydown",keyPush);
        return ()=>document.removeEventListener("keydown",keyPush);
    })

    return(
        <div>
            <div className="head">
                <button className="button3" onClick={props.onClickReturn}>Return</button>
            </div>
            <div className="title">
                <h1>Rule</h1>
            </div>
            <div className="image-viewer__container">
                <button className="image-viewer__button" onClick={()=>setindex(index===0? 0:index-1)}><img src={back} id="prev" alt="back" className={index===0? "disabled":""}/></button>
                {index===0? 
                <div>
                    <img src={keys} height="500px" alt="arrow keys"/>
                    <h1>Control with arrow keys.</h1>
                </div>: index===1?
                <div>
                    <canvas ref={canvasRef} width={1000} height={500}></canvas>
                    <h1>Game over when snake hits border, itself, and gray tile(obstacle).</h1>
                </div>: index===2?
                <div>
                    <canvas ref={canvasRef} width={1000} height={500}></canvas>
                    <h1>Red point tile: score+1, length+1, generate a red tile and a obstacle.</h1>
                </div>: index===3?
                <div>
                    <canvas ref={canvasRef} width={1000} height={500}></canvas>
                    <h1>Yellow tool tile(Bonus): score+5, length+0.</h1>
                </div>: index===4?
                <div>
                    <canvas ref={canvasRef} width={1000} height={500}></canvas>
                    <h1>Green tool tile(Grow): score+3, length+10.</h1>
                </div>: index===5?
                <div>
                    <canvas ref={canvasRef} width={1000} height={500}></canvas>
                    <h1>Purple tool tile(Molt): score+3, length=1, snake bodies become obstacle.</h1>
                </div>: index===6?
                <div>
                    <canvas ref={canvasRef} width={1000} height={500}></canvas>
                    <h1>Aqua tool tile(Speed-up): score+3, length+0, speed*1.2.(Single mode only)</h1>
                </div>: index===7?
                <div>
                    <canvas ref={canvasRef} width={1000} height={500}></canvas>
                    <h1>White tool tile(Speed-down): score+0, length+0, speed/1.2.(Single mode only)</h1>
                </div>: index===8?
                <div>
                    <canvas ref={canvasRef} width={1000} height={500}></canvas>
                    <h1>Blue tool tile(Return): score+3, length+0, direction reverse.</h1>
                </div>: index===9?
                <div>
                    <canvas ref={canvasRef} width={1000} height={500}></canvas>
                    <h1>Initially three points on the field, a tool appears when three points are eaten.</h1>
                </div>:
                <div className="rule">
                    <h1>For multiple player mode:</h1>
                    <h1>1.The system will create room and match you with an opponent.</h1>
                    <h1>2.Game over when you bump into another snake's body</h1>
                    <h1>3.Both player die when the snakes' head bump into each other.</h1>
                    <h1>4.The dead snake will become obstacles.</h1>
                    <h1>For leaderboard:</h1>
                    <h1>When you are ranked Top 10 of either single mode or multiple mode,</h1>
                    <h1>you can record your score on the leaderboard.</h1>
                </div>}
                <button className="image-viewer__button" onClick={()=>setindex(index===10? 10:index+1)}><img src={next} id="next" alt="next" className={index===10? "disabled":""}/></button>
            </div>
        </div>
    )
}

export default Rule;