import React from "react";
import "../css/login.css";

function Login() {
  return (
    <div className="login-form-container">
      <form id="loginForm">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button className="button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Login;
