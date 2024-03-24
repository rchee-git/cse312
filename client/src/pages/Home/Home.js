import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Home() {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get("/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post("/posts", { content: postContent });
      console.log(response.data); // Log success message
      setPostContent(""); // Clear input field

      // Fetch updated posts after submission
      const updatedPosts = await axios.get("/posts");
      setPosts(updatedPosts.data);

      // Reset submitting state
      setSubmitting(false);
    } catch (error) {
      console.error("Error creating post:", error);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Recall</h1>
      <button className="button" id="logout">
        Logout
      </button>
      <h1>Public Page</h1>
      <div className="post-form">
        <form onSubmit={handleSubmit}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
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
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
