from flask import Blueprint, request, jsonify
from src.service.db import posts_collection, users_collection

posts_api = Blueprint("posts_api", __name__)

@posts_api.route("/api/posts", methods=["POST"])
def create_post():
    post_content = request.json.get("content")
    username = request.json.get("username")

    if not post_content:
        return jsonify({"error": "Post content is required"}), 400

    if username:
        user = users_collection.find_one({"username": username})
        if not user:
            return jsonify({"error": "Invalid user"}), 401

    post_id = posts_collection.insert_one(
        {
            "content": post_content,
            "username": username,
        }
    ).inserted_id

    return jsonify({
        "message": "Post created successfully",
        "post_id": str(post_id),
        "username": username
    }), 201

@posts_api.route("/api/posts", methods=["GET"])
def get_posts():
    posts = posts_collection.find()

    posts_list = []
    for post in posts:
        posts_list.append({
            "content": post["content"],
            "username": post.get("username")
        })

    return jsonify(posts_list), 200
