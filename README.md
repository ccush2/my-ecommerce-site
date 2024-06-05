# ProductsPlus - E-commerce Website

ProductsPlus is an e-commerce website that allows users to browse and purchase products online. The website is deployed and can be accessed at https://my-ecommerce-site-d5at.onrender.com

## Description

ProductsPlus is a full-featured e-commerce platform that provides a seamless shopping experience for users. It offers a wide range of products across different categories, including electronics, jewelry, men's clothing, and women's clothing. Users can easily browse products, view detailed product information, add items to their cart, and securely complete the checkout process using Stripe payment integration.

## Features

- User Authentication:

  - Users can create an account, log in, and log out.
  - User information is securely stored and authenticated using JWT tokens.
  - Profile page allows users to view and delete their account.

- Product Catalog:

  - Display a list of products with images, titles, and prices.
  - Product details page shows additional information and allows adding items to the cart.
  - Search functionality enables users to find products based on keywords.
  - Category-based filtering helps users narrow down their product selection.
  - Pagination improves performance and user experience for large product catalogs.

- Shopping Cart:

  - Users can add products to their cart, update quantities, and remove items.
  - Cart icon in the navigation bar displays the current number of items in the cart.
  - Cart page shows a summary of selected products, total price, and allows proceeding to checkout.

- Checkout Process:

  - Secure checkout process powered by Stripe payment integration.
  - Users can enter their payment details and complete the purchase.
  - Order confirmation page displays a success message after a successful payment.
  - Error handling for failed payments with appropriate error messages.

- Responsive Design:
  - The website is fully responsive and optimized for various screen sizes and devices.
  - Mobile-friendly navigation menu and layout adjustments ensure a seamless experience on smaller screens.

These features were chosen to provide a comprehensive and user-friendly e-commerce experience. The combination of a product catalog, shopping cart, secure checkout, and user authentication ensures that users can easily browse, select, and purchase products with confidence. The responsive design guarantees accessibility across different devices, enhancing the overall user experience.

## Testing

The project includes a suite of unit tests to ensure the reliability and stability of the application. The tests are located in the `__tests__` directory.

To run the tests, follow these steps:

1. Make sure you have the necessary dependencies installed by running `npm install` in the project root directory.
2. Run the command `npm test` to execute the test suite.

The tests cover various components and functionality of the application, including the App component, Cart component, and API interactions.

## User Flow

1. User visits the ProductsPlus website.
2. User browses the product catalog, either by scrolling through the list or using the search functionality.
3. User clicks on a product to view its details on the product details page.
4. User adds the desired product to their cart by clicking the "Add to Cart" button.
5. User can view their cart by clicking on the cart icon in the navigation bar.
6. On the cart page, the user can update quantities or remove items from their cart.
7. User proceeds to checkout by clicking the "Proceed to Checkout" button.
8. User enters their payment details on the checkout page and completes the purchase.
9. Upon successful payment, the user is redirected to the order confirmation page.
10. User can log in or create an account to view their profile and manage their account details.

## Mock Payment Instructions

CVC: Any 3 digits for all test cards.
Expiration Date: Any future date for all test cards.
Test Card Numbers:

- Successful payment: 4242-4242-4242-4242
- Incorrect number decline: 4242-4242-4242-4241
- Generic decline: 4000-0000-0000-0002
- Insufficient funds decline: 4000-0000-0000-9995
- Expired card decline: 4000-0000-0000-0069
- Incorrect CVC decline: 4000-0000-0000-0127

## API Integration

ProductsPlus integrates with the Fake Store API (https://fakestoreapi.com/) and a custom API.

Fake Store API:
The Fake Store API is used to retrieve product data, including product listings, categories, and individual product details. The website makes use of Axios, a popular JavaScript library, to send HTTP requests to the Fake Store API endpoints and handle the responses. The API calls are made from various components, such as the product list and product details pages, to fetch the necessary data and display it to the user.
The following Fake Store API endpoints are used:

- GET /products: Retrieves a list of all products.
- GET /products/category/:categoryName: Retrieves products based on the specified category name.
- GET /products/:id: Retrieves details of a specific product based on its ID.

Custom API:
In addition to the Fake Store API, ProductsPlus utilizes a custom-built API to handle user authentication, user management, and cart functionality. The custom API is built using JSON Server and Express.js.
The custom API provides the following endpoints:
User Authentication

- POST /login: Authenticates user credentials and generates a JWT token.
- POST /signup: Creates a new user account.
- POST /logout: Logs out the user by removing the token from the user's profile.

User Management

- GET /api/users/:userId: Retrieves user profile information.
- DELETE /api/users/:userId: Deletes a user account.

Cart Functionality

- POST /api/cart: Adds a product to the user's cart.
- GET /api/cart: Retrieves the user's cart items with product details.
- PUT /api/cart/:productId: Updates the quantity of a product in the user's cart.
- DELETE /api/cart/:productId: Removes a product from the user's cart.
- DELETE /api/cart: Clears the user's cart.

Payment Processing

- POST /create-payment-intent: Creates a payment intent using the Stripe API.

## Technology Stack

The ProductsPlus website is built using the following technologies:

- React: JavaScript library for building user interfaces.
- React Router: Library for handling client-side routing in React applications.
- Redux: State management library for managing application state.
- Axios: Promise-based HTTP client for making API requests.
- Stripe: Payment processing platform for handling secure online payments.
- CSS: Styling and layout of the website.
- Jest: JavaScript testing framework for unit testing.
- React Testing Library: Library for testing React components.

These technologies were chosen for their robustness, efficiency, and wide adoption in the web development community. React provides a component-based architecture that enhances code reusability and maintainability. React Router enables smooth client-side navigation, while Redux simplifies state management across the application. Axios simplifies making API requests, and Stripe ensures secure payment processing. Jest and React Testing Library facilitate thorough testing of the application's components and functionality.
