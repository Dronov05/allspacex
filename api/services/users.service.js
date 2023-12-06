const dbConnect = require("./dbConnect");
const mongoose = require("mongoose");
const User = require('../models/User')

async function save(user){
    await dbConnect()

    const collection = mongoose.model('users')

    const username = 'user' + new Date().getTime()

    await collection.create({
        email: user.email,
        password: user.password,
        username: username,
        role: 'admin'
    })
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

async function getUserById(_id) {
    await dbConnect()
    const collection = mongoose.model('users')
    const user = await collection.findOne({_id: _id})
    return user
}

async function updateUser (user) {
    await dbConnect()
    const collection = mongoose.model('users')
    const doc = await collection.findOne({_id: user._id})

    doc['username'] = user.username

    await doc.save()
    return doc
}


module.exports = {save, getAllUsers, getUserByEmailAndPassword, getUserById, updateUser}