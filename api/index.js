require('dotenv').config()
const express = require('express')
const app = express()
const port = 9001
const cors = require('cors')
const logger = require('morgan')
const sessions = require('express-session')
const MongoStore = require('connect-mongo')

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://allspacex.ru']
}))

let mongoUrl

if (process.env.NODE_ENV === 'development') {
    mongoUrl = "mongodb://admn01:" + process.env.MONGO_DEV_PASSWORD + "@localhost:27017/allspacexru?authSource=allspacexru"
} else {
    mongoUrl = "mongodb://admn01:" + process.env.MONGO_PRODUCTION_PASSWORD + "@localhost:27017/allspacexru?authSource=allspacexru"
}

app.use(sessions({
    secret: "thisismvtyrrcwkeyfhrqfgrfrty84fwir767",
    store: MongoStore.create({
        mongoUrl: mongoUrl,
        ttl: 60 * 24 * 60 * 60,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30,},
}))

const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")
const allRouter = require("./routes/all")
const oauthRouter = require("./routes/oauth")
const filesRouter = require("./routes/files")

app.use(logger('dev'))
app.use(express.json())
app.use("*", allRouter)
app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/oauth", oauthRouter)
app.use("/files", filesRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})