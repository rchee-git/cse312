from datetime import datetime
from bson import ObjectId
from flask_socketio import emit, join_room

from src.service.db import users_collection, posts_collection
from src.sockets import socketio


@socketio.on("send_post")
def send_message(data):
    content_data = data.get("content")
    print("TESTING")
    print(content_data)

    post_id = posts_collection.insert_one(
        {
            "content": content_data,
            "username": 1,
            "post_like_list": [],
        }
    )
    # Insert the sender_data into the database
    
    # serialized_message = posts_collection.find_one({"_id": post_id})
    # print(serialized_message, flush=True)
    # # Emit the message to the receiver's room for real-time messaging
    # emit("get_post", serialized_message)
