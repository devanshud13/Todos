const mongoose = require('mongoose');


const todoSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    marked: {
        type: Boolean,
        default: false
    },
    avtar: {
        type: String,
        required: true
    }
});

const TodoData = mongoose.model("Todo", todoSchema);

module.exports = TodoData;