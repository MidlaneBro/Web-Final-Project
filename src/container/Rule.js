function Rule(props){
    return(
        <div>
            <div className="head">
                <button className="button3" onClick={props.onClickReturn}>Return</button>
            </div>
            <div>
               <h1>規則:</h1>
               <h1>上下左右鍵移動，蛇的頭撞到邊界, 自己,敵人和灰色方塊時遊戲結束。</h1>
               <h1>道具:</h1>
               <h1>紅色方塊: 分數+1, 長度+1</h1>
               <h1>         出現率最高，但吃到的時候同時會產生碰到即死的灰色方塊</h1>
               <h1>藍色方塊: 分數+10, 長度+1</h1>
               <h1>白色方塊: 分數+1, 長度+5</h1>
               <h1>紫色方塊: 分數+1, 長度-2</h1>
            </div>
        </div>
    )
}

export default Rule;