import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import CheckoutSuccess from "./components/CheckoutSuccess";
import CheckoutError from "./components/CheckoutError";
import Profile from "./components/Profile";
import axios from "axios";

/**
 * The main application component.
 * Handles user authentication, cart functionality, and routing.
 */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Handles user login.
   * @param {Object} user - The logged-in user object.
   */
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setLoggedInUser({ id: user.id, username: user.username });
  };

  /**
   * Handles user logout.
   */
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await axios.post("/logout", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsLoggedIn(false);
        setLoggedInUser(null);
        localStorage.removeItem("authToken");
      } else {
        setErrorMessage("You are already logged out.");
      }
    } catch (error) {
      setErrorMessage("Logout failed. Please try again.");
    }
  };

  /**
   * Updates the logged-in user state.
   * @param {Object} user - The updated user object.
   */
  const updateLoggedInUser = (user) => {
    setLoggedInUser(user);
    setIsLoggedIn(user !== null);
  };

  /**
   * Updates the cart item count.
   */
  const updateCartItemCount = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const response = await axios.get("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartItems = response.data;
        const totalItems = cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartItemCount(totalItems);
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      setErrorMessage(
        "Failed to update cart item count. Please try again later."
      );
    }
  };

  /**
   * Checks if the user is logged in on component mount.
   */
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      fetchLoggedInUser(token);
    }
    updateCartItemCount();
  }, []);

  /**
   * Fetches the logged-in user's information from the server.
   * @param {string} token - The authentication token.
   */
  const fetchLoggedInUser = async (token) => {
    try {
      const response = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoggedInUser(response.data);
    } catch (error) {
      setErrorMessage("Failed to fetch logged-in user. Please try again.");
    }
  };

  return (
    <Router>
      <div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <Navbar
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          loggedInUser={loggedInUser}
          cartItemCount={cartItemCount}
        />
        <Routes>
          <Route exact path="/" element={<ProductList />} />
          <Route path="/search" element={<ProductList />} />
          <Route path="/category/:categoryName" element={<ProductList />} />
          <Route
            path="/product/:id"
            element={
              <ProductDetails updateCartItemCount={updateCartItemCount} />
            }
          />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route
            path="/signup"
            element={<Signup handleLogin={handleLogin} />}
          />
          <Route
            path="/cart"
            element={<Cart updateCartItemCount={updateCartItemCount} />}
          />
          <Route
            path="/profile"
            element={
              <Profile
                loggedInUser={loggedInUser}
                handleLogout={handleLogout}
                updateLoggedInUser={updateLoggedInUser}
              />
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/checkout-success"
            element={
              <CheckoutSuccess updateCartItemCount={updateCartItemCount} />
            }
          />
          <Route path="/checkout-error" element={<CheckoutError />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
