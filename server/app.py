from flask import Flask
from flask_cors import CORS

from src.auth.register import register_api
from src.auth.login import login_api

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Register the blueprints
app.register_blueprint(register_api)
app.register_blueprint(login_api)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9000)
