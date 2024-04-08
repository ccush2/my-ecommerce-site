import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Navbar.css";

const Navbar = ({ isLoggedIn, handleLogout, loggedInUser, cartItemCount }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">ProductsPlus</Link>
      </div>

      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`navbar-links ${isMenuVisible ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={() => setIsMenuVisible(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/category/electronics"
            onClick={() => setIsMenuVisible(false)}
          >
            Electronics
          </Link>
        </li>
        <li>
          <Link to="/category/jewelery" onClick={() => setIsMenuVisible(false)}>
            Jewelry
          </Link>
        </li>
        <li>
          <Link
            to="/category/men's%20clothing"
            onClick={() => setIsMenuVisible(false)}
          >
            Men's Clothing
          </Link>
        </li>
        <li>
          <Link
            to="/category/women's%20clothing"
            onClick={() => setIsMenuVisible(false)}
          >
            Women's Clothing
          </Link>
        </li>
      </ul>

      <div className={`navbar-search ${isMenuVisible ? "active" : ""}`}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      <ul className="navbar-links navbar-links-right">
        <li>
          <Link to="/cart" className="cart-link">
            Cart
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>
        </li>
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <span className="logged-in-user">
                Welcome, {loggedInUser && loggedInUser.username}
              </span>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
