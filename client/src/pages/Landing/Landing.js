import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import Image from "../../assets/corporate.jpg";

import steak_potato from "../../assets/corporate.jpg";
import pot from "../../assets/corporate1.jpg";
import fries from "../../assets/corporate2.jpg";
import oko from "../../assets/corporate3.jpg";
import egg from "../../assets/corporate4.jpg";

function Landing() {
  const buttonStyle = {
    color: "black",
    backgroundColor: "orange", // Change the color as needed
    border: "none",
    fontWeight: "600",
    padding: "10px 20px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "0 10px", // Adjust spacing between buttons
    cursor: "pointer",
    borderRadius: "50px", // This creates the pill shape
  };

  const buttonStyle1 = {
    backgroundColor: "white", // Change the color as needed
    border: "none",
    color: "black",
    fontWeight: "600",
    padding: "10px 20px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "0 10px", // Adjust spacing between buttons
    cursor: "pointer",
    borderRadius: "50px", // This creates the pill shape
  };

  const titleStyles = {
    fontWeight: "620",
    // font-family: "Sans-Serif",
    textAlign: "center",
    color: "BLACK",
    fontSize: "60px", // Adjust the size as you like
    width: " 80%",

    // margin: 50,
  };

  const titleStylesss = {
    fontWeight: "620",
    // font-family: "Sans-Serif",
    textAlign: "center",
    color: "white",
    backgroundColor: "black",
    fontSize: "40px", // Adjust the size as you like
    width: " 100%",
    paddingTop: 20,
    paddingBottom: 20,

    // margin: 50,
  };

  const foodImages = [
    { id: 1, src: steak_potato, alt: "Food 1" },
    { id: 2, src: pot, alt: "Food 2" },
    { id: 3, src: fries, alt: "Food 3" },
    { id: 4, src: oko, alt: "Food 4" },
    // Add more images as needed
  ];
  const FoodImage = ({ src, alt }) => {
    return (
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%", // Makes width responsive to the container size
          height: "auto", // Adjusts height to maintain aspect ratio
          maxHeight: 300, // Maximum height of the image
          objectFit: "cover", // Ensures the content is resized correctly
        }}
      />
    );
  };

  return (
    <div id="totalDiv">
      <h3
        style={{
          display: "flex",
          paddingTop: "20%",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "80px",
        }}
      >
        RECALL
      </h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {foodImages.map((image) => (
          <FoodImage key={image.id} src={image.src} alt={image.alt} />
        ))}
      </div>
      <br />
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center", // Center text horizontally within its block
          overflow: "hidden", // Prevents overflow of content
        }}
      >
        <div style={titleStyles}>
          SIGN UP FOR RECALL
          <div style={{ textAlign: "center", margin: "20px" }}>
            <Link to="/register" style={buttonStyle1}>
              Sign Up
            </Link>
            <Link to="/login" style={buttonStyle}>
              Login
            </Link>
          </div>
        </div>
        <h3 style={titleStylesss}>
          MORE ABOUT RECALL
          <br />
          <br />
          Recall is a dynamic communication platform dedicated to the avid
          conversationalist and the global explorer alike. At the heart of
          GlobalChat lies a profound belief that conversation transcends mere
          exchange of words, blossoming into an art form that shapes our social
          fabric and personal identity. It's a place where the echoes of diverse
          languages mingle with the vibrant spirit of modern dialogues, creating
          a rich mosaic of interactions that span the globe.
        </h3>

        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

export default Landing;
// function Landing() {
//   return (
//     <div className="container">
//       <div className="header">
//         <h1>Recall</h1>
//       </div>
//       <div className="hero">
//         <h2>Connect with the World Instantly</h2>
//         <p>
//           Join the conversation in GlobalChat, where the world comes to talk.
//         </p>
//       </div>
//       <img
//         src={Image}
//         alt="Description"
//         style={{ width: "100%", height: "auto" }}
//       />

//       <Link to="/login">
//         <button className="button" id="login">
//           Log In
//         </button>
//       </Link>
//       <Link to="/register">
//         <button className="button" id="regisster">
//           Register
//         </button>
//       </Link>
//       <div className="footer">
//         <p>© 2024 GlobalChat. All rights reserved.</p>
//       </div>
//     </div>
//   );
// }

// export default Landing;
