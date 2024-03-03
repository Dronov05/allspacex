const express = require('express')
const multer = require('multer')
const router = express.Router()
const fs = require('fs')
const {getUserById, updateUser} = require("../services/users.service");
const {saveFile, getFileById, deleteFileById} = require("../services/files.service");
const {getAdById, updateAd} = require("../services/ads.service");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        const extension = /[^.]+$/.exec(file.originalname)
        const path = "./uploads"
        fs.mkdirSync(path, {recursive: true})
        cb(null, Date.now() + Math.floor(Math.random() + 100000) + '.' + extension)
    }
})

const upload = multer({
    storage: storage
})

router.post("/upload", upload.single("file"), async (req, res) => {

    try {
        const _id = req.session.user._id
        const me = await getUserById(_id)

        const uploadedFile = await saveFile("/" + req.file.path, me, req.body.type)

        switch (req.body.type) {
            case 'user':
                me['files'] = me.files ? me.files.push(uploadedFile) : [uploadedFile]
                me['avatar'] = uploadedFile
                await updateUser(me)
                break
            case 'ad' :
                const ad = await getAdById(req.body.id)
                ad.images.push(uploadedFile)
                await updateAd({ad})
                break
        }

        res.json({ok: true, _id: uploadedFile._id})
    } catch (e) {
        console.error(e)
        res.status(401).end()
    }
})

router.get("/id/:id", async (req, res) => {
    const file = await getFileById(req.params.id)
    res.sendFile(file.path, {root: process.cwd()})
})

router.post("/delete/id/:id", async (req, res) => {

    try {
        const _id = req.session.user._id
        const me = await getUserById(_id)

        if (me.avatar != null && (me.avatar._id.toString() === req.params.id)) {
            me['avatar'] = null
        }

        me.files.pull({_id: req.params.id})

        await updateUser(me)

        const file = await getFileById(req.params.id)
        if (file) {
            fs.unlinkSync(process.cwd() + file.path)
            await deleteFileById(req.params.id)
        }
        res.json({ok: true})
    } catch (e) {
        console.error(e)
        res.json({ok: false, message: e})

    }
})

module.exports = router