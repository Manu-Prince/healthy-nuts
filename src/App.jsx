import { useState, useEffect, useRef } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom"
import { FaWhatsapp } from "react-icons/fa"
import "./App.css"


/* =========================================================
   WHATSAPP
   ========================================================= */

function openWhatsApp(message) {

  const phoneNumber = "918448070193"

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

  const [selectedQuantity, setSelectedQuantity] = useState(1)

  const [autoPlayPaused, setAutoPlayPaused] = useState(false)

  const touchStartX = useRef(null)


  const cartItem = cart.find(
    item => item.id === `${name}-${weight}`
  )


  const quantity =
    cartItem
      ? cartItem.quantity
      : selectedQuantity


  /* =========================================================
     AUTOMATIC IMAGE SLIDER
     ========================================================= */

  useEffect(() => {

    if (images.length <= 1) {
      return
    }

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

  }, [images.length, autoPlayPaused])


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
     MOUSE
     ========================================================= */

  function handleMouseEnter() {
    setAutoPlayPaused(true)
  }

  function handleMouseLeave() {
    setAutoPlayPaused(false)
  }


  /* =========================================================
     IMAGE CLICK
     ========================================================= */

  function handleImageClick() {
    setAutoPlayPaused(prev => !prev)
  }


  /* =========================================================
     TOUCH START
     ========================================================= */

  function handleTouchStart(e) {

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

    if (difference > 50) {
      nextImage()
    }

    if (difference < -50) {
      previousImage()
    }

    touchStartX.current = null

    setTimeout(() => {
      setAutoPlayPaused(false)
    }, 1500)
  }


  /* =========================================================
     PRODUCT PLUS
     ========================================================= */

  function handleProductPlus() {

    if (cartItem) {

      updateProductQuantity(
        `${name}-${weight}`,
        1
      )

      return
    }

    setSelectedQuantity(prev =>
      prev + 1
    )
  }


  /* =========================================================
     PRODUCT MINUS
     ========================================================= */

  function handleProductMinus() {

    if (cartItem) {

      updateProductQuantity(
        `${name}-${weight}`,
        -1
      )

      return
    }

    setSelectedQuantity(prev =>
      Math.max(1, prev - 1)
    )
  }


  /* =========================================================
     ADD TO CART
     ========================================================= */

  function handleAddToCart() {

    if (cartItem) {

      alert(
        `${name} (${weight}) is already in cart. Use + / - buttons to change quantity.`
      )

      return
    }

    addToCart({

      id: `${name}-${weight}`,

      name,

      weight,

      price: prices[weight],

      quantity: selectedQuantity

    })
  }


  /* =========================================================
     DIRECT ORDER
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


        {/* PAUSE INDICATOR */}

        {
          autoPlayPaused &&

          <div className="slider-pause-indicator">
            ⏸
          </div>
        }


        {/* PREVIOUS */}

        {
          images.length > 1 &&

          <button
            type="button"

            className="image-slider-button image-slider-prev"

            onClick={(e) => {

              e.stopPropagation()

              previousImage()

            }}

            aria-label="Previous image"
          >
            ‹
          </button>
        }


        {/* NEXT */}

        {
          images.length > 1 &&

          <button
            type="button"

            className="image-slider-button image-slider-next"

            onClick={(e) => {

              e.stopPropagation()

              nextImage()

            }}

            aria-label="Next image"
          >
            ›
          </button>
        }


        {/* DOTS */}

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

                  aria-label={`Show image ${index + 1}`}
                />

              ))
            }

          </div>
        }

      </div>


      {/* PRODUCT NAME */}

      <h3>
        {name}
      </h3>


      {/* DESCRIPTION */}

      <p>
        {description}
      </p>


      {/* WEIGHT */}

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


      {/* PRICE */}

      <h4>
        Price per pack: ₹{prices[weight]}
      </h4>


      {/* QUANTITY */}

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


      <p className="product-quantity-label">
        Quantity: {quantity}
      </p>


      {/* ADD TO CART */}

      <button
        type="button"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>


      {/* DIRECT ORDER */}

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
   HEADER
   ========================================================= */

