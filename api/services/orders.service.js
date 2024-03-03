const Order = require('../models/Order')
const Ad = require('../models/Ad')
const dbConnect = require('./dbConnect')
const mongoose = require('mongoose')

async function getOrderById(_id) {
    await dbConnect()
    const collection = mongoose.model('orders')
    const doc = await collection.findOne({_id: _id})
    return doc
}

async function saveOrder(customer, ad) {
    const order = new Order({
        customer: customer,
        ad: ad,
        hidden: false
    })
    await order.save()
}

async function updateOrder(item) {
    const order = await getOrderById(item._id)
    order['customer'] = item.customer
    order['hidden'] = item.hidden
    order['ad'] = item.ad
    await order.save()
}

async function getAllOrders() {

}

async function getVisibleOrders() {
    await dbConnect()
    const collection = mongoose.model('orders')
    const docs = await collection.find({hidden: false}).populate({path: 'ad', model: Ad})
    return docs
}

module.exports = {getOrderById, saveOrder, updateOrder, getAllOrders, getVisibleOrders}