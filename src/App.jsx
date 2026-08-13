import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import './App.css'



function openWhatsApp(message) {

  const phoneNumber = "918896079866";

  const url =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

}



function ProductCard({
  image,
  name,
  description,
  prices,
  addToCart,
  directOrder,
  cart,
  updateProductQuantity
}) {


  const [weight, setWeight] = useState("250g")



  const quantity =
    cart.find(
      item =>
        item.id === `${name}-${weight}`
    )?.quantity || 1





  function orderProduct() {

    directOrder({

      name,
      weight,
      quantity,
      price: prices[weight]

    });

  }






  return (

    

    <div className="product-card">


      <img src={image} alt={name} />


      <h3>{name}</h3>


      <p>{description}</p>





      <div className="weight">

        {
          ["250g","500g","1kg"].map(item => (

            <button

              key={item}

              className={
                weight === item ? "active" : ""
              }

              onClick={() => setWeight(item)}

            >

              {item}

            </button>

          ))
        }

      </div>





      <h4>
        Price per pack: ₹{prices[weight]}
      </h4>






      <div className="quantity-box">


        <button

          onClick={() =>
            updateProductQuantity(
              `${name}-${weight}`,
              -1,
              name,
              weight,
              prices[weight]
            )
          }

        >
          -
        </button>




        <b>
          {quantity}
        </b>




        <button

          onClick={() =>
            updateProductQuantity(
              `${name}-${weight}`,
              1,
              name,
              weight,
              prices[weight]
            )
          }

        >
          +
        </button>


      </div>





      <p>
        Quantity: {quantity}
      </p>





      <button

        onClick={() =>

          addToCart({

            id:`${name}-${weight}`,

            name,

            weight,

            price:prices[weight],

            quantity:1

          })

        }

      >

        Add to Cart

      </button>





      <br />





      <button onClick={orderProduct}>

        Order {name}

      </button>



    </div>

  )

}








