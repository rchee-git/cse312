from flask import Blueprint, request, jsonify, make_response
import bcrypt
import uuid
from hashlib import sha256
from datetime import datetime, timedelta

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

    # Assuming user["password"] is stored as bytes in the database
    # No need to encode it again here
    if bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        new_auth_token = str(uuid.uuid4())
        hashed_token = sha256(new_auth_token.encode()).hexdigest()

        # Update the user's auth token in the database with the hashed version
        users_collection.update_one(
            {"username": username}, {"$set": {"auth_token": hashed_token}}
        )

        # Create a response and set the cookie
        response = make_response(jsonify({"message": "Logged in successfully"}))
        # Set cookie to expire in 1 hour
        response.set_cookie(
            "auth_token",
            new_auth_token,
            httponly=True,
            expires=datetime.now() + timedelta(hours=1),
        )
        return response, 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


@login_api.route("/auth/logout", methods=["POST"])
def logout():

    auth_token = request.cookies.get("auth_token")
    if auth_token:
        hashed_token = sha256(auth_token.encode()).hexdigest()
        # Remove the hashed auth token from the database
        users_collection.update_one(
            {"auth_token": hashed_token}, {"$unset": {"auth_token": ""}}
        )
    response = make_response(jsonify({"message": "Logged out successfully."}))
    response.set_cookie("auth_token", "",path = '/', max_age=0)
    return response


@login_api.route("/auth/checkAuth", methods=["POST"])
def checkAuth():
    auth_token = request.cookies.get("auth_token")
    if not auth_token:
        return "bad"
    hashed_token = sha256(auth_token.encode()).hexdigest()
    user = users_collection.find_one({"auth_token": hashed_token})
    
    response = ""
    if user:
         response = "good"
    else:
        response = "bad"
    return response