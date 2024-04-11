import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Navbar.css";

const Navbar = ({ isLoggedIn, handleLogout, loggedInUser, cartItemCount }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const searchInputRef = useRef(null);
  const searchSuggestionsRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setAllProducts(response.data);
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() !== "") {
      const filteredSuggestions = allProducts.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    navigate(`/product/${suggestion.id}`);
    setSuggestions([]);
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleClickOutside = (event) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target) &&
      searchSuggestionsRef.current &&
      !searchSuggestionsRef.current.contains(event.target)
    ) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            ref={searchInputRef}
          />
          {suggestions.length > 0 && (
            <ul className="search-suggestions" ref={searchSuggestionsRef}>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.title}
                </li>
              ))}
            </ul>
          )}
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
