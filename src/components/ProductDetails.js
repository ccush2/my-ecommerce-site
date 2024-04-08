import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/ProductDetails.css";

const ProductDetails = ({ updateCartItemCount }) => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const storedCartItems = localStorage.getItem("cartItems");
      let cartItems = [];

      if (storedCartItems) {
        cartItems = JSON.parse(storedCartItems);
      }

      const existingItem = cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      updateCartItemCount();
    } else {
      navigate("/login");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details">
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
