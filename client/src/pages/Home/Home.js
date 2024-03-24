import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Home() {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]); // Holds the list of posts
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Replace with your actual endpoint and adjust the data structure according to your backend
      const response = await axios.post("http://localhost:8080/api/posts", {
        content: postContent,
        username: "username", // Pass the username here, you may get it from the user session
      });
      setPosts([response.data, ...posts]); // Add the new post to the beginning of the posts array
      setPostContent(""); // Clear the input after submission
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Recall</h1>
      <h1>Private Page</h1>
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
            <p>
              {post.username}: {post.content}
            </p>{" "}
            {/* Display username along with the content */}
            {/* Display other post details here if necessary */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
