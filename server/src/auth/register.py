from flask import Blueprint, request, jsonify
import bcrypt

from src.util.password import check_pass

from src.service.db import users_collection

register_api = Blueprint("register_api", __name__)


@register_api.route("/auth/register", methods=["POST"])
def register():
    username = request.json["username"]
    password = request.json["password"]
    confirm_password = request.json["confirmPassword"]

    # Check if username already exists
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

    # Validate password and confirm password
    password_valid, message = check_pass(password, confirm_password)
    if not password_valid:
        return jsonify({"error": message}), 400

    # Generate salted hash for password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)

    # Insert new user into the database
    user_id = users_collection.insert_one(
        {
            "username": username,
            "password": hashed_password,
            "auth_token": "",
        }
    ).inserted_id

    return (
        jsonify({"message": "User registered successfully", "user_id": str(user_id)}),
        201,
    )
