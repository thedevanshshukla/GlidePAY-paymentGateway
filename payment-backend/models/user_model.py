# models/user_model.py

from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash

class UserModel:
    def __init__(self, db):
        self.collection = db["users"]

    def find_by_email(self, email):
        return self.collection.find_one({"email": email})

    def find_by_id(self, user_id):
        from bson import ObjectId
        return self.collection.find_one({"_id": ObjectId(user_id)})

    def create_user(self, first_name, last_name, email, password):
        hashed_pw = generate_password_hash(password)
        user = {
            "firstName": first_name,
            "lastName": last_name,
            "email": email,
            "password": hashed_pw,
            "balance": 0
        }
        return self.collection.insert_one(user)

    def check_password(self, plain_pw, hashed_pw):
        return check_password_hash(hashed_pw, plain_pw)
