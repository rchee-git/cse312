import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/post.png";
import io from "socket.io-client";

function Home() {
  const socket = useRef(null);
  const navigate = useNavigate();

  // posting
  const [postContent, setPostContent] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [posts, setPosts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Themes
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBig, setIsBig] = useState(false);

  // fetching posts
  useEffect(() => {
    socket.current = io(process.env.REACT_APP_API_URL);

    socket.current.on("get_post", (newPost) => {
      console.log("Received post:", newPost);
      setPosts((currentPosts) => [...currentPosts, newPost]);
    });

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/feed/home`,
          { withCredentials: true }
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // handle new messages for sending NOW
  const handleSubmit = async (e) => {
    e.preventDefault();

    let username;
    let auth_token;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/get-token`,
        {},
        { withCredentials: true }
      );

      username = response.data.username;
      auth_token = response.data.auth_token;
    } catch (error) {
      console.error("Failed to logout:", error.message);
    }

    socket.current.emit("send_post", {
      content: postContent,
      auth_token: auth_token,
      username: username,
    });
  };

  // handle new messages for sending NOW
  const handleScheduleSend = async (e) => {
    e.preventDefault();

    let username;
    let auth_token;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/get-token`,
        {},
        { withCredentials: true }
      );

      username = response.data.username;
      auth_token = response.data.auth_token;
    } catch (error) {
      console.error("Failed to logout:", error.message);
    }

    console.log(scheduledTime);

    socket.current.emit("schedule_send_post", {
      content: postContent,
      auth_token: auth_token,
      username: username,
      scheduledTime,
    });
  };

  // logging out
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/logout`
      );
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

  const handleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      style={
        isDarkMode
          ? { backgroundColor: "black", width: isBig ? 800 : 400 }
          : { backgroundColor: "white", width: isBig ? 800 : 400 }
      }
    >
      {/* top header */}
      <h1 style={isDarkMode ? { color: "black" } : { color: "white" }}>
        Recall
      </h1>
      <button
        onClick={() => setIsBig(!isBig)}
        style={
          isDarkMode
            ? {
                color: "gray",
                backgroundColor: "black",
                fontSize: isBig ? 30 : 10,
              }
            : {
                color: "black",
                backgroundColor: "white",
                fontSize: isBig ? 30 : 10,
              }
        }
      >
        {!isBig ? <div>Make big</div> : <div>Make small</div>}
      </button>
      <button
        style={
          isDarkMode
            ? {
                color: "gray",
                backgroundColor: "black",
                fontSize: isBig ? 30 : 10,
              }
            : {
                color: "black",
                backgroundColor: "white",
                fontSize: isBig ? 30 : 10,
              }
        }
        onClick={() => handleDarkMode()}
      >
        {isDarkMode ? (
          <div>You are in Dark Mode</div>
        ) : (
          <div>You are in Light Mode</div>
        )}
      </button>

      <br></br>

      {/* recall logo */}
      <img
        src={Image}
        alt="Description"
        style={{ width: "200px", height: "auto" }}
      />

      <br></br>

      <button
        onClick={handleLogout}
        style={
          isDarkMode
            ? {
                color: "gray",
                backgroundColor: "black",
                fontSize: isBig ? 30 : 10,
              }
            : {
                color: "black",
                backgroundColor: "white",
                fontSize: isBig ? 30 : 10,
              }
        }
        id="logout"
      >
        Logout
      </button>

      {/* form submit */}
      <div className="post-form">
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          style={
            isDarkMode
              ? { backgroundColor: "black" }
              : { backgroundColor: "white" }
          }
          placeholder="Post Something!!!"
          required
        ></textarea>

        <button
          onClick={handleSubmit}
          type="submit"
          style={
            isDarkMode
              ? {
                  color: "lightgray",
                  backgroundColor: "black",
                  fontSize: isBig ? 30 : 10,
                }
              : {
                  color: "black",
                  backgroundColor: "white",
                  fontSize: isBig ? 30 : 10,
                }
          }
          disabled={submitting}
        >
          {submitting ? "Posting..." : "Post Now"}
        </button>

        <br></br>

        {/* schedule send */}
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          style={
            isDarkMode
              ? { backgroundColor: "black", color: "white" }
              : { backgroundColor: "white", color: "black" }
          }
          required
        />

        <button
          onClick={handleScheduleSend}
          type="submit"
          style={
            isDarkMode
              ? {
                  color: "lightgray",
                  backgroundColor: "black",
                  fontSize: isBig ? 30 : 10,
                }
              : {
                  color: "black",
                  backgroundColor: "white",
                  fontSize: isBig ? 30 : 10,
                }
          }
          disabled={submitting}
        >
          {submitting ? "Posting..." : "Schedule Post"}
        </button>
      </div>

      <div
        className="post-list"
        style={{ maxHeight: "500px", overflowY: "scroll" }}
      >
        {posts.map((post, index) => (
          <div key={index} className="post">
            <p
              style={
                isDarkMode
                  ? { color: "white", fontSize: isBig ? 30 : 10 }
                  : { color: "black", fontSize: isBig ? 30 : 10 }
              }
            >
              {post.username}: {post.content}
            </p>
            <button
              onClick={() => handleLike(post, index)}
              disabled={post.isLiked}
              style={
                isDarkMode
                  ? {
                      color: "lightgray",
                      backgroundColor: "black",
                      fontSize: isBig ? 30 : 10,
                    }
                  : {
                      color: "black",
                      backgroundColor: "white",
                      fontSize: isBig ? 30 : 10,
                    }
              }
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
