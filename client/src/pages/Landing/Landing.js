import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import Image from "../../assets/corporate.jpg";

function Landing() {
  return (
    <div>
      <img
        src={Image}
        alt="Description"
        style={{ width: "200px", height: "auto" }}
      />
      <h1>Recall</h1>

      <Link to="/login">
        <button class="button" id="login">
          Log In
        </button>
      </Link>
      <Link to="/register">
        <button class="button" id="regisster">
          Register
        </button>
      </Link>
    </div>
  );
}

export default Landing;
