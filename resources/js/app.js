//server pe request bhejni h jab hum click kare cart ke uppr, uske liye we are using ajax call, for that we are using a library axios
//ye node_modules folder se import ho rhi h
import axios from 'axios'

//for notification tag we are using noty
import Noty from 'noty'

//to import the admin.js module
import {initAdmin} from './admin'

import moment from 'moment'

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

//Remove alert message after x seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}



// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);


//------------------- Socket ka client side ka kaam--------
//layout.ejs->lineNo.55

let socket = io();

// // Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}

//-----------------------------ADMIN-REALTIME------------------------------------------
// For admin page, first we have to identify if we are on admin page or not
let adminAreaPath = window.location.pathname;
// console.log(adminAreaPath)
if(adminAreaPath.includes('admin')){
    //call admin.js file
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}



socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})












