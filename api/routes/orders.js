const express = require('express')
const {getAdById} = require("../services/ads.service");
const {saveOrder, getVisibleOrders, updateOrder} = require("../services/orders.service");
const {getUserById} = require("../services/users.service");
const router = express.Router()

router.get('/', async (req, res) => {
    res.json({ok: true})
})

router.get('/get/all', async (req, res) => {
    res.json({ok: true})
})

router.get('/get/visible', async (req, res) => {

    try {
        const _id = req.session.user._id
        const me = await getUserById(_id)
        if (me.role === 'admin') {
            const orders =  await getVisibleOrders()
            res.json({ok: true, orders}).end()
            return
        }
        res.json({ok: false})
    } catch (e) {
        res.json({ok: false})
    }

    res.json({ok: false})
})

router.post('/save', async (req, res) => {

    const body = req.body
    const ad = await getAdById(body.ad._id)
    await saveOrder(body.customer, ad)

    res.json({ok: true})
})

router.post('/hide', async (req, res) => {

    const item = req.body
    await updateOrder(item)

    res.json({ok: true})
})

module.exports = router