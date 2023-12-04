const mongoose = require("mongoose")

async function dbConnect() {

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.db
    }

    let url = "mongodb://localhost:27017/allspacexru"
    let options = {
        user: "admn01",
        // pass: "q1w2e3r4t5y6",
        pass: process.env.NODE_ENV === 'development' ? process.env.MONGO_DEV_PASSWORD : process.env.MONGO_PRODUCTION_PASSWORD,
        auth: {authSource: "allspacexru"}
    }

    // return  mongoose.connect (url, options, (e) => {
    //      console.error(e)
    // })
    return mongoose.connect(url, options)
        .catch(err => console.error(err))
}

module.exports = dbConnect