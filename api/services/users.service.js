const dbConnect = require("./dbConnect");
const mongoose = require("mongoose");
const User = require('../models/User')
const File = require('../models/File')

async function save(user){
    await dbConnect()

    const collection = mongoose.model('users')

    const username = 'user' + new Date().getTime()

    const result =  await collection.create({
        email: user.email,
        password: user.password,
        username: username,
        role: 'user'
    })
    return result
}

async function getAllUsers() {
    await dbConnect()

    const collection = mongoose.model('users')

    const users = collection.find({})
    return users
}

async function getUserByEmailAndPassword(user) {
    await dbConnect()
    const collection = mongoose.model('users')

    const doc = collection.findOne({email: user.email, password: user.password})
    return doc
}

async function getUserById(_id, isAdmin) {
    await dbConnect()
    const collection = mongoose.model('users')
    let user = await collection.findOne({_id: _id})

    if (isAdmin) {
        user = await collection.findOne({_id: _id}).populate({path: 'files', model: File})
    } else {
        user = await collection.findOne({_id: _id}, {password: 0, email: 0}).populate({path: 'files', model: File})
    }
    return user
}

async function updateUser (user) {
    await dbConnect()
    const collection = mongoose.model('users')
    const doc = await collection.findOne({_id: user._id})

    doc['username'] = user.username
    doc['name'] = user.name
    doc['birthday'] = user.birthday
    doc['about'] = user.about
    doc['files'] = user.files
    doc['avatar'] = user.avatar

    await doc.save()
    return doc
}

async function getUserByEmail(email) {
    await dbConnect()
    const collection = mongoose.model('users')
    const user = await collection.findOne({email: email})
    return user
}

async function getUsersByQuery({query}) {

    const now = new Date(Date.now())
    let from = query.maxAge ? new Date().setFullYear(now.getFullYear() - parseInt(query.maxAge)) : new Date().setFullYear(1920)
    let to = query.minAge ? new Date().setFullYear(now.getFullYear() - parseInt(query.minAge)) : new Date()

    from = from - 1000 * 60 * 60 * 24 * 365 - 1000

    await dbConnect();
    const collection = mongoose.model('users');

    const users = await collection.find({
        $and: [
            {about: new RegExp(decodeURI(query.about), "i")},
            {name: new RegExp(decodeURI(query.name), "i")},
            {birthday: {$gte: new Date(from).toISOString(), $lte: new Date(to).toISOString()}}
        ]
    });
    return users
}

module.exports = {save, getAllUsers, getUserByEmailAndPassword, getUserById, updateUser, getUserByEmail, getUsersByQuery}