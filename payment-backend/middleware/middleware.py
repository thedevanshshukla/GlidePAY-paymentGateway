# app/middleware/auth_middleware.py

import jwt
from flask import request, jsonify, g
import os
from functools import wraps

JWT_SECRET = os.getenv("JWT_SECRET")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization")

        if not auth or not auth.startswith("Bearer "):
            return jsonify({"error": "Authentication invalid: No token provided."}), 401

        token = auth.split(" ")[1]

        try:
            decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            g.user_id = decoded["userId"]  # like req.userId
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired."}), 401
        except Exception:
            return jsonify({"error": "Authentication invalid: Token is not valid."}), 401

        return f(*args, **kwargs)
    return decorated
