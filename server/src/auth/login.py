from flask import Blueprint, request, jsonify
from bson.json_util import dumps
import bcrypt

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
