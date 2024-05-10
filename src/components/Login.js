import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Login.css";

/**
 * Login component handles user authentication and login functionality.
 * @param {Object} props - The component props.
 * @param {function} props.handleLogin - Function to handle successful login.
 */
const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /**
   * Validates the input value based on specified rules.
   * @param {string} input - The input value to be validated.
   * @param {string} fieldName - The name of the input field.
   * @returns {string} The validated input value.
   */
  const validateInput = (input, fieldName) => {
    const minLength = 3;
    const maxLength = 20;
    const allowedCharacters = /^[a-zA-Z0-9]*$/;

    if (input.length < minLength || input.length > maxLength) {
      setError(
        `${fieldName} must be between ${minLength} and ${maxLength} characters long.`
      );
      return input;
    }

    if (!allowedCharacters.test(input)) {
      setError(`${fieldName} can only contain alphanumeric characters.`);
      return input;
    }

    setError("");
    return input.replace(/[^a-zA-Z0-9]/g, "");
  };

  /**
   * Handles input changes in the username and password fields.
   * @param {Object} e - The input change event.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(validateInput(value, "Username"));
    } else if (name === "password") {
      setPassword(validateInput(value, "Password"));
    }
  };

  /**
   * Handles the form submission for login.
   * @param {Object} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const { token, id, username } = response.data;
        localStorage.setItem("authToken", token);

        handleLogin({ id, username });
        navigate("/");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }

    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
