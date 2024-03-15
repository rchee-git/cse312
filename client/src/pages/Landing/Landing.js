import React from "react";
import "./Landing.css"; // Assuming you'll have some CSS for styling

function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <nav className="navbar"></nav>
        <div className="hero-section">
          <h1>Welcome to Our Website!</h1>
          <p>Your go-to place for all your needs.</p>
        </div>
      </header>

      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>
          We are a company dedicated to providing the best services in the
          industry. Learn more about what we do and why we do it.
        </p>
      </section>

      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;
