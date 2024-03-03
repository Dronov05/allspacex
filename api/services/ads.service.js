const dbConnect = require("./dbConnect");
const Ad = require("../models/Ad");
const mongoose = require("mongoose");
const File = require("../models/File");
const {deleteFileById} = require("./files.service");


async function getAds(skip, category){
    let limit = 2
    await dbConnect()
    const collection = mongoose.model('ads')
    let ads
    if (category === 'all') {
        ads = await collection.find({published: true}).skip(skip).limit(limit)
    } else {
        ads = await collection.find({published: true, category: category}).skip(skip).limit(limit)
    }
    return ads
}

async function getAdById(_id){
    await dbConnect()
    const collection = mongoose.model('ads')
    const ad = await collection.findOne({_id: _id}).populate({path: 'images', model: File})
    return ad
}

async function getAdsByUserId(_id){
    await dbConnect()
    const collection = mongoose.model('ads')
    const ads = await collection.find({user: _id})
    return ads
}

async function saveAd(ad, user) {
    await dbConnect()
    const doc = new Ad({
        title: ad.title,
        text: "...",
        category: ad.category,
        published: ad.published,
        price: ad.price,
        images: ad.images,
        user: user
    })
    return await doc.save()
}

async function updateAd({ad}) {
    await dbConnect()
    const collection = mongoose.model('ads')
    const doc = await collection.findOne({_id: ad._id})

    doc['title'] = ad.title
    doc['text'] = ad.text
    doc['category'] = ad.category
    doc['published'] = ad.published
    doc['price'] = ad.price
    doc['images'] = ad.images
    doc['user'] = ad.user

    await doc.save()
    return doc
}

async function deleteAdById(_id) {
    await dbConnect()
    const collection = mongoose.model('ads')
    const ad = await getAdById({_id: _id})
    const images = ad.images
    images.forEach(img => {
        deleteFileById(img._id)
    })
    await collection.deleteOne({_id: _id})
}

module.exports = {getAds, getAdById, getAdsByUserId, saveAd, updateAd, deleteAdById}