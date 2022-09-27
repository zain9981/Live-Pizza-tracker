function authController(){
    //Factory function which returns an object
    return{
        //object: key, login key me function store ho jayega
        login(req, res){
            res.render('auth/login')
        },
        register(req, res){
            res.render('auth/register')
        }
    }
}
//we are exporting a function
//whenever we will call this function it will return the above object
//we will import this function in web.js
module.exports = authController