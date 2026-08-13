import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import './App.css'



/* =========================
   WHATSAPP FUNCTION
========================= */

function openWhatsApp(message) {

  const phoneNumber = "918896079866"

  const url =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  window.open(url, "_blank")
}



/* =========================
   PRODUCT CARD
========================= */

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

    })

  }



  return (

    <div className="product-card">


      <img
        src={image}
        alt={name}
      />


      <h3>
        {name}
      </h3>


      <p>
        {description}
      </p>



      {/* WEIGHT */}

      <div className="weight">

        {
          ["250g", "500g", "1kg"].map(item => (

            <button

              key={item}

              className={
                weight === item
                  ? "active"
                  : ""
              }

              onClick={() =>
                setWeight(item)
              }

            >

              {item}

            </button>

          ))
        }

      </div>



      {/* PRICE */}

      <h4>

        Price per pack:
        ₹{prices[weight]}

      </h4>



      {/* QUANTITY */}

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



      {/* ADD TO CART */}

      <button

        onClick={() =>

          addToCart({

            id: `${name}-${weight}`,

            name,

            weight,

            price: prices[weight],

            quantity: 1

          })

        }

      >

        Add to Cart

      </button>



      <br />



      {/* DIRECT ORDER */}

      <button
        onClick={orderProduct}
      >

        Order {name}

      </button>


    </div>

  )

}



/* =========================
   APP
========================= */

