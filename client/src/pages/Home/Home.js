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
  const [textColor, setTextColor] = useState("#000000");
  const [upcomingPosts, setUpcomingPosts] = useState([]);

  // Themes
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBig, setIsBig] = useState(false);

  // fetching posts
  useEffect(() => {
    socket.current = io(process.env.REACT_APP_API_URL);

    socket.current.on("get_post", (newPost) => {
      setPosts((currentPosts) => [...currentPosts, newPost]);
    });
    socket.current.on("get_upcoming_post", (newPost) => {
      if (newPost.delay > 0) {
        // CHANGE HERE, filter out with same id or something
        setUpcomingPosts((currentPosts) => [...currentPosts, newPost]);
      }
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

  const fetchUpcomingPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/feed/upcomingPosts`,
        { withCredentials: true }
      );
      setUpcomingPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch upcoming posts:", error);
    }
  };
  useEffect(() => {
    fetchUpcomingPosts();
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
      console.error("Failed to get auth token:", error.message);
      return;
    }

    console.log(scheduledTime);

    socket.current.emit("schedule_send_post", {
      content: postContent,
      auth_token: auth_token,
      username: username,
      scheduledTime,
    });

    // Add to upcoming posts list
    const newPost = {
      content: postContent,
      username: username,
      post_like_list: [],
      scheduled_time: scheduledTime,
      _id: Math.random().toString(36).substr(2, 9), // Temporary unique ID
    };
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
    <>
      <div style={{ display: "flex" }}>
        <div
          style={
            isDarkMode
              ? {
                  backgroundColor: "black",
                  color: textColor,
                  width: isBig ? 800 : 400,
                  flex: 1,
                }
              : {
                  backgroundColor: "white",
                  color: textColor,
                  width: isBig ? 800 : 400,
                  flex: 1,
                }
          }
        >
          {/* top header */}
          <h1
            style={
              isDarkMode
                ? { color: "white", color: textColor }
                : { color: "black", color: textColor }
            }
          >
            Recall
          </h1>

          <button
            onClick={handleLogout}
            style={
              isDarkMode
                ? {
                    color: textColor,

                    backgroundColor: "black",
                    fontSize: isBig ? 30 : 10,
                    borderRadius: "8px",
                    padding: isBig ? "10px 20px" : "6px 12px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    transition: "background 0.3s, box-shadow 0.3s",
                    outline: "none",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: "bold",
                  }
                : {
                    color: textColor,

                    backgroundColor: "white",
                    fontSize: isBig ? 30 : 10,
                    borderRadius: "8px",
                    padding: isBig ? "10px 20px" : "6px 12px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    transition: "background 0.3s, box-shadow 0.3s",
                    outline: "none",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: "bold",
                  }
            }
            id="logout"
          >
            Logout
          </button>

          <br></br>
          <br></br>

          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />

          <button
            onClick={() => setIsBig(!isBig)}
            style={
              isDarkMode
                ? {
                    color: textColor,
                    backgroundColor: "black",
                    fontSize: isBig ? 30 : 10,
                  }
                : {
                    color: textColor,

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
                    color: textColor,

                    backgroundColor: "black",
                    fontSize: isBig ? 30 : 10,
                  }
                : {
                    color: textColor,

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

          {/* form submit */}
          <div className="post-form">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              style={
                isDarkMode
                  ? { backgroundColor: "black", color: textColor }
                  : { backgroundColor: "white", color: textColor }
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
                      color: textColor,
                      backgroundColor: "black",
                      fontSize: isBig ? 30 : 10,
                    }
                  : {
                      color: textColor,
                      backgroundColor: "white",
                      fontSize: isBig ? 30 : 10,
                    }
              }
            >
              {false ? "Posting..." : "Post Now"}
            </button>

            <br></br>

            {/* schedule send */}
            <input
              type="number"
              name="numberInput"
              min="0"
              max="1000"
              required
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              style={
                isDarkMode
                  ? {
                      backgroundColor: "black",
                      color: textColor,
                    }
                  : { backgroundColor: "white", color: textColor }
              }
            />

            <button
              onClick={handleScheduleSend}
              type="submit"
              style={
                isDarkMode
                  ? {
                      color: textColor,
                      backgroundColor: "black",
                      fontSize: isBig ? 30 : 10,
                    }
                  : {
                      color: textColor,
                      backgroundColor: "white",
                      fontSize: isBig ? 30 : 10,
                    }
              }
            >
              {false ? "Posting..." : "Post with Delay in Seconds"}
            </button>
          </div>

          <div
            className="post-list"
            style={{ maxHeight: "500px", overflowY: "scroll" }}
          >
            {posts.map((post, index) => (
              <div
                key={index}
                className="post"
                style={{
                  backgroundColor: "#ffffff",
                  margin: "10px",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <p
                  style={
                    isDarkMode
                      ? {
                          color: textColor,
                          fontSize: isBig ? 30 : 10,
                        }
                      : {
                          color: textColor,
                          fontSize: isBig ? 30 : 10,
                        }
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
                          color: textColor,
                          backgroundColor: "black",
                          fontSize: isBig ? 30 : 10,
                        }
                      : {
                          color: textColor,
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

        <div
          style={{
            flex: 1,
          }}
        >
          <h1
            style={{
              textAlign: "center",
              margin: "20px 0",
              color: "#333",
              fontSize: "24px",
            }}
          >
            Upcoming Scheduled Posts
          </h1>
          {upcomingPosts.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888" }}>
              No upcoming posts
            </p>
          ) : (
            upcomingPosts.map((post, index) => {
              return (
                <div
                  key={index}
                  className="post"
                  style={{
                    backgroundColor: "#ffffff",
                    margin: "10px",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <p style={{ margin: "0 0 10px", color: "#888" }}>
                    It will be posted in {post.delay} seconds
                  </p>
                  <p style={{ margin: "0", color: "#333", fontWeight: "bold" }}>
                    {post.username}: {post.content}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
