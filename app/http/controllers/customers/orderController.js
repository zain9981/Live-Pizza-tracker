const Order = require('../../../models/order')
const moment = require('moment')

function orderController(){
        return{
        store(req, res){
            // console.log(req.body)

            //Validate request
            const{phone, address}=req.body
            if(!phone || !address){
                req.flash('error', "Please input all the fields")
                return res.redirect('/cart')
            }
            
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: phone,
                address: address
            })
            order.save().then(result => {
                Order.populate(result, {path: 'customerId'}, (err, placedOrder)=>{
                    req.flash('success',  "Order placed successfully")
                delete req.session.cart

                //--------------------------------------------------
                //Emit event here from admin.js->lineNo.83 and then after we will emit this on socket on server.js

                const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', result)

                return res.redirect('/customers/orders')
                })
                
            }).catch(err=>{
                req.flash('error', "Something went wrong")
                return res.redirect('/cart')
            })
        },
        async index(req, res){
                                              //key: value
            const orders = await Order.find({ customerId: req.user._id },
                null,
                {sort:{'createdAt': -1}})
                res.header('Cache-Control', 'no-store')
            res.render('customers/orders', {orders: orders, moment: moment})
            // console.log(orders)
        },
        async show(req,res){
            const order = await Order.findById(req.params.id)
            
            //Authorise user
            if(req.user._id.toString() === order.customerId.toString()){
              return res.render('customers/singleOrder', { order: order })
            }
            else{
                return res.redirect('/')
            }
        }
    }
}


module.exports = orderController