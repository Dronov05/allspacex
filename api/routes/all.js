const express = require('express')
const router = express.Router()

router.all("*", (req, res, next) => {

    const domain = process.env.NODE_ENV === 'development' ? process.env.DEV_HOST : process.env.PROD_HOST // Для удалённого сервера
    // const domain = process.env.NODE_ENV === 'development' ? process.env.PROD_HOST : process.env.DEV_HOST // Для локального сервера

    res.setHeader('Access-Control-Allow-Origin', domain)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
})

module.exports = router