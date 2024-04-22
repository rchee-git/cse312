from datetime import datetime
from bson import ObjectId
from flask_socketio import emit, join_room

from src.service.db import users_collection, posts_collection
from src.sockets import socketio


@socketio.on("send_post")
def send_message(data):
    content_data = data.get("post", flush=True)

    print(content_data, flush=True)

    # Insert the sender_data into the database
    post_id = posts_collection.insert_one(content_data)
    
    serialized_message = posts_collection.find_one({"_id": post_id})

    print(serialized_message, flush=True)
    # Emit the message to the receiver's room for real-time messaging
    emit("get_post", serialized_message)
