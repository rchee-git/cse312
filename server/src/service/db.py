import pymongo
import certifi

URL = ""

client = pymongo.MongoClient(
    URL,
    tlsCAFile=certifi.where(),
)

# Point to profile database
user_db = client["users"]
users_collection = user_db["user"]