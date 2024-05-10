import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./css/ProductList.css";

/**
 * ProductList component displays a list of products.
 * It supports filtering by category and search query, as well as pagination.
 */
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query") || "";

  const { categoryName } = useParams();

  /**
   * Fetches products from the API based on the category name.
   * This effect runs whenever the category name changes.
   */
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let url = "https://fakestoreapi.com/products";
        if (categoryName) {
          url += `/category/${categoryName}`;
        }
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        alert("Error fetching products. Please try again later.");
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, [categoryName]);

  /**
   * Filters the products based on the search query.
   * This effect runs whenever the products or search query changes.
   */
  useEffect(() => {
    let filtered = products;
    if (searchQuery) {
      filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalProducts = filteredProducts.length;
  const hasMultiplePages = totalProducts > productsPerPage;

  return (
    <div>
      <div className="product-list">
        {isLoading ? (
          <p>Loading...</p>
        ) : currentProducts.length > 0 ? (
          currentProducts.map((product) => (
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
      {hasMultiplePages && (
        <div className="pagination">
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? "active" : ""}
          >
            Page 1
          </button>
          <button
            onClick={() => paginate(2)}
            disabled={currentPage === 2}
            className={currentPage === 2 ? "active" : ""}
          >
            Page 2
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
