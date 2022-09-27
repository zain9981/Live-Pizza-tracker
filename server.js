require('dotenv').config()

const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose = require("mongoose");
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)



//  database connection with mongoose
 mongoose.connect("mongodb://localhost/pizza", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("connection successful"))
    .catch((err) => console.log(err));

//Session store
let mongoStore = new MongoDbStore({
    host: '127.0.0.1',
    port: '27017',
    collection: 'sessions',
    url: 'mongodb://localhost:27017/pizza'
})

//Session Configuration
app.use(session({
    //session cookies ke bina kaam nhi karte
    //to encrypt the cookies, for that we have secret key
    //we will store the session in our database so that server restart hone se humara session flush nhi hoga
    //by default sessions memory me store hote h
    secret: process.env.COOKIE_SECRET,
    resave: false,
    //store above session
    store:  mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60*24} //jo bhi cookie humari create ho jayegi session ki wo 24hrs tak valid rahegi
    // cookie: { maxAge: 1000*60*60}
}))


app.use(flash())
//Assets
app.use(express.static('public'))
app.use(express.json())

//Global middleware
app.use((req, res, next)=>{
    res.locals.session = req.session
    next()
})

//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app) 


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})





























































