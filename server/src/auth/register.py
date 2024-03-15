from flask import Blueprint, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
import bcrypt

register_api = Blueprint("register_api", __name__)


# Inject mongo instance, could also use current_app from Flask
def get_users_collection(mongo):
    return mongo.db.users


@register_api.route("/auth/register", methods=["POST"])
def register(mongo):
    users = get_users_collection(mongo)

    username = request.json["username"]
    password = request.json["password"]
    confirm_password = request.json["confirmPassword"]

    # Check if the passwords match
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    # Check if username already exists
    if users.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

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
