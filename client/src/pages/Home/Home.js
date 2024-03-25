import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/checkAuth`,
          {},
          {
            withCredentials: true,
          }
        );

        if (response.data == "bad") {
          navigate("/");
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/posts/home`
    );
    console.log(response.data);
    // e.preventDefault();
    // setSubmitting(true);

    // try {
    //   // Add the new post to the beginning of the posts array immediately
    //   setPosts([{ username: "guest", content: postContent }, ...posts]);

    //   // Clear the input after submission
    //   setPostContent("");

    //   // Emulate delay before resetting submitting state
    //   setTimeout(() => {
    //     setSubmitting(false);
    //   }, 1000); // Adjust as needed
    // } catch (error) {
    //   console.error("Error creating post:", error);
    //   setSubmitting(false);
    // }
  };

  return (
    <div>
      <h1>Recall</h1>
      <div className="post-form">
        <form onSubmit={handleSubmit}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Post Something!!!"
            required
          ></textarea>
          <button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
      <div className="post-list">
        {posts.map((post, index) => (
          <div key={index} className="post">
            <p>{post.username}: {post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
