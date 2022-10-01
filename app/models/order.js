const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema =new Schema({
    
    customerId:{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true    
    },

    items:{
    type: Object, 
    required: true
}
    ,
    
    phone:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        default: 'Cash On Delivery'
    },
    status: {
        type: String,
        default: 'Order_placed'
    }

    //for admin or customer role
}, { timestamps: true})
//Database ke andar user name ka collection create ho jayega
// const Menu = mongoose.model('Menu', menuSchema)
// module.exports = eMnu

//instead of the above two lines you can write this single line, bcoz we are using user only once
module.exports = mongoose.model('Order', orderSchema)