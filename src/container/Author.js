function Author(props){
    return(
        <div>
            <div className="head">
                <button className="button3" onClick={props.onClickReturn}>Return</button>
            </div>
            <div>
               <h1>B06901017 電機四 鐘民憲</h1>
               <h1>B06505006 工海四 陳奕舟</h1>
            </div>
        </div>
    )
}

export default Author;