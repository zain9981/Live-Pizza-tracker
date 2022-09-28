const passport = require('passport')
const User = require('../../models/user')
const bcrypt = require('bcrypt')
function authController(){
    //Factory function which returns an object
    return{

        //object: key, login key me function store ho jayega
        login(req, res){
            res.render('auth/login')
        },
        postLogin(req, res, next){
            const {email, password } = req.body
            //for line no.9 in passport.js, info is same parameter for done

            //validate request
            if(!email || !password){
                req.flash('error', 'Please enter all the fields')                   
                return res.redirect('/login')
            }

            passport.authenticate('local', (err, user, info)=>{
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err)=>{
                    if(err){
                    req.flash('error', info.message)
                    return next(err)
                    }
                    return res.redirect('/')
                })
            })(req,res,next)
        },


        register(req, res){
            res.render('auth/register')
        },
        //asynch is used for await in hash passsword line no.35
        async postRegister(req,res){
            const { name, email, password } = req.body
            //validate request
            if(!name || !email || !password){
                req.flash('error', 'Please enter all the fields')
                req.flash('name', name)
                req.flash('email', email)                
                return res.redirect('/register')
            }

        //check if email exists
        User.exists({ email :email }, (err,result)=>{
            if(result){
                req.flash('error', 'Email already exists')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register') 
            }
        })

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        //Create a user
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        })

        user.save().then((user)=>{
            //Login

            //if registration is successful we will redirect user to home page
            return res.redirect('/')
        }).catch(err =>{
            req.flash('error', 'Something went wrong')
            return res.redirect('/register')
        })
            // console.log(req.body)

        },
        logout(req, res, next) {
            req.logout(function(err) {
              if (err) { return next(err); }
              res.redirect('/login');
            });
          }
    }
}
//we are exporting a function
//whenever we will call this function it will return the above object
//we will import this function in web.js
module.exports = authController