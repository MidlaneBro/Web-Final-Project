import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000' });


const sendsinglescore = async (name,score) => {
    const {data} = await instance.post('/single_player',{name:name,score:score})
    return data;
}

const sendmultiplescore = async (name,score) => {
    const {data} = await instance.post('/multiple_player',{name:name,score:score});
    return data;
}

const switchToLeaderboard = async () => {
    const {data} = await instance.get('/leaderboard');
    return data;
}

export { sendsinglescore, sendmultiplescore, switchToLeaderboard };