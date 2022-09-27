//to fetch the data we need module, ye menu module jo humne menu.js me banaya tha
const Menu = require('../../models/menu')
function homeController(){
    //Factory function which returns an object
    return{
        //object: key, index key me function store ho jayega
        index(req, res){
            
            //yaha pe database ki sari item fetch karenge fir render method me pass karenge jisse wo sara data display kar paye
            Menu.find().then(function(pizzas){
                // console.log(pizzas)
                res.render('home', {pizzas: pizzas})
            })
            
        }

        //  another method to fetch the data is:
        // index(req,res){
            // const pizzas = await Menu.find()
            // return res.render('home', {pizzas: pizzas})
        }
         

    }

//we are exporting a function
//whenever we will call this function it will return the above object
//we will import this function in web.js
module.exports = homeController