const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema =new Schema({
    name: { type: String, required:true},
    image: { type: String, required:true},
    price: { type: Number, required:true},
    size: { type: String, required:true},
})
//Database ke andar menu name ka collection create ho jayega
// const Menu = mongoose.model('Menu', menuSchema)
// module.exports = Menu

//instead of the above two lines you can write this single line, bcoz we are using menu only once
module.exports = mongoose.model('Menu', menuSchema)