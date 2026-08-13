import { useState } from 'react'
import { FaWhatsapp, FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa'
import './App.css'


/* ================================
   WHATSAPP
================================ */

function openWhatsApp(message) {

  const phoneNumber = "918896079866"

  const url =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  window.open(url, "_blank")
}


/* ================================
   PRODUCT CARD
================================ */

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
      item => item.id === `${name}-${weight}`
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
        onError={(e) => {
          e.currentTarget.style.background = "#f5f1e8"
          e.currentTarget.alt = `${name} image`
        }}
      />

      <h3>{name}</h3>

      <p>{description}</p>


      <div className="weight">

        {
          ["250g", "500g", "1kg"].map(item => (

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
          type="button"
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


        <b>{quantity}</b>


        <button
          type="button"
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
        type="button"
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


      <button
        type="button"
        onClick={orderProduct}
      >
        Order {name}
      </button>

    </div>

  )

}


/* ================================
   APP
================================ */

function App() {

  const [cart, setCart] = useState([])

  const [orderSuccess, setOrderSuccess] = useState(false)

  const [directProduct, setDirectProduct] = useState(null)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


  /* ================================
     CUSTOMER DETAILS
  ================================= */

  const [customer, setCustomer] = useState({

    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    address: ""

  })


  /* ================================
     FORM ERRORS
  ================================= */

  const [errors, setErrors] = useState({})


  /* ================================
     STATES
  ================================= */

  const states = [

    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"

  ]


  /* ================================
     VALIDATION
  ================================= */

  function validateCustomer() {

    const newErrors = {}


    /* NAME */

    if (!customer.name.trim()) {

      newErrors.name = "Please enter your name."

    }
    else if (customer.name.trim().length < 2) {

      newErrors.name = "Name must contain at least 2 characters."

    }


    /* PHONE */

    if (!customer.phone.trim()) {

      newErrors.phone = "Please enter your phone number."

    }
    else if (!/^[6-9][0-9]{9}$/.test(customer.phone)) {

      newErrors.phone =
        "Please enter a valid 10-digit Indian mobile number."

    }


    /* PINCODE */

    if (!customer.pincode.trim()) {

      newErrors.pincode = "Please enter your 6-digit pincode."

    }
    else if (!/^[0-9]{6}$/.test(customer.pincode)) {

      newErrors.pincode =
        "Pincode must contain exactly 6 digits."

    }


    /* CITY */

    if (!customer.city.trim()) {

      newErrors.city = "Please enter your city."

    }
    else if (customer.city.trim().length < 2) {

      newErrors.city =
        "Please enter a valid city name."

    }


    /* STATE */

    if (!customer.state) {

      newErrors.state = "Please select your state."

    }


    /* ADDRESS */

    if (!customer.address.trim()) {

      newErrors.address =
        "Please enter your complete delivery address."

    }
    else if (customer.address.trim().length < 10) {

      newErrors.address =
        "Please enter a more complete address."

    }


    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }


  /* ================================
     HANDLE FIELD CHANGE
  ================================= */

  function handleCustomerChange(field, value) {

    let newValue = value


    /* PHONE */

    if (field === "phone") {

      newValue =
        value.replace(/\D/g, "").slice(0, 10)

    }


    /* PINCODE */

    if (field === "pincode") {

      newValue =
        value.replace(/\D/g, "").slice(0, 6)

    }


    setCustomer(prev => ({

      ...prev,

      [field]: newValue

    }))


    /* Clear field error */

    if (errors[field]) {

      setErrors(prev => ({

        ...prev,

        [field]: ""

      }))

    }

  }


  /* ================================
     ADD TO CART
  ================================= */

  function addToCart(product) {

    const existing = cart.find(
      item => item.id === product.id
    )


    if (existing) {

      alert(
        `${product.name} (${product.weight}) is already in cart. Use + / - buttons to change quantity.`
      )

      return

    }


    setCart(prev => [

      ...prev,
      product

    ])

  }


  /* ================================
     PRODUCT QUANTITY
  ================================= */

  function updateProductQuantity(
    id,
    amount,
    name,
    weight,
    price
  ) {

    setCart(prev => {

      const existing =
        prev.find(item => item.id === id)


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


  /* ================================
     DIRECT ORDER
  ================================= */

  function directOrder(product) {

    setDirectProduct(product)


    setTimeout(() => {

      document
        .getElementById("customer-details")
        ?.scrollIntoView({
          behavior: "smooth"
        })

    }, 100)

  }


  /* ================================
     CART QUANTITY
  ================================= */

  function updateQuantity(index, amount) {

    setCart(prev =>

      prev.map((item, i) =>

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


  /* ================================
     REMOVE ITEM
  ================================= */

  function removeItem(index) {

    setCart(prev =>
      prev.filter((_, i) => i !== index)
    )

  }


  /* ================================
     SUBTOTAL
  ================================= */

  function subtotal() {

    return cart.reduce(

      (total, item) =>
        total +
        item.price * item.quantity,

      0

    )

  }


  /* ================================
     DELIVERY
  ================================= */

  function deliveryCharge() {

    return subtotal() >= 1000
      ? 0
      : 50

  }


  /* ================================
     FINAL TOTAL
  ================================= */

  function finalTotal() {

    return subtotal() + deliveryCharge()

  }


  /* ================================
     DIRECT ORDER WHATSAPP
  ================================= */

  function sendDirectOrder() {

    if (!validateCustomer()) {

      document
        .getElementById("customer-details")
        ?.scrollIntoView({
          behavior: "smooth"
        })

      return

    }


    if (!directProduct) return


    const productTotal =
      directProduct.price *
      directProduct.quantity


    const delivery = 50


    const message =

`Hello Healthy Nuts, I want to place an order.

CUSTOMER DETAILS

Name: ${customer.name}
Phone: ${customer.phone}
Pincode: ${customer.pincode}
City: ${customer.city}
State: ${customer.state}
Address: ${customer.address}

ORDER DETAILS

${directProduct.name}
Weight: ${directProduct.weight}
Quantity: ${directProduct.quantity}
Price: ₹${productTotal}

Delivery: ₹${delivery}

Final Total: ₹${productTotal + delivery}
`


    openWhatsApp(message)

    setOrderSuccess(true)

  }


  /* ================================
     CART WHATSAPP
  ================================= */

  function orderCartWhatsApp() {

    if (!validateCustomer()) {

      document
        .getElementById("customer-details")
        ?.scrollIntoView({
          behavior: "smooth"
        })

      return

    }


    if (cart.length === 0) return


    let message =

`Hello Healthy Nuts, I want to place an order.

CUSTOMER DETAILS

Name: ${customer.name}
Phone: ${customer.phone}
Pincode: ${customer.pincode}
City: ${customer.city}
State: ${customer.state}
Address: ${customer.address}

ORDER DETAILS

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
${deliveryCharge() === 0 ? "FREE" : "₹50"}

Final Total:
₹${finalTotal()}
`


    openWhatsApp(message)

    setOrderSuccess(true)

  }


  /* ================================
     MOBILE MENU
  ================================= */

  function closeMobileMenu() {

    setMobileMenuOpen(false)

  }


  /* ================================
     SUCCESS PAGE
  ================================= */

  if (orderSuccess) {

    return (

      <div className="order-success">

        <div className="success-icon">
          ✓
        </div>

        <h1>
          🎉 Thank You!
        </h1>

        <h2>
          Order request sent successfully.
        </h2>

        <p>
          Your order details have been sent to
          Healthy Nuts on WhatsApp.
        </p>

        <p>
          Our team will contact you shortly.
        </p>


        <button
          onClick={() => {

            setOrderSuccess(false)

            setDirectProduct(null)

            setCart([])

            window.scrollTo({
              top: 0,
              behavior: "smooth"
            })

          }}
        >
          Continue Shopping
        </button>

      </div>

    )

  }


  /* ================================
     MAIN WEBSITE
  ================================= */

  return (

    <div className="app">


      {/* ================================
          HEADER
      ================================= */}

      <header className="header">

  <div className="logo-section">

    <img
      src="/images/logo.jpeg"
      alt="Healthy Nuts Logo"
    />

    <div className="brand-text">

      <h1>
        Healthy Nuts
      </h1>

      <p className="brand-tagline">
        Premium • Fresh • Natural
      </p>

    </div>

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


      {/* ================================
          HERO
      ================================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <span className="hero-badge">
            NATURAL • PREMIUM • FRESH
          </span>

          <h2>
            Premium Quality
            <br />
            Dry Fruits & Seeds
          </h2>

          <p>
            Handpicked dry fruits, nuts and seeds
            delivered fresh to your doorstep.
          </p>

          <button
            onClick={() =>
              openWhatsApp(
                "Hello Healthy Nuts, I want to order dry fruits."
              )
            }
          >

            <FaWhatsapp />

            Order on WhatsApp

          </button>

        </div>

      </section>


      {/* ================================
          PRODUCTS
      ================================= */}

      <section
        className="products"
        id="products"
      >

        <span className="section-label">
          OUR COLLECTION
        </span>

        <h2>
          Premium Dry Fruits & Seeds
        </h2>

        <p className="section-description">
          Carefully selected for freshness,
          taste and quality.
        </p>


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


          {/* KHARBOOJA */}

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


          {/* KADDU */}

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


          {/* SURAJMUKHI */}

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


      {/* ================================
          CART
      ================================= */}

      <section
        className="cart"
        id="cart"
      >

        <span className="section-label">
          SHOPPING BAG
        </span>

        <h2>
          Your Cart
        </h2>


        {
          cart.length === 0

            ?

            <div className="empty-cart">

              <div>
                🛒
              </div>

              <h3>
                Your cart is empty
              </h3>

              <p>
                Add some premium dry fruits
                to get started.
              </p>

            </div>

            :

            cart.map((item, index) => (

              <div
                className="cart-item"
                key={item.id}
              >

                <div className="cart-item-info">

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Weight: {item.weight}
                  </p>

                  <p>
                    Price per pack: ₹{item.price}
                  </p>

                  <strong>
                    Total: ₹{item.price * item.quantity}
                  </strong>

                </div>


                <div className="cart-actions">

                  <div className="cart-quantity">

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(index, -1)
                      }
                    >
                      -
                    </button>

                    <b>
                      {item.quantity}
                    </b>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(index, 1)
                      }
                    >
                      +
                    </button>

                  </div>


                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeItem(index)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))
        }


        {
          cart.length > 0 &&

          <div className="cart-summary">

            <div>
              <span>
                Subtotal
              </span>

              <strong>
                ₹{subtotal()}
              </strong>
            </div>


            <div>
              <span>
                Delivery
              </span>

              <strong>
                {
                  deliveryCharge() === 0
                    ? "FREE 🎉"
                    : "₹50"
                }
              </strong>
            </div>


            <div className="grand-total">

              <span>
                Total
              </span>

              <strong>
                ₹{finalTotal()}
              </strong>

            </div>

          </div>

        }


        {/* ================================
            CUSTOMER FORM
        ================================= */}

        <div
          className="customer-form"
          id="customer-details"
        >

          <span className="form-label">
            SECURE DELIVERY DETAILS
          </span>

          <h3>
            Where should we deliver?
          </h3>

          <p className="form-subtitle">
            Enter your details so we can confirm
            your order on WhatsApp.
          </p>


          {/* DIRECT ORDER PREVIEW */}

          {
            directProduct &&

            <div className="direct-order-preview">

              <span>
                DIRECT ORDER
              </span>

              <h4>
                {directProduct.name}
              </h4>

              <p>
                {directProduct.weight}
                {" "}×{" "}
                {directProduct.quantity}
              </p>

              <strong>
                ₹{directProduct.price *
                  directProduct.quantity}
              </strong>

            </div>

          }


          {/* NAME */}

          <div
            className={
              `form-field ${
                errors.name ? "has-error" : ""
              }`
            }
          >

            <label>
              Full Name
              <span>*</span>
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={customer.name}
              onChange={(e) =>
                handleCustomerChange(
                  "name",
                  e.target.value
                )
              }
            />

            {
              errors.name &&

              <small className="error-message">
                {errors.name}
              </small>
            }

          </div>


          {/* PHONE */}

          <div
            className={
              `form-field ${
                errors.phone ? "has-error" : ""
              }`
            }
          >

            <label>
              Phone Number
              <span>*</span>
            </label>

            <input
              type="tel"
              inputMode="numeric"
              maxLength="10"
              placeholder="10-digit mobile number"
              value={customer.phone}
              onChange={(e) =>
                handleCustomerChange(
                  "phone",
                  e.target.value
                )
              }
            />

            {
              errors.phone &&

              <small className="error-message">
                {errors.phone}
              </small>
            }

          </div>


          {/* PINCODE */}

          <div
            className={
              `form-field ${
                errors.pincode ? "has-error" : ""
              }`
            }
          >

            <label>
              Pincode
              <span>*</span>
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="6-digit pincode"
              value={customer.pincode}
              onChange={(e) =>
                handleCustomerChange(
                  "pincode",
                  e.target.value
                )
              }
            />

            {
              errors.pincode &&

              <small className="error-message">
                {errors.pincode}
              </small>
            }

          </div>


          {/* CITY */}

          <div
            className={
              `form-field ${
                errors.city ? "has-error" : ""
              }`
            }
          >

            <label>
              City
              <span>*</span>
            </label>

            <input
              type="text"
              placeholder="Enter your city"
              value={customer.city}
              onChange={(e) =>
                handleCustomerChange(
                  "city",
                  e.target.value
                )
              }
            />

            {
              errors.city &&

              <small className="error-message">
                {errors.city}
              </small>
            }

          </div>


          {/* STATE */}

          <div
            className={
              `form-field ${
                errors.state ? "has-error" : ""
              }`
            }
          >

            <label>
              State
              <span>*</span>
            </label>

            <select
              value={customer.state}
              onChange={(e) =>
                handleCustomerChange(
                  "state",
                  e.target.value
                )
              }
            >

              <option value="">
                Select your state
              </option>

              {
                states.map(state => (

                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                  </option>

                ))
              }

            </select>

            {
              errors.state &&

              <small className="error-message">
                {errors.state}
              </small>
            }

          </div>


          {/* ADDRESS */}

          <div
            className={
              `form-field ${
                errors.address ? "has-error" : ""
              }`
            }
          >

            <label>
              Complete Delivery Address
              <span>*</span>
            </label>

            <textarea
              placeholder="House / Flat No., Street, Area, Landmark..."
              value={customer.address}
              onChange={(e) =>
                handleCustomerChange(
                  "address",
                  e.target.value
                )
              }
            />

            {
              errors.address &&

              <small className="error-message">
                {errors.address}
              </small>
            }

          </div>


          {/* DIRECT ORDER BUTTON */}

          {
            directProduct &&

            <button
              className="whatsapp-order-button"
              onClick={sendDirectOrder}
            >

              <FaWhatsapp />

              Order {directProduct.name}
              {" "}on WhatsApp

            </button>

          }


          {/* CART ORDER BUTTON */}

          {
            cart.length > 0 &&

            <button
              className="whatsapp-order-button"
              onClick={orderCartWhatsApp}
            >

              <FaWhatsapp />

              Order Cart on WhatsApp

            </button>

          }


          <p className="privacy-note">
            🔒 Your details are only used to process
            your delivery order.
          </p>

        </div>

      </section>


      {/* ================================
          REVIEWS
      ================================= */}

      <section
        className="reviews"
        id="reviews"
      >

        <span className="section-label">
          CUSTOMER LOVE
        </span>

        <h2>
          What Our Customers Say
        </h2>


        <div className="reviews-container">


          <div className="review-card">

            <div className="stars">
              ⭐⭐⭐⭐⭐
            </div>

            <p>
              Fresh kaju and excellent packaging.
              The quality is premium.
            </p>

            <b>
              Rahul, Kanpur
            </b>

          </div>


          <div className="review-card">

            <div className="stars">
              ⭐⭐⭐⭐⭐
            </div>

            <p>
              Almond quality is very good.
              Highly recommended.
            </p>

            <b>
              Priya, Kanpur
            </b>

          </div>


          <div className="review-card">

            <div className="stars">
              ⭐⭐⭐⭐⭐
            </div>

            <p>
              Fast delivery and premium products.
              Will order again.
            </p>

            <b>
              Amit, Kanpur
            </b>

          </div>


        </div>

      </section>


      {/* ================================
          CONTACT
      ================================= */}

      <section
        className="contact"
        id="contact"
      >

        <span className="section-label">
          GET IN TOUCH
        </span>

        <h2>
          Contact Healthy Nuts
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


      {/* ================================
          FOOTER
      ================================= */}

      <footer>

        <div className="footer-logo">
          Healthy Nuts
        </div>

        <p>
          Premium Dry Fruits • Natural Seeds •
          Freshness Delivered
        </p>

        <p>
          © 2026 Healthy Nuts | Kanpur
        </p>

      </footer>


      {/* ================================
          FLOATING WHATSAPP
      ================================= */}

      <button
        className="whatsapp-float"
        onClick={() =>
          openWhatsApp(
            "Hello Healthy Nuts, I want to know more."
          )
        }
        aria-label="Chat on WhatsApp"
      >

        <FaWhatsapp />

      </button>


    </div>

  )

}


export default App