function Header({
  cartItemCount,
  mobileMenuOpen,
  toggleMobileMenu,
  closeMobileMenu,
  goToSection
}) {

  const navigate = useNavigate()


  function handleHome() {

    closeMobileMenu()

    navigate("/")

    window.setTimeout(() => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })

    }, 50)
  }


  return (

    <header className="header">

      <div className="logo-section">

        <button
          type="button"
          className="logo-button"
          onClick={handleHome}
          aria-label="Go to Healthy Nuts home"
        >

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

        </button>

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

        <button
          type="button"
          className="nav-link-button"
          onClick={handleHome}
        >
          Home
        </button>


        <button
          type="button"
          className="nav-link-button"
          onClick={() => goToSection("products")}
        >
          Products
        </button>


        <Link
          to="/cart"
          className="cart-nav-link"
          onClick={closeMobileMenu}
        >
          Cart
          <span className="header-cart-count">
            {cartItemCount}
          </span>
        </Link>


        <button
          type="button"
          className="nav-link-button"
          onClick={() => goToSection("reviews")}
        >
          Reviews
        </button>


        <button
          type="button"
          className="nav-link-button"
          onClick={() => goToSection("contact")}
        >
          Contact
        </button>

      </nav>

    </header>
  )
}


/* =========================================================
   MOBILE CART BAR
   ========================================================= */

function MobileCartBar({
  cartItemCount,
  cartTotal
}) {

  if (cartItemCount === 0) {
    return null
  }


  return (

    <Link
      to="/cart"
      className="mobile-cart-bar"
    >

      <div className="mobile-cart-icon">
        🛒
      </div>

      <div className="mobile-cart-info">

        <strong>
          View Cart
        </strong>

        <span>
          {cartItemCount}{" "}
          {cartItemCount === 1
            ? "item"
            : "items"}
        </span>

      </div>

      <div className="mobile-cart-total">
        ₹{cartTotal}
      </div>

      <div className="mobile-cart-arrow">
        →
      </div>

    </Link>
  )
}


/* =========================================================
   HOME PAGE
   ========================================================= */

function HomePage({
  cart,
  addToCart,
  directOrder,
  updateProductQuantity,
  openWhatsApp
}) {

  return (

    <>

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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
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
            updateProductQuantity={updateProductQuantity}
          />

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
          📞 +91-8448070193
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

    </>
  )
}


/* =========================================================
   CART PAGE
   ========================================================= */

