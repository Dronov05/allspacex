const express = require('express')
const {getUserById} = require("../services/users.service");
const {saveAd, getAdById, updateAd, getAdsByUserId, deleteAdById, getAds} = require("../services/ads.service");
const router = express.Router()

router.get("/id/:id", async (req, res) => {

    const ad = await getAdById(req.params.id)

    if (!ad) {
        res.status(404).end()
        return
    }

    const userId = req.session.user._id

    if (!ad.published && ad.user._id.toString() !== userId) {
        res.status(404).end()
        return
    }
    res.json({ok: true, ad})
})

router.get("/id/:id/contact", async (req, res) => {

    const ad = await getAdById(req.params.id)

    if (!ad) {
        res.status(404).end()
        return
    }

    const userId = ad.user._id

    const user = await getUserById(userId,true)
    res.json({ok: true, email: user.email})
})

router.get("/category/:category", async (req, res) => {
    const skip = req.query.skip ? req.query.skip : 0
    const ads = await getAds(skip, req.params.category)
    res.json({ok: true, ads: ads})
})

router.get("/my", async (req, res) => {
    if (!req.session.user) {
        res.status(401).end()
        return
    }

    const _id = req.session.user._id
    const user = await getUserById(_id)
    const ads = await getAdsByUserId(user._id)

    res.json({ok: true, ads: ads})
})

router.post("/save", async (req, res) => {
    if (!req.session.user) {
        res.status(401).end()
        return
    }

    const _id = req.session.user._id
    const user = await getUserById(_id)
    const ad = await saveAd(req.body, user)

    res.json({ok: true, ad: ad})
})

router.post("/update", async (req, res) => {
    if (!req.session.user) {
        res.status(401).end()
        return
    }

    const _id = req.session.user._id
    let ad = await getAdById(req.body._id)

    if (!ad) {
        res.status(404).end()
        return
    }

    if (_id !== ad.user._id.toString()) {
        res.status(403).end()
        return
    }

    ad = req.body

    await updateAd({ad})
    res.json({ok: true})

})

router.post("/delete", async (req, res) => {
    if (!req.session.user) {
        res.status(401).end()
        return
    }

    const _id = req.session.user._id
    const user = await getUserById(_id)
    let ad = await getAdById(req.body._id)

    if (ad.user._id.toString() === user._id.toString()) {
        await deleteAdById(ad._id)
        res.json({ok: true})
    } else {
        res.json({ok: false})
    }
})

module.exports = router