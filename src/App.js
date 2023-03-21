import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

//Estilos bootswatch
import "bootswatch/dist/lux/bootstrap.min.css"
import './App.css'

//clave desde Stripe - public
const stripePromise = loadStripe("pk_test_51MnoUeJ7yUZjpqzGkGLYeAlsFTDqVd41W339xKyG9W8gApNFJmrgQtBDah7zxfIX010Xhccq0OXpj8BeHSVVaM8O00HStUanyh")


//componente para utilizar en funcion App
const CheckoutForm = () => {

  //Crea conexion a Stripe
  const stripe = useStripe();

  //Selecciona elemento de pago
  const elements = useElements()

  //Para habilitar boton de pago
  const [loading, setLoading] = useState(false)

  //Enviar datos a Stripe
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Crea elementos de pago - puede generarse error o paymentMethod
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    })

    //habilita boton si no hay problemas
    setLoading(true)

    if (!error) {
      //Se extrae Id
      const {id} = paymentMethod;

      try {
        //Si no hay error se envia pago por Amount
        const {data} = await axios.post('http://localhost:3001/api/checkout', {
          id,
          amount: 10*1000
        })

        console.log(data)
        //Limpia campos de tarjeta
        elements.getElement(CardElement).clear();
      
      } catch (error) {
        console.log(error)
      }
      
      //Deshabilita boton posterior a uso de pago
      setLoading(false)
    }

  }

  return(
    <form onSubmit={handleSubmit} className="card card-body justify-content-center">
      {/* Nos genera elementos en frontend */}
      <img 
        src="https://img1.freepng.es/20180215/tjq/kisspng-arecaceae-plant-leaf-palm-branch-potted-green-plants-5a85705db4e984.371379691518694493741.jpg" 
        alt="planta"
        width={200}
        className="img-fluid"/>

      <h3 className="text-center my-10">Price $100</h3>

      <CardElement className="form-control"/>

      <button className="btn btn-success" disabled={!stripe}>
        {loading ? (
          <div className="spinner-border text-ligth" role="status">
            <span className="sr-only"></span>
          </div>
        ): "Comprar"}
        
      </button>
    </form>
  )
}

function App() {
  return (
    //Accede conexion y pasa conexion a componentes hijos
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <CheckoutForm />
          </div>
        </div>
      </div> 

    </Elements>
  );
}

export default App;
