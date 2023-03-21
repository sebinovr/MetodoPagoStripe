const express = require('express');
const Stripe = require('stripe');
const cors = require('cors')

//Variables de entorno configuracion
require('dotenv').config();

//Aplicación de BackEnd
const app = express();

//Llave privada - utilizar variable de entorno para Node.js
//Se crea Clase Stripe 
const stripe = new Stripe(process.env.PASSWORD)


//Conecta el FrontEnd con el BackEnd
app.use(cors({origin: 'http://localhost:3000'}))

//Convierte a formato JSON
app.use(express.json())

//Se crea API para ver {data} desde FrontEnd
app.post('/api/checkout', async (req, res)=> {

    try{
    //Se extrae desde respuesta que viene desde FrontEnd
    const {id, amount } = req.body

    //Me extrae objeto de informacion del pago desde FrontEnd
    const payment = await stripe.paymentIntents.create({
        amount,
        currency: "USD",
        description: "planta",
        payment_method: id,
        confirm: true


    })

    console.log(payment)
    res.send({message: 'Pago Exitoso'})

    } catch (error) {
        console.log(error)
        res.json({message: error.raw.message})
    }
})


app.listen(3001, () => {
    console.log('Server on port', 3001)
})

