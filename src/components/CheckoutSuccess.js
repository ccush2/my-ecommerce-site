import React from "react";
import { Link } from "react-router-dom";
import "./css/CheckoutSuccess.css";

const CheckoutSuccess = () => {
  return (
    <div className="checkout-success-container">
      <h2>Checkout Success</h2>
      <p>Thank you for your purchase!</p>
      <p>Your order has been placed successfully.</p>
      <Link to="/" className="button">
        Continue Shopping
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
