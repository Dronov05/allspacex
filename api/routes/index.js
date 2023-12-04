const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.send('Я корневой роут backend(index route)')
})

module.exports = router