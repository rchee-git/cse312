from flask import Blueprint, request, jsonify
from bson.json_util import dumps
import bcrypt

from src.service.db import users_collection

register_api = Blueprint("register_api", __name__)


@register_api.route("/auth/register", methods=["POST"])
def register():
    username = request.json["username"]
    password = request.json["password"]

    # Check if username already exists
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

    # Generate salted hash for password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)

    # Insert new user into the database
    user_id = users_collection.insert_one(
        {
            "username": username,
            "password": hashed_password,
        }
    ).inserted_id

    return (
        jsonify({"message": "User registered successfully", "user_id": str(user_id)}),
        201,
    )
