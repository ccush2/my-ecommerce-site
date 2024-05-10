import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Navbar.css";

/**
 * Navbar component renders the navigation bar with search functionality, cart, and user authentication links.
 * @param {Object} props - The component props.
 * @param {boolean} props.isLoggedIn - Indicates if the user is logged in.
 * @param {function} props.handleLogout - Function to handle user logout.
 * @param {Object} props.loggedInUser - The logged-in user object.
 * @param {number} props.cartItemCount - The number of items in the user's cart.
 */
const Navbar = ({ isLoggedIn, handleLogout, loggedInUser, cartItemCount }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const searchInputRef = useRef(null);
  const searchSuggestionsRef = useRef(null);

  const navigate = useNavigate();

  /**
   * Fetches all products from the API and stores them in state.
   * This effect runs only once when the component mounts.
   */
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setAllProducts(response.data);
      } catch (error) {
        alert("Error fetching products. Please try again later.");
      }
    };

    fetchAllProducts();
  }, []);

  /**
   * Handles changes in the search input field.
   * Updates the search query and filters the product suggestions based on the query.
   * @param {Object} e - The input change event.
   */
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

  /**
   * Handles the search form submission.
   * Navigates to the search results page with the current search query.
   * @param {Object} e - The form submission event.
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSuggestions([]);
  };

  /**
   * Handles the click on a search suggestion.
   * Updates the search query and navigates to the product details page.
   * @param {Object} suggestion - The clicked product suggestion object.
   */
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    navigate(`/product/${suggestion.id}`);
    setSuggestions([]);
  };

  /**
   * Toggles the visibility of the navigation menu for small screens.
   */
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  /**
   * Handles clicks outside the search input and suggestions.
   * Clears the search suggestions when the user clicks outside.
   * @param {Object} event - The click event.
   */
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

  /**
   * Adds an event listener for clicks outside the search input and suggestions.
   * Removes the event listener when the component unmounts.
   */
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

      <ul
        className={`navbar-links navbar-links-right ${
          isMenuVisible ? "active" : ""
        }`}
      >
        {isLoggedIn && (
          <li>
            <Link to="/cart" className="cart-link">
              Cart
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </Link>
          </li>
        )}
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
              <Link to="/profile" className="profile-link">
                Welcome, {loggedInUser && loggedInUser.username}
              </Link>
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
