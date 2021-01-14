const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LeaderBoardSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required.']
    },
    mode: {
        type: String,
        required: [true, 'Mode field is required.']
    },
    score: {
        type: Number,
        required: [true,'Score field is required.']
    }
});

const LeaderBoard = mongoose.model('LeaderBoard', LeaderBoardSchema);

module.exports = LeaderBoard;