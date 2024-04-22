from datetime import datetime
from bson import ObjectId
from flask_socketio import emit, join_room

from src.service.db import users_collection, posts_collection
from src.sockets import socketio



@socketio.on("send_post")
def send_message(data):
    content_data = data.get("content")
    username = data.get("username")
    auth_token = data.get("auth_token")
    image_data = data.get("imageData")

    post_data = {
        "content": content_data,
        "username": username,
        "post_like_list": [],
        "imageData": image_data  # Store base64 string directly
    }

    post_id = posts_collection.insert_one(post_data).inserted_id
    content = posts_collection.find_one({"_id": post_id})

    # Prepare the post for JSON serialization
    if content:
        content["_id"] = str(content["_id"])

    emit("get_post", content, broadcast=True)
