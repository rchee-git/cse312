from flask import Flask
from flask_pymongo import PyMongo
from src.auth.register import register_api

app = Flask(__name__)

# Setup MongoDB connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/yourDatabaseName"
mongo = PyMongo(app)

# Register the blueprints
app.register_blueprint(register_api)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)