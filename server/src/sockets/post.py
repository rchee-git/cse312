from datetime import datetime
from bson import ObjectId
from flask_socketio import emit, join_room

from src.service.db import users_collection, posts_collection
from src.sockets import socketio


@socketio.on("send_message")
def send_message(data):
    # Ensure sender_data is provided
    sender_data = data.get("sender_data")

    print(sender_data, flush=True)

    # Insert the sender_data into the database
    post_id = posts_collection.insert_one(sender_data)

    # Retrieve the inserted post for broadcasting, assuming it contains message data
    serialized_message = posts_collection.find_one({"_id": post_id})

    # Emit the message to the receiver's room for real-time messaging
    emit("get_post", serialized_message)
