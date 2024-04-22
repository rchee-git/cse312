import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/post.png";
import io from "socket.io-client";

function Home() {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const socket = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_API_URL);
    socket.current.on("get_post", (data) => console.log(data));

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    socket.current.emit("send_post", {
      content: postContent,
    });
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/logout`
      );
      console.log("Logout Successful", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // like button
  const handleLike = async (post, index) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/feed/like`,
        {
          post_id: post._id,
        },
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
    <div>
      <h1>Recall</h1>
      <img
        src={Image}
        alt="Description"
        style={{ width: "200px", height: "auto" }}
      />
      <button onClick={handleLogout} class="button" id="logout">
        Logout
      </button>

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
            <p>
              {post.username}: {post.content}
            </p>
            <button
              onClick={() => handleLike(post, index)}
              disabled={post.isLiked}
            >
              Like ({post.post_like_list.length || 0})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
