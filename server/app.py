from flask import Flask, request, jsonify, redirect, render_template, make_response
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


@app.route('/')
def home_page():
    return render_template('home.js')

@app.route("/register", methods=['POST',"GET"])
def register():
    if request.method == 'GET':
        return render_template('Register.js')
    data = request.get_json
    username = data.get('username')
    password = data.get('password')
    confirm = data.get('confirmPassword')
    print(username)
    print(confirm)
    print(password)
    validate = check_pass(password, confirm)
    if not validate:
        return make_response('Error: Not Valid', 400)

    search = users.find_one({'username': username})
    if search == None:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        user = {"username":username, "hash":hashed, "salt":salt}
        users.insert_one(user)
        return make_response("Registered",200)
    else:
        return make_response('Error: Not Valid', 400)

@app.route("/login", methods=["POST", "GET"])

    
app.run(host="localhost",port=3000)