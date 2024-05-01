from flask import Flask
from flask_cors import CORS

from src.auth.register import register_api
from src.auth.login import login_api
from src.feed.home import posts_api
from src.auth.getToken import getToken_api

from src.sockets import socketio

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Register the blueprints
app.register_blueprint(register_api)
app.register_blueprint(login_api)
app.register_blueprint(posts_api)
app.register_blueprint(getToken_api)

# import sockets
socketio.init_app(app)

import src.sockets.post as post

if __name__ == "__main__":
    socketio.run(app, port=3000, debug=False)
