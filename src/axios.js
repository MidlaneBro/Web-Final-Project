import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000' });


const switchToSingle = async () => {
    const {data} = await instance.get('/single_player');
    return data;
}

const sendsinglescore = async (name,score) => {
    const {data} = await instance.post('/single_player',{name:name,score:score})
    return data;
}

const switchToRule = async () => {
    const {data} = await instance.get('/rule');
    return data;
}

const switchToLeaderboard = async () => {
    const {data} = await instance.get('/leaderboard');
    return data;
}

const switchToAuthor = async () => {
    const {data} = await instance.get('/author');
    return data;
}

const backToLobby = async () => {
    const {data} = await instance.get('/');
    return data;
}

export { switchToSingle, sendsinglescore, switchToRule, switchToLeaderboard, switchToAuthor, backToLobby };