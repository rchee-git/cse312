import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in...");
    try {
      // Using Axios for the POST request
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      // On successful login
      console.log("Login successful", response.data);
      navigate("/home"); // Redirect to the home page
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
          <label htmlFor="username">Username</label>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
