import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./css/CheckoutSuccess.css";

/**
 * CheckoutSuccess component displays a success message when the checkout process is completed.
 * @param {Object} props - The component props.
 * @param {function} props.updateCartItemCount - Function to update the cart item count.
 * @param {Object} props.loggedInUser - The logged-in user object.
 */
const CheckoutSuccess = ({
  updateCartItemCount,
  loggedInUser,
  refreshLoggedInUser,
}) => {
  /**
   * Clears the user's cart in the database and updates the cart item count.
   * This effect runs after the component mounts.
   */
  useEffect(() => {
    const clearCart = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          await axios.delete(
            "https://users-server-2wv1.onrender.com/api/cart",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          updateCartItemCount();
          refreshLoggedInUser();
        }
      } catch (error) {
        alert("Error clearing cart. Please try again later.");
      }
    };

    clearCart();
  }, [updateCartItemCount, refreshLoggedInUser]);

  return (
    <div className="checkout-success-container">
      <h2>Checkout Success</h2>
      <p>
        Thank you for your purchase, {loggedInUser && loggedInUser.username}!
      </p>
      <p>Your order has been placed successfully.</p>
      <Link to="/" className="button">
        Continue Shopping
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
