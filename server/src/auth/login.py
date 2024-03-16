from flask import Blueprint, request, jsonify
from bson.json_util import dumps
import bcrypt
import uuid

from src.service.db import users_collection

login_api = Blueprint("login_api", __name__)


@login_api.route("/auth/login", methods=["POST"])
def register():
    username = request.json["username"]
    password = request.json["password"]
    confirmPassword = request.json["confirmPassword"]

    # Check if the passwords match
    if password != confirmPassword:
        return jsonify({"error": "Passwords do not match"}), 400

    # Check if username already exists
    # if users.find_one({"username": username}):
    #    return jsonify({"error": "Username already exists"}), 400

    # Adds cookie to response
    if True: # login not done, but this should make sure login is valid (username/password good)
        new_auth_token = str(uuid.uuid4())  
        users_collection.update_one(
            {"username": username},  
            {"$set": {"auth_token": new_auth_token}} 
        )
        response = jsonify({"message": "Logged in successfully."}), 200
        response.set_cookie('auth_token', new_auth_token, httponly=True)
        return response
    else:
        response = jsonify({"message": "ERROR"}), 404
        return response

    return (
        dumps({"message": "User registered successfully", "user_id": str(user_id)}),
        201,
    )

    # Generate salted hash for password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)

    # Insert new user into the database
    user_id = users.insert_one(
        {
            "username": username,
            "password": hashed_password,
        }
    ).inserted_id

    return (
        dumps({"message": "User registered successfully", "user_id": str(user_id)}),
        201,
    )

@login_api.route("/auth/logout", methods=["POST"])
def logout():
    auth_token = request.cookies.get('auth_token')
    users_collection.find_one({"auth_token": auth_token})
    response = jsonify({"message": "Logged out successfully."}), 200
    response.set_cookie('auth_token', '', expires=0)
    return response
