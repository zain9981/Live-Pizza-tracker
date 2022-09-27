//server pe request bhejni h jab hum click kare cart ke uppr, uske liye we are using ajax call, for that we are using a library axios
//ye node_modules folder se import ho rhi h
import axios from 'axios'

//for notification tag we are using noty
import Noty from 'noty'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza){
    axios.post('/update-cart', pizza).then(res=>{
        console.log(res)
        cartCounter.innerText = res.data.totalQty;

        new Noty({
            type: 'info',
            timeout: 1000, //milisecond
            progressBar: false,
            text: "Item added to cart"
          }).show();
    }).catch(err=>{
        new Noty({
            type: 'error',
            timeout: 1000, //milisecond
            progressBar: false,
            text: "Something went wrong"
          }).show();
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click', (e) =>{
        //first we converted the object into string in home.ejs file line no.28
        // let pizza = btn.dataset.pizza 
        //now again we have to convert this string into object
        //we are doing this by using ejs

        let pizza = JSON.parse(btn.dataset.pizza )

        updateCart(pizza)
        // console.log(pizza)
    })
})
