from flask import Blueprint, request, jsonify
from src.service.db import posts_collection, users_collection
from hashlib import sha256
from bson import ObjectId
from datetime import datetime
import pytz
import time

posts_api = Blueprint("posts_api", __name__)


@posts_api.route("/feed/home", methods=["POST"])
def create_post():
    post_content = request.json.get("content")
    image_data = request.json.get("imageData")

    auth_token = request.cookies.get("auth_token")
    hashed_token = sha256(auth_token.encode()).hexdigest()
    user = users_collection.find_one({"auth_token": hashed_token})
    username = user["username"]

    if not post_content:
        return jsonify({"error": "Post content is required"}), 400

    post_id = posts_collection.insert_one(
        {
            "content": post_content,
            "username": username,
            "post_like_list": [],
            "imageData": image_data,
        }
    ).inserted_id

    return (
        jsonify(
            {
                "message": "Post created successfully",
                "post_id": str(post_id),
                "username": username,
                "content": post_content,
                "imageData": image_data,
            }
        ),
        201,
    )


@posts_api.route("/feed/home", methods=["GET"])
def get_posts():
    posts = posts_collection.find({"delay": {"$lte": 0}})
    posts_list = []
    for post in posts:
        post_data = {
            "content": post["content"],
            "username": post.get("username"),
            "_id": str(post["_id"]),
            "post_like_list": post["post_like_list"],
            "imageData": post.get("imageData", ""),
        }
        # Add scheduled_time if it exists
        if "scheduled_time" in post:
            post_data["scheduled_time"] = post["scheduled_time"]

        posts_list.append(post_data)

    return jsonify(posts_list), 200


@posts_api.route("/feed/like", methods=["POST"])
def like_post():

    # get post id from request
    post_id = request.json.get("post_id")

    # get username
    auth_token = request.cookies.get("auth_token")
    hashed_token = sha256(auth_token.encode()).hexdigest()
    user = users_collection.find_one({"auth_token": hashed_token})
    username = user["username"]

    # find post in database using post_id
    post_data = posts_collection.find_one({"_id": ObjectId(post_id)})
    post_like_list = post_data["post_like_list"]

    if username in post_like_list:
        post_like_list.remove(username)
    else:
        # add username to post_like_list(list of usernames)
        post_like_list.append(username)
    # update database with new post_like_list
    posts_collection.update_one(
        {"_id": ObjectId(post_id)}, {"$set": {"post_like_list": post_like_list}}
    )
    return "good" + str(post_like_list)


@posts_api.route("/feed/upcomingPosts", methods=["GET"])
def get_upcoming_posts():
    posts = posts_collection.find({"delay": {"$gt": 0}})
    posts_list = []
    for post in posts:
        post_data = {
            "content": post["content"],
            "username": post.get("username"),
            "_id": str(post["_id"]),
            "post_like_list": post["post_like_list"],
            "imageData": post.get("imageData", ""),
            "delay": post["delay"],
        }
        posts_list.append(post_data)

    return jsonify(posts_list), 200
