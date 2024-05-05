from datetime import datetime, timedelta
from bson import ObjectId
from flask_socketio import emit, join_room
from apscheduler.schedulers.background import BackgroundScheduler
import pytz
from flask import current_app

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
    }

    post_id = posts_collection.insert_one(post_data).inserted_id
    content = posts_collection.find_one({"_id": post_id})

    # Prepare the post for JSON serialization
    if content:
        content["_id"] = str(content["_id"])

    emit("get_post", content, broadcast=True)


# Initialize the scheduler
scheduler = BackgroundScheduler(job_defaults={"misfire_grace_time": 60})
scheduler.start()


@socketio.on("schedule_send_post")
def schedule_post(data):
    content_data = data.get("content")
    username = data.get("username")
    auth_token = data.get("auth_token")
    scheduled_time = data.get("scheduledTime")

    # Add ':00' if the time doesn't include seconds
    if len(scheduled_time.split("T")[-1]) == 5:
        scheduled_time += ":00"

    # Convert scheduled time to a datetime object and then to EST
    scheduled_time = datetime.strptime(scheduled_time, "%Y-%m-%dT%H:%M:%S").replace(
        tzinfo=pytz.UTC
    )
    eastern = pytz.timezone("US/Eastern")
    est_time = scheduled_time.astimezone(eastern)

    # Check if scheduled time is in the past
    if est_time < datetime.now(eastern):
        print(
            "Scheduled time is in the past. Adjusting to the next available time.",
            flush=True,
        )
        est_time = datetime.now(eastern) + timedelta(
            seconds=30
        )  # Adjust to 30 seconds in the future

    # Store the scheduled post in the database
    post_data = {
        "content": content_data,
        "username": username,
        "post_like_list": [],
        "scheduled_time": est_time,
    }

    post_id = posts_collection.insert_one(post_data).inserted_id

    # Schedule the post
    scheduler.add_job(send_scheduled_post, "date", run_date=est_time, args=[post_id])


def send_scheduled_post(post_id):
    with current_app.app_context():
        post = posts_collection.find_one({"_id": ObjectId(post_id)})
        if post:
            post["_id"] = str(post["_id"])
            print(f"Emitting scheduled post: {post}", flush=True)
            emit("get_post", post, broadcast=True, namespace="/")
