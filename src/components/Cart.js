import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Cart.css";

/**
 * Cart component renders the shopping cart and handles cart-related functionality.
 * @param {Object} props - The component props.
 * @param {function} props.updateCartItemCount - Function to update the cart item count.
 */
const Cart = ({ updateCartItemCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  /**
   * Fetches cart items from the server.
   */
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await axios.get(
            "https://users-server-2wv1.onrender.com/api/cart",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCartItems(response.data);
          setErrorMessage("");
        } else {
          setCartItems([]);
        }
      } catch (error) {
        setErrorMessage("Error fetching cart items. Please try again later.");
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, []);

  /**
   * Updates the quantity of a cart item on the server.
   * @param {number} productId - The ID of the product to update.
   * @param {number} quantity - The new quantity of the product.
   */
  const updateCartItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const response = await axios.put(
          `https://users-server-2wv1.onrender.com/api/cart/${productId}`,
          { quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(response.data);
        updateCartItemCount();
      }
    } catch (error) {
      setErrorMessage("Error updating cart item. Please try again later.");
    }
  };

  /**
   * Removes a cart item from the server.
   * @param {number} productId - The ID of the product to remove.
   */
  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await axios.delete(
          `https://users-server-2wv1.onrender.com/api/cart/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const response = await axios.get(
          "https://users-server-2wv1.onrender.com/api/cart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCartItems(response.data);
        updateCartItemCount();
      }
    } catch (error) {
      setErrorMessage("Error removing item from cart. Please try again later.");
    }
  };

  /**
   * Clears the entire cart on the server.
   */
  const clearCart = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await axios.delete("https://users-server-2wv1.onrender.com/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems([]);
        updateCartItemCount();
      }
    } catch (error) {
      setErrorMessage("Error clearing cart. Please try again later.");
    }
  };

  /**
   * Navigates to the checkout page if the user is logged in, otherwise navigates to the login page.
   */
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
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-cart-icon">&#128722;</span>
          <p>Your cart is empty.</p>
          <Link to="/">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.productId} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>Price: ${item.price}</p>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        updateCartItem(
                          item.productId,
                          Math.max(item.quantity - 1, 1)
                        )
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateCartItem(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <div className="summary-info">
              <p>
                Total Items:{" "}
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </p>
              <p>
                Total Price: $
                {cartItems
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
            <div className="button-group">
              <button onClick={clearCart}>Clear Cart</button>
              <button onClick={proceedToCheckout} className="checkout-button">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
