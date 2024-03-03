const dbConnect = require("./dbConnect");
const mongoose = require("mongoose");
const File = require('../models/File')

async function saveFile(path, user, type) {
    await dbConnect()
    const file = new File({
        path: path,
        user: user._id,
        type: type
    })
    return await file.save()
}

async function getFileById(_id) {
    await dbConnect()
    const collection = mongoose.model('files')
    return await collection.findOne({_id: _id})
}

async function deleteFileById(_id) {
    await dbConnect()
    const collection = mongoose.model('files')
    return await collection.deleteOne({_id: _id})
}

module.exports = {saveFile, getFileById, deleteFileById}