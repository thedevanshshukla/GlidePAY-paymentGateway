# app/routes/auth_routes.py

from flask import Blueprint, request, jsonify, g
from db import db as mongo
from middleware.middleware import token_required
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
import datetime
from bson import ObjectId

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_EXPIRY_HOURS = 1  # you can move this to .env too if needed

# 📥 REGISTER
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json or {}
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not all([first_name, last_name, email, password]):
        return jsonify({"error": "Please provide all required fields."}), 400

    if mongo.users.find_one({"email": email}):
        return jsonify({"error": "User with this email already exists."}), 400

    hashed_pw = generate_password_hash(password)
    user_doc = {
        "firstName": first_name,
        "lastName": last_name,
        "email": email,
        "password": hashed_pw,
        "balance": 0
    }

    result = mongo.users.insert_one(user_doc)

    token = jwt.encode(
        {"userId": str(result.inserted_id), "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRY_HOURS)},
        JWT_SECRET,
        algorithm="HS256"
    )

    return jsonify({"token": token}), 201

# 🔐 LOGIN
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    user = mongo.users.find_one({"email": email})
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode(
        {"userId": str(user["_id"]), "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRY_HOURS)},
        JWT_SECRET,
        algorithm="HS256"
    )

    return jsonify({"token": token})


# 👤 GET USER DETAILS
@auth_bp.route('/me', methods=['GET'])
@token_required
def get_me():
    user = mongo.users.find_one({"_id": ObjectId(g.user_id)}, {"password": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404

    user["_id"] = str(user["_id"])
    return jsonify(user)
