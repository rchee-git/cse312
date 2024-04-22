from datetime import datetime
from bson import ObjectId
from flask_socketio import emit, join_room

from src.service.db import users_collection, posts_collection
from src.sockets import socketio


@socketio.on("send_post")
def send_message(data):
    content_data = data.get("content")
    post_id = posts_collection.insert_one(
        {
            "content": content_data,
            "username": 1,
            "post_like_list": [],
        }
    )
    
    serialized_message = posts_collection.find_one({"_id": post_id})
    emit("get_post", serialized_message)
