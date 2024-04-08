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
import "url";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    localStorage.removeItem("authToken");
  };

  const updateCartItemCount = () => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      const cartItems = JSON.parse(storedCartItems);
      const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartItemCount(totalItems);
    } else {
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
    updateCartItemCount();
  }, []);

  return (
    <Router>
      <div>
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
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
