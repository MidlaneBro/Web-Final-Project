import "./Single.css"

function Single(props){
    return(
        <div>
            <div className="head">
                <button className="button3" onClick={props.onClickReturn}>Return</button>
            </div>
            <div>
                <canvas></canvas>
            </div>
            <div>
                <h1>point:</h1>
            </div>
        </div>
    )
}

export default Single;