import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Login.css";

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login form submitted");
    console.log("Username:", username);
    console.log("Password:", password);

    try {
      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });

      console.log("Login response:", response);

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem("authToken", token);
        console.log("Token stored in local storage:", token);

        handleLogin({ username });
        console.log("handleLogin function called with username:", username);

        navigate("/");
        console.log("Navigated to home page");
      } else {
        setError("Invalid username or password");
        console.log("Login failed with status:", response.status);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    }

    setUsername("");
    setPassword("");
  };

  console.log("Rendering Login component");

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
