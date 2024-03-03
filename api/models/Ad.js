 const mongoose = require('mongoose')
 const Schema = mongoose.Schema

 const schema = new Schema({
     title: {
         type: String,
         require: true
     },
     text: {
         type: String
     },
     category: {
         type: String
     },
     published: {
         type: Boolean
     },
     price: {
         type: Number
     },
     images: [{
         type: Schema.Types.ObjectId,
         ref: 'File'
     }],
     user: {
         type: Schema.Types.ObjectId,
         ref: 'User'
     }
 }, {autoCreate: true})

 const Ad = mongoose.model('ads', schema)
 module.exports = Ad