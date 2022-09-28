//here we are recieving the function which we exported from homControoler.js file and storing it in a new variable named homeController. Note that you can name this variable anything
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const homeController = require('../app/http/controllers/homeController')
const guest = require("../app/http/middleware/guest")

function initRoutes(app){
    //we will call the above factory function object which has method index 
    //homeController().index 
    app.get('/', homeController().index)

    //Second parameter of above get method
    // (req, res) => {
    //     res.render('home')
    // }
    
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)

    
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)

    // app.post('/logout', authController().logout)

    app.get('/cart', cartController().index)

    app.post('/update-cart', cartController().update)
}

module.exports = initRoutes