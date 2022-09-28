const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema =new Schema({
    name: { type: String, required:true},
    //database me unique email hona chaiye
    email: { type: String, required:true, unique: true},
    password: { type: String, required:true},
    role: { type: String, default: 'customer'} //for admin or customer role
}, { timestamps: true})
//Database ke andar user name ka collection create ho jayega
// const Menu = mongoose.model('Menu', menuSchema)
// module.exports = eMnu

//instead of the above two lines you can write this single line, bcoz we are using user only once
module.exports = mongoose.model('User', userSchema)