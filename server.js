require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose = require("mongoose")
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')
const Emitter = require('events')


//  database connection with mongoose
const url = process.env.MONGO_CONNECTIO_URL
 mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("connection successful"))
    .catch((err) => console.log(err))



//Session store
let mongoStore = new MongoDbStore({
    host: '127.0.0.1',
    port: '27017',
    collection: 'sessions',
    url: 'mongodb://localhost:27017/pizza'
})

//-----------------------EVENT EMITTER TO SEND MESSAGE OF UPDATION TO SOCKET FOR THE ROOM WE CREATED AND RECIEVE THE UPDATION ON CLIENT SIDE------------------------------
//import event module on line no.13👆
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


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

//passport config
//for this we will keep the code in different file and then import it here: app/config/passport.js
// const passportInit = require('./app/config/passport')
//we will call the function passport from line no.13
const passportInit = require('./app/config/passport')
const { resolve } = require('path')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

//to display messages on front end when request is sent for eg. error msgs
app.use(flash())
//Assets
app.use(express.static('public'))
//for url encoded data to call register link on the server which is on authController
app.use(express.urlencoded ({extended: false}))
app.use(express.json())

//Global middleware
app.use((req, res, next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app) 
app.use((req,res)=>{
    res.status(404).send('<h1>404, Page not found</h2>')
})

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

//----------------------SOCKET------------------------------

const io = require('socket.io')(server)
io.on('connection', (socket)=>{
    //join 
    // console.log(socket.id)
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })
})


eventEmitter.on('orderUpdated', (data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated', data)
    
})


//-------listen orderPlaced from customers->orderController->lineNo.29
eventEmitter.on('orderPlaced', (data)=>{
    io.to('adminRoom').emit('orderPlaced', data)
})





















































