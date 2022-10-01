//here we are recieving the function which we exported from homControoler.js file and storing it in a new variable named homeController. Note that you can name this variable anything
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const homeController = require('../app/http/controllers/homeController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')

//middlewares
const guest = require("../app/http/middleware/guest")
const auth = require("../app/http/middleware/auth")
const admin = require("../app/http/middleware/admin")


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

    app.post('/logout', authController().logout)

    app.get('/cart', cartController().index)

    app.post('/update-cart', cartController().update)

    //Customer Routes
    app.post('/orders', auth, orderController().store) 
    app.get('/customers/orders', auth, orderController().index)

    //For single order route
    //colon(:) shows id is dynamic i.e. different for different order
    app.get('/customers/orders/:id', auth, orderController().show)

    //Admin routes
    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)


}

module.exports = initRoutes