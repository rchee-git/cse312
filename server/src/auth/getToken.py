from flask import Blueprint, request, jsonify
from src.service.db import posts_collection, users_collection
from hashlib import sha256

getToken_api = Blueprint("getToken_api", __name__)


@getToken_api.route("/auth/get-token", methods=["POST"])
def get_token():
    try:
        auth_token = request.cookies.get("auth_token")
        if not auth_token:
            return jsonify({"message": "No auth token provided"}), 400

        hashed_token = sha256(auth_token.encode()).hexdigest()
        user = users_collection.find_one({"auth_token": hashed_token})

        if not user:
            return jsonify({"message": "User not found"}), 404

        username = user["username"]
        return (
            jsonify(
                {
                    "message": "User found",
                    "username": username,
                    "auth_token": auth_token,
                }
            ),
            200,
        )
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"message": "Internal Server Error"}), 500
