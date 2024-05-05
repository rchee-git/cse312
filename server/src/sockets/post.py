from datetime import datetime, timedelta
from bson import ObjectId
from flask_socketio import emit, join_room
import pytz
from flask import current_app
from app import app
import time

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
        "imageData": image_data,  # Store base64 string directly
        "delay": -0.5,
    }

    post_id = posts_collection.insert_one(post_data).inserted_id
    content = posts_collection.find_one({"_id": post_id})

    # Prepare the post for JSON serialization
    if content:
        content["_id"] = str(content["_id"])

    emit("get_post", content, broadcast=True)



@socketio.on("schedule_send_post")
def schedule_post(data):
    content_data = data.get("content")
    username = data.get("username")
    auth_token = data.get("auth_token")
    delay_in_seconds = int(data.get("scheduledTime"))

    time_to_post = datetime.now().replace(microsecond=0) + timedelta(seconds=delay_in_seconds)
    time_now = datetime.now().replace(microsecond=0)
    post_data = {
        "content": content_data,
        "username": username,
        "post_like_list": [],
        "delay": delay_in_seconds,
    }
    posts_collection.insert_one(post_data)
    id = post_data.pop('_id')
    post_data['_id'] = str(id)
    while time_to_post > time_now:
        post_data['delay'] = post_data['delay'] - 0.5
        delay_in_seconds -= 0.5
        emit("get_upcoming_post", post_data, broadcast=True, namespace="/")
        posts_collection.update_one(
            {"_id": id},
            {"$set": {"delay": delay_in_seconds}}
        )
        time_now = datetime.now().replace(microsecond=0)
        time.sleep(0.5)
        print("waiting for post", flush=True)


    print("end", flush=True)
    emit("get_post", post_data, broadcast=True, namespace="/")


def convert_datetime_to_string(obj):
    for key, value in obj.items():
        if isinstance(value, datetime):
            obj[key] = value.isoformat()
    return obj

