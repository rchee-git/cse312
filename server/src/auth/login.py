from flask import Blueprint, request, jsonify
from bson.json_util import dumps
import bcrypt
import uuid

from src.service.db import users_collection

login_api = Blueprint("login_api", __name__)


@login_api.route("/auth/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    # Check if user exists
    user = users_collection.find_one({"username": username})
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    # Verify password (assuming the stored password is hashed)
    if bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        new_auth_token = str(uuid.uuid4())

        # Update the user's auth token in the database
        users_collection.update_one(
            {"username": username}, {"$set": {"auth_token": new_auth_token}}
        )

        # Create a response and set the cookie
        response = jsonify({"message": "Logged in successfully"})
        response.set_cookie("auth_token", new_auth_token, httponly=True)
        return response, 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


@login_api.route("/auth/logout", methods=["POST"])
def logout():
    auth_token = request.cookies.get("auth_token")
    users_collection.find_one({"auth_token": auth_token})
    response = jsonify({"message": "Logged out successfully."}), 200
    response.set_cookie("auth_token", "", expires=0)
    return response
