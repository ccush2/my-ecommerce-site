import React from "react";
import { Link } from "react-router-dom";
import "./css/CheckoutError.css";

/**
 * CheckoutError component displays an error message when the checkout process fails.
 */
const CheckoutError = () => {
  return (
    <div className="checkout-error-container">
      <h2>Checkout Error</h2>
      <p>An error occurred during the checkout process.</p>
      <p>Please try again or contact support for assistance.</p>
      <Link to="/" className="button">
        Return to Home
      </Link>
    </div>
  );
};

export default CheckoutError;
