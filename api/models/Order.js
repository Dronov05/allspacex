const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    customer: {
        type: String,
        require: true
    },
    hidden: {
        type: Boolean,
        require: true,
        default: false
    },
    ad: {
        type: Schema.Types.ObjectId, ref: 'Ad'
    }
}, {autoCreate: true})

const Order = mongoose.model('orders', schema)
module.exports = Order