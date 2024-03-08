from flask import Flask, request, jsonify, redirect, render_template
import bcrypt
from pymongo import MongoClient

mongo = MongoClient("mongo")
database = mongo["Recall"]
users = database["users"]

app = Flask(__name__)


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
    
@app.route("/", methods=['GET','POST'])
def index():
    render_template('')

@app.route("/registration", methods=['POST'])

def register():
    data = request.json
    username = request.form.get('username')
    password = request.form.get('password')
    confirm = request.form.get('confirmPassword')



app.run(host="localhost",port=8080)