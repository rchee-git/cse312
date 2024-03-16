from flask import Blueprint, request, jsonify
from bson.json_util import dumps
import bcrypt

from src.service.db import users_collection

register_api = Blueprint("register_api", __name__)

def check_pass(password,confirm):
    special_characters = "!@#$%^&()_-="
    if password != confirm:
        return False
    if len(password) < 8:
        return False
    uppercase = False
    lowercase = False
    special = False
    number = False
    for character in password:
        if character.isupper():
            uppercase = True
        if character.islower():
            lowercase = True
        if character.isdigit():
            number = True
        if character in special_characters:
            special = True
        if not character.isalnum():
            return False
    return (uppercase and lowercase and special and number)

@register_api.route("/auth/register", methods=["POST"])
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