function App() {


  const [cart, setCart] = useState([])



  const [orderSuccess, setOrderSuccess] = useState(false)



  const [directProduct, setDirectProduct] = useState(null)





  const [customer, setCustomer] = useState({

    name:"",
    phone:"",
    address:""

  })


function isValidPhone(phone) {

  return /^[0-9]{10}$/.test(phone);

}



function addToCart(product) {

  const existing = cart.find(
    item => item.id === product.id
  )


  if(existing){

    alert(
      `${product.name} (${product.weight}) is already in cart. Use + / - buttons to change quantity.`
    )

    return;

  }


  setCart([
    ...cart,
    product
  ])

}







  function updateProductQuantity(
    id,
    amount,
    name,
    weight,
    price
  ){


    setCart(prev => {


      const existing = prev.find(
        item =>
          item.id === id
      )



      if(existing){


        return prev.map(item =>


          item.id === id

          ?

          {

            ...item,

            quantity:
            Math.max(
              1,
              item.quantity + amount
            )

          }

          :

          item

        )


      }





      return [

        ...prev,

        {

          id,

          name,

          weight,

          price,

          quantity:1

        }

      ]


    })


  }






  function directOrder(product){


    setDirectProduct(product)



    document
    .getElementById("customer-details")
    ?.scrollIntoView({

      behavior:"smooth"

    })


  }
    function updateQuantity(index, amount){

    setCart(

      cart.map((item,i)=>

        i === index

        ?

        {
          ...item,
          quantity:
          Math.max(
            1,
            item.quantity + amount
          )
        }

        :

        item

      )

    )

  }





  function removeItem(index){

    setCart(

      cart.filter((_,i)=>i!==index)

    )

  }





  function subtotal(){

    return cart.reduce(

      (total,item)=>

      total + item.price * item.quantity,

      0

    )

  }





  function deliveryCharge(){

    return subtotal() >= 1000 ? 0 : 50;

  }





  function finalTotal(){

    return subtotal() + deliveryCharge();

  }





  function sendDirectOrder(){


    if(
      !customer.name ||
      !customer.phone ||
      !customer.address
    ){

      alert(
        "Please fill customer details before ordering."
      )

      return;

    }

    if(!isValidPhone(customer.phone)){

  alert(
    "Please enter a valid 10 digit phone number."
  )

  return;

}


    let message =

`Hello Healthy Nuts, I want to place an order.

Customer Details:

Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}


Order Details:

${directProduct.name}
Weight: ${directProduct.weight}
Quantity: ${directProduct.quantity}
Price: ₹${directProduct.price * directProduct.quantity}


Delivery:
₹50

Final Total:
₹${(directProduct.price * directProduct.quantity)+50}
`;



    openWhatsApp(message);

    setOrderSuccess(true);


  }






  function orderCartWhatsApp(){


    if(
      !customer.name ||
      !customer.phone ||
      !customer.address
    ){

      alert(
        "Please fill customer details before ordering."
      )

      return;

    }

if(!isValidPhone(customer.phone)){

  alert(
    "Please enter a valid 10 digit phone number."
  )

  return;

}


    let message =

`Hello Healthy Nuts, I want to place an order.

Customer Details:

Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}


Order Details:

`;




    cart.forEach(item=>{


      message +=

`${item.name}
Weight: ${item.weight}
Quantity: ${item.quantity}
Price: ₹${item.price * item.quantity}

`;

    })




    message +=

`Subtotal: ₹${subtotal()}

Delivery:
${deliveryCharge() === 0 ? "FREE" : "₹50"}

Final Total:
₹${finalTotal()}`;



    openWhatsApp(message);

    setOrderSuccess(true);


  }






  if(orderSuccess){

    return(

      <div className="order-success">

        <h1>
          🎉 Thank You!
        </h1>

        <h2>
          Order request sent successfully.
        </h2>

        <p>
          Our Healthy Nuts team will contact you shortly.
        </p>


        <button
          onClick={()=>
            setOrderSuccess(false)
          }
        >

          Continue Shopping

        </button>


      </div>

    )

  }





  return (

    <div className="app">

      <header className="header">

        <div className="logo-section">

          <img
            src="/images/logo.jpeg"
            alt="Healthy Nuts Logo"
          />

          <h1>
            Healthy Nuts
          </h1>

        </div>


        <nav>

          <a href="#home">
            Home
          </a>

          <a href="#products">
            Products
          </a>

          <a href="#cart">
            Cart ({cart.length})
          </a>

          <a href="#reviews">
            Reviews
          </a>

          <a href="#contact">
            Contact
          </a>

        </nav>

      </header>


      <section className="hero" id="home">

        <h2>
          Premium Quality Dry Fruits
        </h2>

        <p>
          Fresh Kaju, Badam and Pista delivered to your doorstep.
        </p>

        <button
          onClick={() =>
            openWhatsApp(
              "Hello Healthy Nuts, I want to order dry fruits."
            )
          }
        >
          Order on WhatsApp
        </button>

      </section>


      <section className="products" id="products">


        <h2>
          Our Products
        </h2>



        <div className="product-container">

  {/* Kaju */}
  <ProductCard
    image="/images/kaju.jpeg"
    name="Kaju"
    description="Premium Cashew Nuts"
    prices={{
      "250g": 294,
      "500g": 560,
      "1kg": 1100
    }}
    addToCart={addToCart}
    directOrder={directOrder}
    cart={cart}
    updateProductQuantity={updateProductQuantity}
  />

  {/* Badam */}
  <ProductCard
    image="/images/badam.jpeg"
    name="Badam"
    description="Premium Almonds"
    prices={{
      "250g": 298,
      "500g": 575,
      "1kg": 1120
    }}
    addToCart={addToCart}
    directOrder={directOrder}
    cart={cart}
    updateProductQuantity={updateProductQuantity}
  />

  {/* Pista */}
  <ProductCard
    image="/images/pista.jpeg"
    name="Pista"
    description="Premium Pistachios"
    prices={{
      "250g": 385,
      "500g": 750,
      "1kg": 1475
    }}
    addToCart={addToCart}
    directOrder={directOrder}
    cart={cart}
    updateProductQuantity={updateProductQuantity}
  />

  {/* Khajur */}
  <ProductCard
    image="/images/khajur.jpeg"
    name="Khajur"
    description="Premium Dates"
    prices={{
      "250g": 199,
      "500g": 360,
      "1kg": 685
    }}
    addToCart={addToCart}
    directOrder={directOrder}
    cart={cart}
    updateProductQuantity={updateProductQuantity}
  />

</div>

      </section>





      <section className="cart" id="cart">


        <h2>
          Your Cart
        </h2>



        {
          cart.length === 0

          ?

          <p>
            Cart is empty
          </p>


          :


          cart.map((item,index)=>(

            <div
              className="cart-item"
              key={item.id}
            >


              <h3>
                {item.name}
              </h3>


              <p>
                Weight: {item.weight}
              </p>


              <p>
                Price per pack: ₹{item.price}
              </p>


              <p>
                Total: ₹{item.price * item.quantity}
              </p>



              <button
                onClick={() =>
                  updateQuantity(index,-1)
                }
              >
                -
              </button>


              <b>
                {item.quantity}
              </b>


              <button
                onClick={() =>
                  updateQuantity(index,1)
                }
              >
                +
              </button>



              <button
                onClick={() =>
                  removeItem(index)
                }
              >
                Remove
              </button>


            </div>

          ))

        }





        {
          cart.length > 0 &&

          <>

            <h3>
              Subtotal: ₹{subtotal()}
            </h3>


            <h3>
              Delivery:
              {
                deliveryCharge() === 0
                ?
                " FREE 🎉"
                :
                " ₹50"
              }
            </h3>


            <h2>
              Total: ₹{finalTotal()}
            </h2>


          </>

        }






        <div
          className="customer-form"
          id="customer-details"
        >


          <h3>
            Delivery Details
          </h3>



          {
            directProduct &&

            <div className="direct-order-preview">

              <h4>
                Direct Order
              </h4>

              <p>
                {directProduct.name}
              </p>

              <p>
                Weight: {directProduct.weight}
              </p>

              <p>
                Quantity: {directProduct.quantity}
              </p>

            </div>

          }





          <input
            placeholder="Your Name"
            value={customer.name}
            onChange={(e)=>
              setCustomer({
                ...customer,
                name:e.target.value
              })
            }
          />



          <input
            placeholder="Phone Number"
            value={customer.phone}
            onChange={(e)=>
              setCustomer({
                ...customer,
                phone:e.target.value
              })
            }
          />



          <textarea
            placeholder="Delivery Address"
            value={customer.address}
            onChange={(e)=>
              setCustomer({
                ...customer,
                address:e.target.value
              })
            }
          />




          {
            directProduct &&

            <button onClick={sendDirectOrder}>

              <FaWhatsapp />

              Order {directProduct.name}

            </button>

          }





          {
            cart.length > 0 &&

            <button onClick={orderCartWhatsApp}>

              <FaWhatsapp />

              Order Cart on WhatsApp

            </button>

          }



        </div>


      </section>

<section 
  className="reviews" 
  id="reviews"
>

  <h2>
    Customer Reviews
  </h2>


  <div className="reviews-container">


    <div className="review-card">

      <div>
        ⭐⭐⭐⭐⭐
      </div>

      <p>
        Fresh kaju and excellent packaging.
        The quality is premium.
      </p>

      <b>
        - Rahul, Kanpur
      </b>

    </div>



    <div className="review-card">

      <div>
        ⭐⭐⭐⭐⭐
      </div>

      <p>
        Almond quality is very good.
        Highly recommended.
      </p>

      <b>
        - Priya, Kanpur
      </b>

    </div>



    <div className="review-card">

      <div>
        ⭐⭐⭐⭐⭐
      </div>

      <p>
        Fast delivery and premium products.
        Will order again.
      </p>

      <b>
        - Amit, Kanpur
      </b>

    </div>


  </div>

<section 
  className="contact" 
  id="contact"
>

  <h2>
    Contact Us
  </h2>


  <p>
    📍 Kanpur, Uttar Pradesh
  </p>


  <p>
    📞 +91-8896079866
  </p>



  <button

    onClick={() =>
      openWhatsApp(
        "Hello Healthy Nuts, I want to know more."
      )
    }

  >

    <FaWhatsapp />

    Chat on WhatsApp

  </button>


</section>

</section>



      <footer>

        <p>
          © 2026 Healthy Nuts | Kanpur
        </p>

      </footer>


    </div>

  )

}


export default App