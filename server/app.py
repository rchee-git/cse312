from flask import Flask
from src.auth.register import register_api

app = Flask(__name__)

# Register the blueprints
app.register_blueprint(register_api)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)