import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/feed/home`);
      setPosts(response.data);
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/feed/home`,
        { content: postContent },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }  // Assuming the token is stored in localStorage
      );

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/feed/home`);
      setPosts(response.data);
      setPostContent("");  
    } catch (error) {
      console.error("Failed to post:", error);
    }

    setSubmitting(false);
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
