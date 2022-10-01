//to import order model table to fetch data (status and id)
const Order = require('../../../models/order')

function statusController(){
    return{
        update(req, res){
            //Logic code
                             //this orderId is the name attribute which we defined in resources->js->admin.js
                Order.updateOne({_id: req.body.orderId}, {status: req.body.status}, (err, data)=>{
                    if(err){
                        req.flash('error', 'Something went wrong')
                        return res.redirect('/admin/orders')
                    }

                    //--------------EMIT EVENT-----------------------
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderUpdated', {id: req.body.orderId, status: req.body.status})
                    return res.redirect('/admin/orders')
            })
        }
    }
}

module.exports = statusController