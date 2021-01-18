import developer1 from '../img/Developer1.jpg';
import developer2 from '../img/Developer2.jpg';

function Author(props){
    return(
        <div>
            <div className="head">
                <button className="button3" onClick={props.onClickReturn}>Return</button>
            </div>
            <div className="title">
                <h1>Developer</h1>
            </div>
            <div className="author-body">
                <div className="author-left">
                    <div>
                        <img src={developer1} width="300" alt="鐘民憲"/>
                    </div>
                    <div>
                        <h1>鐘民憲</h1>
                        <h1>Min-Hsien, Chung</h1>
                        <h1>台大電機四 B06901017</h1>
                        <p>題目發想、規則設計、整體網頁設計</p>
                        <p>單人模式改良、多人模式前後端</p>
                        <p>記分板前後端、製作規則及此頁面</p>
                    </div>
                </div>
                <div className="author-right">
                    <div>
                        <img src={developer2} width="300" height="370" alt="陳逼舟"/>
                    </div>
                    <div>
                        <h1>陳奕舟</h1>
                        <h1>台大工海四 B06505006</h1>
                        <p>單人模式主程式、協助後端開發</p>
                        <p>單人模式改良、協助網頁設計</p>
                    </div>
                </div>
            </div>
            <div>
            </div>
        </div>
    )
}

export default Author;