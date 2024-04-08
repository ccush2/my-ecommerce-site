import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./css/ProductList.css";

/**
 * ProductList component displays a list of products based on the selected category or search query.
 */
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Get the current location and search params
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query") || "";

  // Get the category name from URL params
  const { categoryName } = useParams();

  useEffect(() => {
    /**
     * Fetches products from the API based on the selected category.
     */
    const fetchProducts = async () => {
      try {
        let url = "https://fakestoreapi.com/products";
        if (categoryName) {
          url += `/category/${categoryName}`;
        }
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryName]);

  useEffect(() => {
    /**
     * Filters products based on the search query.
     */
    let filtered = products;
    if (searchQuery) {
      filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  return (
    <div>
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-item">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.title} />
                <h3>{product.title}</h3>
                <p>Price: ${product.price}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
