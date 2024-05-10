import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/ProductDetails.css";

/**
 * ProductDetails component displays the details of a selected product.
 * @param {Object} props - The component props.
 * @param {function} props.updateCartItemCount - Function to update the cart item count.
 */
const ProductDetails = ({ updateCartItemCount }) => {
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  /**
   * Fetches the product details from the API when the component mounts.
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        setErrorMessage(
          "Failed to fetch product details. Please try again later."
        );
      }
    };

    fetchProduct();
  }, [id]);

  /**
   * Adds the product to the user's cart.
   */
  const addToCart = async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        await axios.post(
          "/api/cart",
          {
            productId: product.id,
            quantity: 1,
            title: product.title,
            price: product.price,
            image: product.image,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        updateCartItemCount();
      } catch (error) {
        setErrorMessage("Failed to add item to cart. Please try again later.");
      }
    } else {
      navigate("/login");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="product-image">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p className="product-price">Price: ${product.price}</p>
        <p>Category: {product.category}</p>
        <button className="add-to-cart" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