function CartPage({
  cart,
  customer,
  errors,
  states,
  directProduct,
  handleCustomerChange,
  updateQuantity,
  removeItem,
  subtotal,
  deliveryCharge,
  finalTotal,
  sendDirectOrder,
  orderCartWhatsApp
}) {

  const navigate = useNavigate()


  return (

    <main className="cart-page">

      <div className="cart-page-header">

        <span className="section-label">
          SHOPPING BAG
        </span>

        <h2>
          Your Cart
        </h2>

        <p>
          Review your order and enter your
          delivery details below.
        </p>

      </div>


      {/* =====================================================
          EMPTY CART
      ===================================================== */}

      {
        cart.length === 0 && !directProduct &&

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h3>
            Your cart is empty
          </h3>

          <p>
            Add some premium dry fruits
            to get started.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>

        </div>
      }


      {/* =====================================================
          DIRECT ORDER
      ===================================================== */}

      {
        directProduct &&

        <div className="direct-order-preview cart-direct-preview">

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


      {/* =====================================================
          CART ITEMS
      ===================================================== */}

      {
        cart.length > 0 &&

        <div className="cart-items-container">

          {
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
                      aria-label={`Decrease ${item.name} quantity`}
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
                      aria-label={`Increase ${item.name} quantity`}
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

        </div>
      }


      {/* =====================================================
          CART SUMMARY
      ===================================================== */}

      {
        cart.length > 0 &&

        <div className="cart-summary">

          <div>
            <span>
              Items
            </span>

            <strong>
              {cart.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              )}
            </strong>
          </div>


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


      {/* =====================================================
          CUSTOMER DETAILS
      ===================================================== */}

      {
        (cart.length > 0 || directProduct) &&

        <div
          className="customer-form cart-customer-form"
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


          {/* DIRECT ORDER */}

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


          {/* CART ORDER */}

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
      }

    </main>
  )
}


/* =========================================================
   ORDER SUCCESS
   ========================================================= */

function OrderSuccess({
  resetAfterSuccess
}) {

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
        onClick={resetAfterSuccess}
      >
        Continue Shopping
      </button>

    </div>
  )
}


/* =========================================================
   APP CONTENT
   ========================================================= */

function AppContent() {

  const navigate = useNavigate()

  const location = useLocation()


  /* =========================================================
     CART
     ========================================================= */

  const [cart, setCart] = useState([])


  /* =========================================================
     ORDER SUCCESS
     ========================================================= */

  const [orderSuccess, setOrderSuccess] =
    useState(false)


  /* =========================================================
     DIRECT PRODUCT
     ========================================================= */

  const [directProduct, setDirectProduct] =
    useState(null)


  /* =========================================================
     MOBILE MENU
     ========================================================= */

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)


  /* =========================================================
     CUSTOMER
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
     ERRORS
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
     TOTAL ITEM COUNT
     ========================================================= */

  const cartItemCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    )


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
     SECTION NAVIGATION
     ========================================================= */

  function goToSection(id) {

    closeMobileMenu()

    if (location.pathname !== "/") {

      navigate("/")

      window.setTimeout(() => {

        document
          .getElementById(id)
          ?.scrollIntoView({
            behavior: "smooth"
          })

      }, 100)

      return
    }

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth"
      })
  }


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
     CUSTOMER CHANGE
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


    setCart(prev => [

      ...prev,

      product

    ])
  }


  /* =========================================================
     UPDATE PRODUCT QUANTITY
     ========================================================= */

  function updateProductQuantity(
    id,
    amount
  ) {

    setCart(prev => {

      const existing =
        prev.find(
          item => item.id === id
        )


      if (!existing) {
        return prev
      }


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

    navigate("/cart")

    window.setTimeout(() => {

      document
        .getElementById("customer-details")
        ?.scrollIntoView({
          behavior: "smooth"
        })

    }, 150)
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
     DIRECT ORDER WHATSAPP
     ========================================================= */

  function sendDirectOrder() {

    if (!validateCustomer()) {

      document
        .getElementById("customer-details")
        ?.scrollIntoView({
          behavior: "smooth"
        })

      return
    }


    if (!directProduct) {
      return
    }


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
        .getElementById("customer-details")
        ?.scrollIntoView({
          behavior: "smooth"
        })

      return
    }


    if (cart.length === 0) {
      return
    }


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
     RESET AFTER SUCCESS
     ========================================================= */

  function resetAfterSuccess() {

    setOrderSuccess(false)

    setDirectProduct(null)

    setCart([])

    setCustomer({

      name: "",
      phone: "",
      pincode: "",
      city: "",
      state: "",
      address: ""

    })

    setErrors({})

    navigate("/")

    window.setTimeout(() => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })

    }, 100)
  }


  /* =========================================================
     SUCCESS SCREEN
     ========================================================= */

  if (orderSuccess) {

    return (

      <OrderSuccess
        resetAfterSuccess={resetAfterSuccess}
      />
    )
  }


  /* =========================================================
     MAIN APP
     ========================================================= */

  return (

    <div className="app">

      <Header
        cartItemCount={cartItemCount}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        closeMobileMenu={closeMobileMenu}
        goToSection={goToSection}
      />


      <Routes>

        <Route
          path="/"
          element={
            <HomePage
              cart={cart}
              addToCart={addToCart}
              directOrder={directOrder}
              updateProductQuantity={
                updateProductQuantity
              }
              openWhatsApp={openWhatsApp}
            />
          }
        />


        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              customer={customer}
              errors={errors}
              states={states}
              directProduct={directProduct}
              handleCustomerChange={
                handleCustomerChange
              }
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              subtotal={subtotal}
              deliveryCharge={deliveryCharge}
              finalTotal={finalTotal}
              sendDirectOrder={
                sendDirectOrder
              }
              orderCartWhatsApp={
                orderCartWhatsApp
              }
            />
          }
        />

      </Routes>


      {/* MOBILE CART BAR */}

      {
        location.pathname !== "/cart" &&

        <MobileCartBar
          cartItemCount={cartItemCount}
          cartTotal={finalTotal()}
        />
      }


      {/* FLOATING WHATSAPP */}

      {
        location.pathname !== "/cart" &&

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
      }

    </div>
  )
}


/* =========================================================
   ROOT APP
   ========================================================= */

function App() {

  return (

    <BrowserRouter>

      <AppContent />

    </BrowserRouter>
  )
}


export default App