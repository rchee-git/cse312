from flask import Blueprint, request, jsonify
from src.service.db import posts_collection, users_collection
from hashlib import sha256

posts_api = Blueprint("posts_api", __name__)

@posts_api.route("/feed/home", methods=["POST"])
def create_post():
    post_content = request.json.get("content")

    auth_token = request.cookies.get("auth_token")
    hashed_token = sha256(auth_token.encode()).hexdigest()
    user = users_collection.find_one({"auth_token": hashed_token})
    username = user['username']
    
    if not post_content:
        return jsonify({"error": "Post content is required"}), 400


    post_id = posts_collection.insert_one(
        {
            "content": post_content,
            "username": username,
        }
    ).inserted_id

    return jsonify({
        "message": "Post created successfully",
        "post_id": str(post_id),
        "username": username,
        "content": post_content
    }), 201

@posts_api.route("/feed/home", methods=["GET"])
def get_posts():
    posts = posts_collection.find()

    posts_list = []
    for post in posts:
        posts_list.append({
            "content": post["content"],
            "username": post.get("username")
        })

    return jsonify(posts_list), 200