function App() {


  const [cart, setCart] = useState([])


  const [orderSuccess, setOrderSuccess] =
    useState(false)


  const [directProduct, setDirectProduct] =
    useState(null)



  /* =========================
     CUSTOMER DETAILS
  ========================= */

  const [customer, setCustomer] = useState({

    name: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: ""

  })



  /* =========================
     FORM VALIDATION
  ========================= */

  const [formErrors, setFormErrors] =
    useState({})


  const [formTouched, setFormTouched] =
    useState({})



  function validateField(field, value) {

    let error = ""


    /* NAME */

    if (field === "name") {

      if (!value.trim()) {

        error =
          "Please enter your name."

      }

      else if (
        value.trim().length < 2
      ) {

        error =
          "Name must be at least 2 characters."

      }

    }



    /* PHONE */

    if (field === "phone") {

      if (!value.trim()) {

        error =
          "Please enter your phone number."

      }

      else if (
        !/^[6-9][0-9]{9}$/.test(value)
      ) {

        error =
          "Enter a valid 10-digit Indian mobile number."

      }

    }



    /* ADDRESS */

    if (field === "address") {

      if (!value.trim()) {

        error =
          "Please enter your delivery address."

      }

      else if (
        value.trim().length < 10
      ) {

        error =
          "Please enter a complete delivery address."

      }

    }



    /* PINCODE */

    if (field === "pincode") {

      if (!value.trim()) {

        error =
          "Please enter your pincode."

      }

      else if (
        !/^[1-9][0-9]{5}$/.test(value)
      ) {

        error =
          "Enter a valid 6-digit pincode."

      }

    }



    /* CITY */

    if (field === "city") {

      if (!value.trim()) {

        error =
          "Please enter your city."

      }

    }



    /* STATE */

    if (field === "state") {

      if (!value.trim()) {

        error =
          "Please enter your state."

      }

    }


    return error

  }



  function handleCustomerChange(
    field,
    value
  ) {


    setCustomer(prev => ({

      ...prev,

      [field]: value

    }))



    setFormTouched(prev => ({

      ...prev,

      [field]: true

    }))



    setFormErrors(prev => ({

      ...prev,

      [field]:
        validateField(
          field,
          value
        )

    }))

  }



  function validateCustomerForm() {


    const errors = {}


    Object.keys(customer).forEach(
      field => {

        const error =
          validateField(
            field,
            customer[field]
          )


        if (error) {

          errors[field] = error

        }

      }
    )



    setFormErrors(errors)



    setFormTouched({

      name: true,
      phone: true,
      address: true,
      pincode: true,
      city: true,
      state: true

    })



    return (
      Object.keys(errors).length === 0
    )

  }



  /* =========================
     ADD TO CART
  ========================= */

  function addToCart(product) {


    const existing =
      cart.find(
        item =>
          item.id === product.id
      )



    if (existing) {

      alert(
        `${product.name} (${product.weight}) is already in cart. Use + / - buttons to change quantity.`
      )

      return

    }



    setCart([
      ...cart,
      product
    ])

  }



  /* =========================
     PRODUCT QUANTITY
  ========================= */

  function updateProductQuantity(
    id,
    amount,
    name,
    weight,
    price
  ) {


    setCart(prev => {


      const existing =
        prev.find(
          item =>
            item.id === id
        )



      if (existing) {


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
          quantity: 1

        }

      ]

    })

  }



  /* =========================
     DIRECT ORDER
  ========================= */

  function directOrder(product) {


    setDirectProduct(product)



    document
      .getElementById(
        "customer-details"
      )
      ?.scrollIntoView({

        behavior: "smooth"

      })

  }



  /* =========================
     CART QUANTITY
  ========================= */

  function updateQuantity(
    index,
    amount
  ) {


    setCart(

      cart.map(
        (item, i) =>

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



  /* =========================
     REMOVE ITEM
  ========================= */

  function removeItem(index) {

    setCart(

      cart.filter(
        (_, i) =>
          i !== index
      )

    )

  }



  /* =========================
     SUBTOTAL
  ========================= */

  function subtotal() {

    return cart.reduce(

      (total, item) =>

        total +
        item.price *
        item.quantity,

      0

    )

  }



  /* =========================
     DELIVERY
  ========================= */

  function deliveryCharge() {

    return subtotal() >= 1000
      ? 0
      : 50

  }



  /* =========================
     FINAL TOTAL
  ========================= */

  function finalTotal() {

    return (
      subtotal() +
      deliveryCharge()
    )

  }



  /* =========================
     DIRECT ORDER WHATSAPP
  ========================= */

  function sendDirectOrder() {


    if (!validateCustomerForm()) {

      return

    }



    if (!directProduct) {

      return

    }



    const productTotal =
      directProduct.price *
      directProduct.quantity



    const directDelivery =
      productTotal >= 1000
        ? 0
        : 50



    const directFinalTotal =
      productTotal +
      directDelivery



    let message =

`Hello Healthy Nuts, I want to place an order.

Customer Details:

Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}
Pincode: ${customer.pincode}
City: ${customer.city}
State: ${customer.state}


Order Details:

${directProduct.name}
Weight: ${directProduct.weight}
Quantity: ${directProduct.quantity}
Price: ₹${productTotal}


Delivery:
${directDelivery === 0 ? "FREE" : "₹50"}

Final Total:
₹${directFinalTotal}
`



    openWhatsApp(message)



    setOrderSuccess(true)

  }



  /* =========================
     CART WHATSAPP ORDER
  ========================= */

  function orderCartWhatsApp() {


    if (!validateCustomerForm()) {

      return

    }



    if (cart.length === 0) {

      alert(
        "Your cart is empty."
      )

      return

    }



    let message =

`Hello Healthy Nuts, I want to place an order.

Customer Details:

Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}
Pincode: ${customer.pincode}
City: ${customer.city}
State: ${customer.state}


Order Details:

`



    cart.forEach(item => {


      message +=

`${item.name}
Weight: ${item.weight}
Quantity: ${item.quantity}
Price: ₹${item.price * item.quantity}

`

    })



    message +=

`Subtotal: ₹${subtotal()}

Delivery:
${deliveryCharge() === 0
        ? "FREE"
        : "₹50"}

Final Total:
₹${finalTotal()}`



    openWhatsApp(message)



    setOrderSuccess(true)

  }



  /* =========================
     ORDER SUCCESS
  ========================= */

  if (orderSuccess) {

    return (

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

          onClick={() =>
            setOrderSuccess(false)
          }

        >

          Continue Shopping

        </button>


      </div>

    )

  }



  /* =========================
     MAIN WEBSITE
  ========================= */

  return (

    <div className="app">


      {/* =========================
          HEADER
      ========================= */}

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



      {/* =========================
          HERO
      ========================= */}

      <section
        className="hero"
        id="home"
      >


        <h2>
          Premium Quality Dry Fruits
        </h2>


        <p>
          Fresh Kaju, Badam, Pista,
          Khajur, Kismis and premium
          dry fruits delivered to your doorstep.
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



      {/* =========================
          PRODUCTS
      ========================= */}

      <section
        className="products"
        id="products"
      >


        <h2>
          Our Products
        </h2>



        <div className="product-container">


          {/* KAJU */}

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

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* BADAM */}

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

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* PISTA */}

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

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* KHAJUR */}

          <ProductCard

            image="/images/khajur.png"

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

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* KISMIS */}

          <ProductCard

            image="/images/kismis.png"

            name="Kismis"

            description="Premium Raisins"

            prices={{

              "250g": 180,
              "500g": 350,
              "1kg": 685

            }}

            addToCart={addToCart}

            directOrder={directOrder}

            cart={cart}

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* AKHROOT */}

          <ProductCard

            image="/images/akhroot.png"

            name="Akhroot"

            description="Premium Walnuts"

            prices={{

              "250g": 199,
              "500g": 199,
              "1kg": 199

            }}

            addToCart={addToCart}

            directOrder={directOrder}

            cart={cart}

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* ALSI */}

          <ProductCard

            image="/images/alsi.png"

            name="Alsi"

            description="Premium Flax Seeds"

            prices={{

              "250g": 199,
              "500g": 199,
              "1kg": 199

            }}

            addToCart={addToCart}

            directOrder={directOrder}

            cart={cart}

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* ANJEER */}

          <ProductCard

            image="/images/anjeer.png"

            name="Anjeer"

            description="Premium Dried Figs"

            prices={{

              "250g": 199,
              "500g": 199,
              "1kg": 199

            }}

            addToCart={addToCart}

            directOrder={directOrder}

            cart={cart}

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* MAKHANA */}

          <ProductCard

            image="/images/makhana.png"

            name="Makhana"

            description="Premium Fox Nuts"

            prices={{

              "250g": 199,
              "500g": 199,
              "1kg": 199

            }}

            addToCart={addToCart}

            directOrder={directOrder}

            cart={cart}

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* KHARBOOJA KE BEEJ */}

          <ProductCard

            image="/images/kharbooja-ke-beej.png"

            name="Kharbooja Ke Beej"

            description="Premium Melon Seeds"

            prices={{

              "250g": 199,
              "500g": 199,
              "1kg": 199

            }}

            addToCart={addToCart}

            directOrder={directOrder}

            cart={cart}

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* KADDU KA BEEJ */}

          <ProductCard

            image="/images/kaddu-ka-beej.png"

            name="Kaddu Ka Beej"

            description="Premium Pumpkin Seeds"

            prices={{

              "250g": 199,
              "500g": 199,
              "1kg": 199

            }}

            addToCart={addToCart}

            directOrder={directOrder}

            cart={cart}

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* SURAJMUKHI KA BEEJ */}

          <ProductCard

            image="/images/surajmukhi-ka-beej.png"

            name="Surajmukhi Ka Beej"

            description="Premium Sunflower Seeds"

            prices={{

              "250g": 199,
              "500g": 199,
              "1kg": 199

            }}

            addToCart={addToCart}

            directOrder={directOrder}

            cart={cart}

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* DRY FRUIT MIX */}

          <ProductCard

            image="/images/dry-fruit-mix.png"

            name="Dry Fruit Mix"

            description="Premium Dry Fruit Mix"

            prices={{

              "250g": 199,
              "500g": 199,
              "1kg": 199

            }}

            addToCart={addToCart}

            directOrder={directOrder}

            cart={cart}

            updateProductQuantity={
              updateProductQuantity
            }

          />



          {/* SEEDS MIX */}

          <ProductCard

            image="/images/seeds-mix.png"

            name="Seeds Mix"

            description="Premium Seeds Mix"

            prices={{

              "250g": 199,
              "500g": 199,
              "1kg": 199

            }}

            addToCart={addToCart}

            directOrder={directOrder}

            cart={cart}

            updateProductQuantity={
              updateProductQuantity
            }

          />


        </div>


      </section>



      {/* =========================
          CART
      ========================= */}

      <section
        className="cart"
        id="cart"
      >


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

            cart.map(
              (item, index) => (

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
                    Price per pack:
                    ₹{item.price}
                  </p>


                  <p>
                    Total:
                    ₹{item.price * item.quantity}
                  </p>



                  <button

                    onClick={() =>
                      updateQuantity(
                        index,
                        -1
                      )
                    }

                  >

                    -

                  </button>



                  <b>
                    {item.quantity}
                  </b>



                  <button

                    onClick={() =>
                      updateQuantity(
                        index,
                        1
                      )
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

              )
            )

        }



        {
          cart.length > 0 &&

          <>


            <h3>
              Subtotal:
              ₹{subtotal()}
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
              Total:
              ₹{finalTotal()}
            </h2>


          </>

        }



        {/* =========================
            CUSTOMER FORM
        ========================= */}

        <div
          className="customer-form"
          id="customer-details"
        >


          <h3>
            Delivery Details
          </h3>



          {/* DIRECT ORDER PREVIEW */}

          {
            directProduct &&

            <div
              className="direct-order-preview"
            >

              <h4>
                Direct Order
              </h4>

              <p>
                {directProduct.name}
              </p>

              <p>
                Weight:
                {directProduct.weight}
              </p>

              <p>
                Quantity:
                {directProduct.quantity}
              </p>

              <p>
                Price:
                ₹{
                  directProduct.price *
                  directProduct.quantity
                }
              </p>

            </div>

          }



          {/* NAME */}

          <div className="form-field">


            <input

              type="text"

              placeholder="Your Name"

              value={customer.name}

              className={
                formTouched.name

                  ?

                  formErrors.name
                    ? "input-error"
                    : "input-valid"

                  :

                  ""
              }

              onChange={(e) =>
                handleCustomerChange(
                  "name",
                  e.target.value
                )
              }

            />


            {
              formTouched.name &&
              formErrors.name &&

              <small
                className="field-error"
              >

                ⚠ {formErrors.name}

              </small>

            }


          </div>



          {/* PHONE */}

          <div className="form-field">


            <input

              type="tel"

              inputMode="numeric"

              maxLength="10"

              placeholder="10 Digit Mobile Number"

              value={customer.phone}

              className={
                formTouched.phone

                  ?

                  formErrors.phone
                    ? "input-error"
                    : "input-valid"

                  :

                  ""
              }

              onChange={(e) =>

                handleCustomerChange(

                  "phone",

                  e.target.value
                    .replace(/\D/g, "")
                )

              }

            />


            {
              formTouched.phone &&
              formErrors.phone &&

              <small
                className="field-error"
              >

                ⚠ {formErrors.phone}

              </small>

            }


          </div>



          {/* ADDRESS */}

          <div className="form-field">


            <textarea

              placeholder="Complete Delivery Address"

              value={customer.address}

              className={
                formTouched.address

                  ?

                  formErrors.address
                    ? "input-error"
                    : "input-valid"

                  :

                  ""
              }

              onChange={(e) =>
                handleCustomerChange(
                  "address",
                  e.target.value
                )
              }

            />


            {
              formTouched.address &&
              formErrors.address &&

              <small
                className="field-error"
              >

                ⚠ {formErrors.address}

              </small>

            }


          </div>



          {/* PINCODE + CITY */}

          <div className="form-row">


            {/* PINCODE */}

            <div className="form-field">


              <input

                type="text"

                inputMode="numeric"

                maxLength="6"

                placeholder="Pincode"

                value={customer.pincode}

                className={
                  formTouched.pincode

                    ?

                    formErrors.pincode
                      ? "input-error"
                      : "input-valid"

                    :

                    ""
                }

                onChange={(e) =>

                  handleCustomerChange(

                    "pincode",

                    e.target.value
                      .replace(/\D/g, "")
                  )

                }

              />


              {
                formTouched.pincode &&
                formErrors.pincode &&

                <small
                  className="field-error"
                >

                  ⚠ {formErrors.pincode}

                </small>

              }


            </div>



            {/* CITY */}

            <div className="form-field">


              <input

                type="text"

                placeholder="City"

                value={customer.city}

                className={
                  formTouched.city

                    ?

                    formErrors.city
                      ? "input-error"
                      : "input-valid"

                    :

                    ""
                }

                onChange={(e) =>
                  handleCustomerChange(
                    "city",
                    e.target.value
                  )
                }

              />


              {
                formTouched.city &&
                formErrors.city &&

                <small
                  className="field-error"
                >

                  ⚠ {formErrors.city}

                </small>

              }


            </div>


          </div>



          {/* STATE */}

          <div className="form-field">


            <input

              type="text"

              placeholder="State"

              value={customer.state}

              className={
                formTouched.state

                  ?

                  formErrors.state
                    ? "input-error"
                    : "input-valid"

                  :

                  ""
              }

              onChange={(e) =>
                handleCustomerChange(
                  "state",
                  e.target.value
                )
              }

            />


            {
              formTouched.state &&
              formErrors.state &&

              <small
                className="field-error"
              >

                ⚠ {formErrors.state}

              </small>

            }


          </div>



          {/* DIRECT ORDER BUTTON */}

          {
            directProduct &&

            <button
              onClick={
                sendDirectOrder
              }
            >

              <FaWhatsapp />

              Order {directProduct.name}

            </button>

          }



          {/* CART ORDER BUTTON */}

          {
            cart.length > 0 &&

            <button
              onClick={
                orderCartWhatsApp
              }
            >

              <FaWhatsapp />

              Order Cart on WhatsApp

            </button>

          }


        </div>


      </section>



      {/* =========================
          REVIEWS
      ========================= */}

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
              Fresh kaju and excellent
              packaging. The quality is premium.
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
              Fast delivery and premium
              products. Will order again.
            </p>


            <b>
              - Amit, Kanpur
            </b>


          </div>


        </div>



        {/* =========================
            CONTACT
        ========================= */}

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



      {/* =========================
          FOOTER
      ========================= */}

      <footer>

        <p>
          © 2026 Healthy Nuts | Kanpur
        </p>

      </footer>


    </div>

  )

}


export default App