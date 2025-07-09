# models/transaction_model.py

from flask import current_app
from bson import ObjectId
from datetime import datetime

class TransactionModel:
    def __init__(self, db):
        self.collection = db["transactions"]

    def create_transaction(self, from_user_id, to_user_id, amount, status="completed"):
        transaction = {
            "from": ObjectId(from_user_id),
            "to": ObjectId(to_user_id),
            "amount": amount,
            "timestamp": datetime.utcnow(),
            "status": status
        }
        return self.collection.insert_one(transaction)

    def get_user_transactions(self, user_id):
        return list(self.collection.find({
            "$or": [
                {"from": ObjectId(user_id)},
                {"to": ObjectId(user_id)}
            ]
        }).sort("timestamp", -1))

    def get_transaction_by_id(self, txn_id):
        return self.collection.find_one({"_id": ObjectId(txn_id)})
