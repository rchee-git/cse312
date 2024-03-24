from flask import Blueprint, request, jsonify
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

    validate = check_pass(password, confirmPassword)
    if validate:
        if users_collection.find_one({"username" :username}):
            response = jsonify({"message": "User already Exists"}), 404
            return response
        else:
                # Generate salted hash for password
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)

                # Insert new user into the database
            user_id = users_collection.insert_one({"username": username,"password": hashed_password})
            response = jsonify({"message": "User Registered"}), 201
            return response
    else:
        response = jsonify({"message": "Passwords Do Not Match"}), 404
        return response
    