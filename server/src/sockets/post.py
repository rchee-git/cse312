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

    # Insert the post to the database
    post_id = posts_collection.insert_one(
        {
            "content": content_data,
            "username": username,
            "post_like_list": [],
        }
    ).inserted_id

    # Fetch the new post using the inserted_id
    content = posts_collection.find_one({"_id": post_id})

    # Prepare the post for JSON serialization
    if content:
        # Convert ObjectId to string
        content["_id"] = str(content["_id"])

    print(content, flush=True)
    emit("get_post", content, broadcast=True)
