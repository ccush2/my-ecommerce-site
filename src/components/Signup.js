import React, { useState } from "react";
import axios from "axios";
import "./css/Signup.css";

/**
 * Signup component handles user registration functionality.
 * @param {Object} props - The component props.
 * @param {function} props.handleLogin - Function to handle successful login after signup.
 */
const Signup = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Validates the input value based on specified rules.
   * @param {string} input - The input value to be validated.
   * @param {string} fieldName - The name of the input field.
   * @returns {string} The validated input value.
   */
  const validateInput = (input, fieldName) => {
    const minLength = 3;
    const maxLength = 20;
    const allowedCharacters = /^[a-zA-Z0-9@.]*$/;

    if (input.length < minLength || input.length > maxLength) {
      setError(
        `${fieldName} must be between ${minLength} and ${maxLength} characters long.`
      );
      return input;
    }

    if (!allowedCharacters.test(input)) {
      setError(
        `${fieldName} can only contain alphanumeric characters, @ and .`
      );
      return input;
    }

    setError("");
    return input.replace(/[^a-zA-Z0-9@.]/g, "");
  };

  /**
   * Handles input changes in the form fields.
   * @param {Object} e - The input change event.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        setEmail(validateInput(value, "Email"));
        break;
      case "username":
        setUsername(validateInput(value, "Username"));
        break;
      case "password":
        setPassword(validateInput(value, "Password"));
        break;
      case "firstname":
        setFirstname(validateInput(value, "First Name"));
        break;
      case "lastname":
        setLastname(validateInput(value, "Last Name"));
        break;
      default:
        break;
    }
  };

  /**
   * Handles the form submission for user registration.
   * @param {Object} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/signup", {
        email,
        username,
        password,
        firstname,
        lastname,
      });

      if (response.status === 201) {
        setSuccess("Signup successful. Logging in...");
        setError("");
        handleLogin(response.data.user);
      } else {
        setError("Signup failed. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      setError("Signup failed. Please try again later.");
    }

    setEmail("");
    setUsername("");
    setPassword("");
    setFirstname("");
    setLastname("");
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="firstname">First Name:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={firstname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Last Name:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={lastname}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
