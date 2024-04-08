import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Cart.css";

const Cart = ({ updateCartItemCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const storedCartItems = localStorage.getItem("cartItems");
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const removeFromCart = (productId) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const updatedCartItems = cartItems.filter(
        (item) => item.id !== productId
      );
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      updateCartItemCount();
    } else {
      navigate("/login");
    }
  };

  const clearCart = () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      setCartItems([]);
      localStorage.removeItem("cartItems");
      updateCartItemCount();
    } else {
      navigate("/login");
    }
  };

  const proceedToCheckout = () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="cart-container">
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <p>
              Total Items:{" "}
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </p>
            <p>
              Total Price: $
              {cartItems
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </p>
            <button onClick={clearCart}>Clear Cart</button>
            <button onClick={proceedToCheckout} className="checkout-button">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
