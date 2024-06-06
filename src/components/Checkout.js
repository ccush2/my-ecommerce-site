import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./css/Checkout.css";

const stripePromise = loadStripe(
  "pk_test_51P6zb0RqzXc9w0BmGtGog3cxbPnLBmlGDSV9TG3Vo37tJt3Cf5u3nEo5bzHqc8UyeGf7AP96GkgFbN62JXmUzpIV00HdDOsOBI"
);

/**
 * Checkout component handles the checkout process using Stripe.
 */
const Checkout = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  /**
   * Fetches the client secret from the server when the component mounts.
   */
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
    } else {
      fetch("https://users-server-2wv1.onrender.com/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setClientSecret(data.clientSecret))
        .catch(() => {
          setErrorMessage(
            "Error setting up the payment. Please try again later."
          );
        });
    }
  }, [navigate]);

  /**
   * Stripe appearance options.
   */
  const appearance = {
    theme: "stripe",
  };

  /**
   * Stripe Elements options.
   */
  const options = {
    clientSecret,
    appearance,
  };

  /**
   * Handles the payment result.
   * @param {Object} result - The payment result from Stripe.
   */
  const handlePaymentResult = (result) => {
    if (result.error) {
      navigate("/checkout-error");
    } else {
      localStorage.removeItem("cartItems");
      navigate("/checkout-success");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm onPaymentResult={handlePaymentResult} />
        </Elements>
      )}
    </div>
  );
};

export default Checkout;
