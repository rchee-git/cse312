import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/feed/home`
      );
      setPosts(response.data);
    };

    fetchPosts();
  }, []);

<<<<<<< HEAD
  const handleLogout = async (e) => {
    e.preventDefalt();

    try{
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/logout`
      );
    }
    catch (error) {
      console.error("Failed to post:", error);
    }
  };
=======
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
>>>>>>> 14911a050e30192b96524a2f2554afa7b315e66e

  useEffect(() => {
    const x = async () => {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/feed/like`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
    };
    x();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/feed/home`,
        {
          content: postContent,
        },
        {
          withCredentials: true,
        }
      );

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/feed/home`
      );
      setPosts(response.data);
      setPostContent("");
    } catch (error) {
      console.error("Failed to post:", error);
    }

    setSubmitting(false);
  };

  const handleLike = async (index) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/feed/like`,
        {},
        { withCredentials: true }
      );

      const updatedPosts = [...posts];
      updatedPosts[index] = { ...updatedPosts[index], ...response.data };
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
    <div>
      <h1>Recall</h1>
      <button onClick={handleLogout} class = 'button' id = 'logout'>
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
              onClick={() => handleLike(post._id, index)}
              disabled={post.isLiked}
            >
              Like ({post.likes || 0})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
