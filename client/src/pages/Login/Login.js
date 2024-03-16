import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in...");
    try {
      // Using Axios for the POST request
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });

      // On successful login
      console.log("Login successful", response.data);
      navigate("/"); // Redirect to the home page
    } catch (error) {
      // Handle login errors
      if (error.response) {
        console.error("Login failed", error.response.data);
      } else if (error.request) {
        console.error("Login failed", error.request);
      } else {
        console.error("Login error:", error.message);
      }
    }
  };

  return (
    <div className="login-form-container">
      <form id="loginForm" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
