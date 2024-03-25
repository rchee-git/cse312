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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      console.log("Login successful", response.data);
      navigate("/home");
    } catch (error) {
      let errorMessage = "Login error: An unexpected error occurred.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.request) {
        errorMessage = "Login error: No response from server.";
      } else {
        errorMessage = error.message;
      }

      console.error(errorMessage);
      alert(errorMessage);
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
