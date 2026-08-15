import { useState, useEffect, useRef } from "react"
import { FaWhatsapp } from "react-icons/fa"
import "./App.css"


/* =========================================================
   WHATSAPP
   ========================================================= */

function openWhatsApp(message) {

  const phoneNumber = "918896079866"

  const url =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  window.open(url, "_blank")

}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function ProductCard({
  images,
  name,
  description,
  prices,
  addToCart,
  directOrder,
  cart,
  updateProductQuantity
}) {

  const [weight, setWeight] = useState("250g")

  const [currentImage, setCurrentImage] = useState(0)

  /*
    Local quantity.

    IMPORTANT:
    This quantity is controlled locally until
    the user actually clicks "Add to Cart".

    Therefore:
    + / - does NOT add anything to the cart.
  */
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  /*
    Controls whether automatic image changing is paused.
  */
  const [autoPlayPaused, setAutoPlayPaused] = useState(false)

  /*
    Used for touch interaction on mobile.
  */
  const touchStartX = useRef(null)


  /*
    Check whether this particular product + weight
    already exists in the cart.
  */
  const cartItem = cart.find(
    item => item.id === `${name}-${weight}`
  )


  /*
    If product is already in cart, show the cart quantity.

    Otherwise show the local quantity selected
    by the user.
  */
  const quantity =
    cartItem
      ? cartItem.quantity
      : selectedQuantity


  /* =========================================================
     SYNC LOCAL QUANTITY WITH CART
     ========================================================= */

  useEffect(() => {

    /*
      When a product is removed from the cart,
      reset the product quantity back to 1.

      If it is still in cart, we don't change
      selectedQuantity because the cart itself
      controls the displayed quantity.
    */

    if (!cartItem) {

      /*
        Do not automatically reset while user
        is simply changing weight.

        The local quantity remains what the user selected.
      */

    }

  }, [cartItem])


  /* =========================================================
     AUTOMATIC IMAGE SLIDER
     ========================================================= */

  useEffect(() => {

    /*
      If there is only one image,
      there is nothing to auto-slide.
    */

    if (images.length <= 1) {
      return
    }


    /*
      Don't start automatic scrolling
      while user has paused it.
    */

    if (autoPlayPaused) {
      return
    }


    const interval = setInterval(() => {

      setCurrentImage(prev =>

        prev === images.length - 1
          ? 0
          : prev + 1

      )

    }, 3000)


    return () => {
      clearInterval(interval)
    }

  }, [
    images.length,
    autoPlayPaused
  ])


  /* =========================================================
     NEXT IMAGE
     ========================================================= */

  function nextImage() {

    setCurrentImage(prev =>

      prev === images.length - 1
        ? 0
        : prev + 1

    )

  }


  /* =========================================================
     PREVIOUS IMAGE
     ========================================================= */

  function previousImage() {

    setCurrentImage(prev =>

      prev === 0
        ? images.length - 1
        : prev - 1

    )

  }


  /* =========================================================
     MOUSE ENTER
     ========================================================= */

  function handleMouseEnter() {

    /*
      On laptop/desktop:
      hovering over the image stops
      automatic scrolling.
    */

    setAutoPlayPaused(true)

  }


  /* =========================================================
     MOUSE LEAVE
     ========================================================= */

  function handleMouseLeave() {

    /*
      When user moves mouse away,
      automatic scrolling starts again.
    */

    setAutoPlayPaused(false)

  }


  /* =========================================================
     IMAGE CLICK
     ========================================================= */

  function handleImageClick() {

    /*
      Clicking the image toggles
      automatic sliding.

      Click once  = pause
      Click again = resume
    */

    setAutoPlayPaused(prev => !prev)

  }


  /* =========================================================
     TOUCH START
     ========================================================= */

  function handleTouchStart(e) {

    /*
      Mobile:
      immediately stop auto-slide
      when user touches the image.
    */

    setAutoPlayPaused(true)

    touchStartX.current =
      e.touches[0].clientX

  }


  /* =========================================================
     TOUCH END
     ========================================================= */

  function handleTouchEnd(e) {

    if (touchStartX.current === null) {
      return
    }


    const touchEndX =
      e.changedTouches[0].clientX


    const difference =
      touchStartX.current - touchEndX


    /*
      Swipe LEFT
    */

    if (difference > 50) {

      nextImage()

    }


    /*
      Swipe RIGHT
    */

    if (difference < -50) {

      previousImage()

    }


    touchStartX.current = null


    /*
      Resume automatic sliding
      shortly after the touch ends.
    */

    setTimeout(() => {

      setAutoPlayPaused(false)

    }, 1500)

  }


  /* =========================================================
     PRODUCT QUANTITY PLUS
     ========================================================= */

  function handleProductPlus() {

    /*
      IMPORTANT:

      If the product is already in the cart,
      update the cart quantity.

      If the product is NOT in the cart,
      only update the local quantity.

      This means clicking + before Add to Cart
      NEVER adds the product to the cart.
    */

    if (cartItem) {

      updateProductQuantity(
        `${name}-${weight}`,
        1,
        name,
        weight,
        prices[weight]
      )

      return

    }


    setSelectedQuantity(prev =>
      prev + 1
    )

  }


  /* =========================================================
     PRODUCT QUANTITY MINUS
     ========================================================= */

  function handleProductMinus() {

    /*
      If product is already in cart,
      update cart quantity.

      Otherwise only update local quantity.
    */

    if (cartItem) {

      updateProductQuantity(
        `${name}-${weight}`,
        -1,
        name,
        weight,
        prices[weight]
      )

      return

    }


    setSelectedQuantity(prev =>
      Math.max(
        1,
        prev - 1
      )
    )

  }


  /* =========================================================
     ADD PRODUCT TO CART
     ========================================================= */

  function handleAddToCart() {

    /*
      If already in cart,
      don't create a duplicate.
    */

    if (cartItem) {

      alert(
        `${name} (${weight}) is already in cart. Use + / - buttons to change quantity.`
      )

      return

    }


    /*
      IMPORTANT:

      selectedQuantity is used here.

      Example:

      Default = 1

      User clicks + twice

      selectedQuantity = 3

      User clicks Add to Cart

      Cart gets quantity = 3
    */

    addToCart({

      id: `${name}-${weight}`,

      name,

      weight,

      price: prices[weight],

      quantity: selectedQuantity

    })

  }


  /* =========================================================
     ORDER PRODUCT
     ========================================================= */

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


      {/* =====================================================
          PRODUCT IMAGE SLIDER
      ===================================================== */}

      <div
        className={
          `product-image-slider ${
            autoPlayPaused
              ? "slider-paused"
              : ""
          }`
        }

        onMouseEnter={handleMouseEnter}

        onMouseLeave={handleMouseLeave}

        onTouchStart={handleTouchStart}

        onTouchEnd={handleTouchEnd}

        onClick={handleImageClick}
      >


        <img
          src={images[currentImage]}
          alt={`${name} ${currentImage + 1}`}

          draggable="false"

          onError={(e) => {

            e.currentTarget.style.background =
              "#f5f1e8"

          }}
        />


        {/* ===================================================
            PAUSED INDICATOR
        =================================================== */}

        {
          autoPlayPaused &&

          <div className="slider-pause-indicator">

            ⏸

          </div>

        }


        {/* ===================================================
            PREVIOUS BUTTON
        =================================================== */}

        {
          images.length > 1 &&

          <button
            type="button"

            className={
              `image-slider-button image-slider-prev`
            }

            onClick={(e) => {

              e.stopPropagation()

              previousImage()

            }}

            aria-label="Previous image"
          >

            ‹

          </button>

        }


        {/* ===================================================
            NEXT BUTTON
        =================================================== */}

        {
          images.length > 1 &&

          <button
            type="button"

            className={
              `image-slider-button image-slider-next`
            }

            onClick={(e) => {

              e.stopPropagation()

              nextImage()

            }}

            aria-label="Next image"
          >

            ›

          </button>

        }


        {/* ===================================================
            DOTS
        =================================================== */}

        {
          images.length > 1 &&

          <div className="image-slider-dots">

            {
              images.map((_, index) => (

                <button
                  key={index}

                  type="button"

                  className={
                    index === currentImage
                      ? "active"
                      : ""
                  }

                  onClick={(e) => {

                    e.stopPropagation()

                    setCurrentImage(index)

                  }}

                  aria-label={
                    `Show image ${index + 1}`
                  }
                />

              ))
            }

          </div>

        }


      </div>


      {/* =====================================================
          PRODUCT NAME
      ===================================================== */}

      <h3>
        {name}
      </h3>


      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <p>
        {description}
      </p>


      {/* =====================================================
          WEIGHT
      ===================================================== */}

      <div className="weight">

        {
          ["250g", "500g", "1kg"].map(item => (

            <button
              key={item}

              type="button"

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


      {/* =====================================================
          PRICE
      ===================================================== */}

      <h4>
        Price per pack: ₹{prices[weight]}
      </h4>


      {/* =====================================================
          PRODUCT QUANTITY
      ===================================================== */}

      <div className="quantity-box">

        <button
          type="button"

          className="quantity-minus"

          onClick={handleProductMinus}
        >

          −

        </button>


        <b>
          {quantity}
        </b>


        <button
          type="button"

          className="quantity-plus"

          onClick={handleProductPlus}
        >

          +

        </button>

      </div>


      <p>
        Quantity: {quantity}
      </p>


      {/* =====================================================
          ADD TO CART
      ===================================================== */}

      <button
        type="button"

        onClick={handleAddToCart}
      >

        Add to Cart

      </button>


      {/* =====================================================
          DIRECT ORDER
      ===================================================== */}

      <button
        type="button"

        onClick={orderProduct}
      >

        Order {name}

      </button>


    </div>

  )

}


/* =========================================================
   APP
   ========================================================= */

function App() {

  const [cart, setCart] = useState([])

  const [orderSuccess, setOrderSuccess] =
    useState(false)

  const [directProduct, setDirectProduct] =
    useState(null)

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)


  /* =========================================================
     CUSTOMER DETAILS
     ========================================================= */

  const [customer, setCustomer] = useState({

    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    address: ""

  })


  /* =========================================================
     FORM ERRORS
     ========================================================= */

  const [errors, setErrors] = useState({})


  /* =========================================================
     STATES
     ========================================================= */

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


  /* =========================================================
     VALIDATION
     ========================================================= */

  function validateCustomer() {

    const newErrors = {}


    if (!customer.name.trim()) {

      newErrors.name =
        "Please enter your name."

    }

    else if (
      customer.name.trim().length < 2
    ) {

      newErrors.name =
        "Name must contain at least 2 characters."

    }


    if (!customer.phone.trim()) {

      newErrors.phone =
        "Please enter your phone number."

    }

    else if (
      !/^[6-9][0-9]{9}$/.test(
        customer.phone
      )
    ) {

      newErrors.phone =
        "Please enter a valid 10-digit Indian mobile number."

    }


    if (!customer.pincode.trim()) {

      newErrors.pincode =
        "Please enter your 6-digit pincode."

    }

    else if (
      !/^[0-9]{6}$/.test(
        customer.pincode
      )
    ) {

      newErrors.pincode =
        "Pincode must contain exactly 6 digits."

    }


    if (!customer.city.trim()) {

      newErrors.city =
        "Please enter your city."

    }

    else if (
      customer.city.trim().length < 2
    ) {

      newErrors.city =
        "Please enter a valid city name."

    }


    if (!customer.state) {

      newErrors.state =
        "Please select your state."

    }


    if (!customer.address.trim()) {

      newErrors.address =
        "Please enter your complete delivery address."

    }

    else if (
      customer.address.trim().length < 10
    ) {

      newErrors.address =
        "Please enter a more complete address."

    }


    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }


  /* =========================================================
     HANDLE CUSTOMER CHANGE
     ========================================================= */

  function handleCustomerChange(field, value) {

    let newValue = value


    if (field === "phone") {

      newValue =
        value
          .replace(/\D/g, "")
          .slice(0, 10)

    }


    if (field === "pincode") {

      newValue =
        value
          .replace(/\D/g, "")
          .slice(0, 6)

    }


    setCustomer(prev => ({

      ...prev,

      [field]: newValue

    }))


    if (errors[field]) {

      setErrors(prev => ({

        ...prev,

        [field]: ""

      }))

    }

  }


  /* =========================================================
     ADD TO CART
     ========================================================= */

  function addToCart(product) {

    const existing =
      cart.find(
        item => item.id === product.id
      )


    if (existing) {

      alert(
        `${product.name} (${product.weight}) is already in cart. Use + / - buttons to change quantity.`
      )

      return

    }


    /*
      The product is added here ONLY.

      Clicking + or - before this function
      is called does not modify the cart.
    */

    setCart(prev => [

      ...prev,

      product

    ])

  }


  /* =========================================================
     PRODUCT QUANTITY
     ========================================================= */

  function updateProductQuantity(
    id,
    amount,
    name,
    weight,
    price
  ) {

    /*
      This function is now ONLY responsible
      for products that are already in the cart.

      It will NEVER create a new cart item.
    */

    setCart(prev => {

      const existing =
        prev.find(
          item => item.id === id
        )


      /*
        If the product isn't in the cart,
        do absolutely nothing.

        This is important because the ProductCard
        handles pre-cart quantity locally.
      */

      if (!existing) {

        return prev

      }


      /*
        Product already exists in cart,
        so update its quantity.
      */

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

    })

  }


  /* =========================================================
     DIRECT ORDER
     ========================================================= */

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


  /* =========================================================
     CART QUANTITY
     ========================================================= */

  function updateQuantity(
    index,
    amount
  ) {

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


  /* =========================================================
     REMOVE ITEM
     ========================================================= */

  function removeItem(index) {

    setCart(prev =>
      prev.filter(
        (_, i) => i !== index
      )
    )

  }


  /* =========================================================
     SUBTOTAL
     ========================================================= */

  function subtotal() {

    return cart.reduce(

      (total, item) =>
        total +
        item.price *
        item.quantity,

      0

    )

  }


  /* =========================================================
     DELIVERY
     ========================================================= */

  function deliveryCharge() {

    return subtotal() >= 1000
      ? 0
      : 50

  }


  /* =========================================================
     FINAL TOTAL
     ========================================================= */

  function finalTotal() {

    return (
      subtotal() +
      deliveryCharge()
    )

  }


  /* =========================================================
     DIRECT ORDER WHATSAPP
     ========================================================= */

  function sendDirectOrder() {

    if (!validateCustomer()) {

      document
        .getElementById(
          "customer-details"
        )
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


  /* =========================================================
     CART WHATSAPP
     ========================================================= */

  function orderCartWhatsApp() {

    if (!validateCustomer()) {

      document
        .getElementById(
          "customer-details"
        )
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
${
  deliveryCharge() === 0
    ? "FREE"
    : "₹50"
}

Final Total:
₹${finalTotal()}
`


    openWhatsApp(message)

    setOrderSuccess(true)

  }


  /* =========================================================
     MOBILE MENU
     ========================================================= */

  function toggleMobileMenu() {

    setMobileMenuOpen(
      prev => !prev
    )

  }


  function closeMobileMenu() {

    setMobileMenuOpen(false)

  }


  /* =========================================================
     SUCCESS PAGE
     ========================================================= */

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


  /* =========================================================
     MAIN WEBSITE
     ========================================================= */

  return (

    <div className="app">


      {/* =====================================================
          HEADER
      ===================================================== */}

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


        {/* MOBILE MENU */}

        <button
          type="button"
          className="menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >

          {
            mobileMenuOpen
              ? "✕"
              : "☰"
          }

        </button>


        {/* NAVIGATION */}

        <nav
          className={
            mobileMenuOpen
              ? "mobile-nav active"
              : "mobile-nav"
          }
        >

          <a
            href="#home"
            onClick={closeMobileMenu}
          >
            Home
          </a>

          <a
            href="#products"
            onClick={closeMobileMenu}
          >
            Products
          </a>

          <a
            href="#cart"
            onClick={closeMobileMenu}
          >
            Cart ({cart.length})
          </a>

          <a
            href="#reviews"
            onClick={closeMobileMenu}
          >
            Reviews
          </a>

          <a
            href="#contact"
            onClick={closeMobileMenu}
          >
            Contact
          </a>

        </nav>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

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


      {/* =====================================================
          PRODUCTS
      ===================================================== */}

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
            images={[
              "/images/kaju-1.jpeg",
              "/images/kaju-2.jpeg",
              "/images/kaju-3.jpeg"
            ]}
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
            images={[
              "/images/badam-1.jpeg",
              "/images/badam-2.jpeg",
              "/images/badam-3.jpeg"
            ]}
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
            images={[
              "/images/pista-1.jpeg",
              "/images/pista-2.jpeg",
              "/images/pista-3.jpeg"
            ]}
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
            images={[
              "/images/khajur-1.jpeg",
              "/images/khajur-2.jpeg",
              "/images/khajur-3.jpeg"
            ]}
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
            images={[
              "/images/kismis-1.jpeg",
              "/images/kismis-2.jpeg",
              "/images/kismis-3.jpeg"
            ]}
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
            images={[
              "/images/akhroot-1.jpeg",
              "/images/akhroot-2.jpeg",
              "/images/akhroot-3.jpeg"
            ]}
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
            images={[
              "/images/alsi-1.jpeg",
              "/images/alsi-2.jpeg",
              "/images/alsi-3.jpeg"
            ]}
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
            images={[
              "/images/anjeer-1.jpeg",
              "/images/anjeer-2.jpeg",
              "/images/anjeer-3.jpeg"
            ]}
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
            images={[
              "/images/makhana-1.jpeg",
              "/images/makhana-2.jpeg",
              "/images/makhana-3.jpeg"
            ]}
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
            images={[
              "/images/kharbooja-ke-beej-1.jpeg",
              "/images/kharbooja-ke-beej-2.jpeg",
              "/images/kharbooja-ke-beej-3.jpeg"
            ]}
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
            images={[
              "/images/kaddu-ka-beej-1.jpeg",
              "/images/kaddu-ka-beej-2.jpeg",
              "/images/kaddu-ka-beej-3.jpeg"
            ]}
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
            images={[
              "/images/surajmukhi-ka-beej-1.jpeg",
              "/images/surajmukhi-ka-beej-2.jpeg",
              "/images/surajmukhi-ka-beej-3.jpeg"
            ]}
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
            images={[
              "/images/dry-fruit-mix-1.jpeg",
              "/images/dry-fruit-mix-2.jpeg",
              "/images/dry-fruit-mix-3.jpeg"
            ]}
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
            images={[
              "/images/seeds-mix-1.jpeg",
              "/images/seeds-mix-2.jpeg",
              "/images/seeds-mix-3.jpeg"
            ]}
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


      {/* =====================================================
          CART
      ===================================================== */}

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
                    Total: ₹
                    {item.price *
                      item.quantity}
                  </strong>

                </div>


                <div className="cart-actions">

                  <div className="cart-quantity">

                    <button
                      type="button"
                      className="cart-minus"
                      onClick={() =>
                        updateQuantity(
                          index,
                          -1
                        )
                      }
                    >
                      −
                    </button>


                    <b>
                      {item.quantity}
                    </b>


                    <button
                      type="button"
                      className="cart-plus"
                      onClick={() =>
                        updateQuantity(
                          index,
                          1
                        )
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


        {/* ===================================================
            CUSTOMER FORM
        =================================================== */}

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
                ₹
                {directProduct.price *
                  directProduct.quantity}
              </strong>

            </div>

          }


          {/* NAME */}

          <div
            className={
              `form-field ${
                errors.name
                  ? "has-error"
                  : ""
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
                errors.phone
                  ? "has-error"
                  : ""
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
                errors.pincode
                  ? "has-error"
                  : ""
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
                errors.city
                  ? "has-error"
                  : ""
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
                errors.state
                  ? "has-error"
                  : ""
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
                errors.address
                  ? "has-error"
                  : ""
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


      {/* =====================================================
          REVIEWS
      ===================================================== */}

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


      {/* =====================================================
          CONTACT
      ===================================================== */}

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


      {/* =====================================================
          FOOTER
      ===================================================== */}

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


      {/* =====================================================
          FLOATING WHATSAPP
      ===================================================== */}

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