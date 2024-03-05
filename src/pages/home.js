import React from "react";
import { Link } from "react-router-dom";
import "../css/home.css";

function Home() {
  return (
    <div>
      <h1>Recall</h1>
      <Link to="/login">
        <button class="button" id="login">
          Log In
        </button>
      </Link>
      <Link to="/register">
        <button class="button" id="regisster">
          Register
        </button>{" "}
      </Link>
    </div>
  );
}

export default Home;
