const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    path: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String
    }
}, {autoCreate: true})

const File = mongoose.model('files', schema)
module.exports = File