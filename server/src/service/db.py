import pymongo

client = pymongo.MongoClient("mongodb://mongo:27017/")

# Point to user database
user_db = client["users"]
users_collection = user_db["user"]
posts_collection = user_db["posts"]