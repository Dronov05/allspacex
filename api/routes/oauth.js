const express = require('express')
const router = express.Router()
const axios = require('axios')
const {google} = require('googleapis')
const {getUserByEmail, save} = require("../services/users.service");
const User = require('../models/User')

const oauth2Client = new google.auth.OAuth2(
    "164069531650-4umfpkt99mv3cb5pfvsb85pper5tdh0i.apps.googleusercontent.com",
    "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",
    "https://api.allspacex.ru/oauth/google/redirect"
)

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
]

router.get('/google', (req, res) => {

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    })
    res.redirect(url)
})

router.get('/google/redirect', async (req, res) => {

    const code = req.query.code

    const {tokens} = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const responce = await axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + tokens.access_token, 'Content-Type': 'application/json'}
    })

    let user = responce.data

    const foundUser = await getUserByEmail(user.email)
    let _id

    if (foundUser) {
        _id = foundUser._id
    } else {
        const newUser = new User({
            email: user.email,
            password: btoa(new Date())
            }
        )

        const savedUser =  await save(newUser)
        _id = savedUser._id
    }

    req.session.user = {_id: _id}
    await req.session.save()

    res.redirect('https://allspacex.ru/dashboard')
})

module.exports = router