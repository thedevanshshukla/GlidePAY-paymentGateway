# app/routes/transaction_routes.py

from flask import Blueprint, request, jsonify, g
from db import db as mongo
from middleware.middleware import token_required
from bson import ObjectId
from datetime import datetime
from pymongo import ASCENDING, DESCENDING

transaction_bp = Blueprint("transaction", __name__, url_prefix="/api/transactions")

# 🟢 SEND MONEY
@transaction_bp.route('/send', methods=['POST'])
@token_required
def send_money():
    data = request.json
    to_email = data.get("toEmail", "").strip()
    amount = float(data.get("amount", 0))

    if not to_email or amount <= 0:
        return jsonify({"error": "Invalid recipient or amount."}), 400

    with mongo.cx.start_session() as session:
        with session.start_transaction():
            from_user = mongo.db.users.find_one({"_id": ObjectId(g.user_id)}, session=session)
            if not from_user or from_user.get("balance", 0) < amount:
                return jsonify({"error": "Insufficient funds."}), 400

            to_user = mongo.db.users.find_one({"email": {"$regex": f"^{to_email}$", "$options": "i"}}, session=session)
            if not to_user:
                return jsonify({"error": "Recipient not found."}), 404
            if from_user["_id"] == to_user["_id"]:
                return jsonify({"error": "You cannot send money to yourself."}), 400

            # Update balances
            mongo.db.users.update_one({"_id": from_user["_id"]}, {"$inc": {"balance": -amount}}, session=session)
            mongo.db.users.update_one({"_id": to_user["_id"]}, {"$inc": {"balance": amount}}, session=session)

            # Record transaction
            mongo.db.transactions.insert_one({
                "from": from_user["_id"],
                "to": to_user["_id"],
                "amount": amount,
                "status": "completed",
                "timestamp": datetime.utcnow()
            }, session=session)

            return jsonify({"message": "Transaction successful"}), 200

# 🟡 REQUEST MONEY
@transaction_bp.route('/request', methods=['POST'])
@token_required
def request_money():
    data = request.json
    from_email = data.get("fromEmail", "").strip()
    amount = float(data.get("amount", 0))

    if not from_email or amount <= 0:
        return jsonify({"error": "Invalid email or amount."}), 400

    from_user = mongo.db.users.find_one({"email": {"$regex": f"^{from_email}$", "$options": "i"}})
    to_user = mongo.db.users.find_one({"_id": ObjectId(g.user_id)})

    if not from_user or not to_user:
        return jsonify({"error": "User not found."}), 404
    if from_user["_id"] == to_user["_id"]:
        return jsonify({"error": "You cannot request money from yourself."}), 400

    mongo.db.transactions.insert_one({
        "from": from_user["_id"],
        "to": to_user["_id"],
        "amount": amount,
        "status": "pending",
        "timestamp": datetime.utcnow()
    })

    return jsonify({"message": "Money request sent successfully."}), 201

# ✅ APPROVE REQUEST
@transaction_bp.route('/request/<id>/approve', methods=['POST'])
@token_required
def approve_request(id):
    if not ObjectId.is_valid(id):
        return jsonify({"error": "Invalid request ID format."}), 400

    with mongo.cx.start_session() as session:
        with session.start_transaction():
            transaction = mongo.db.transactions.find_one({"_id": ObjectId(id)}, session=session)
            if not transaction:
                return jsonify({"error": "Request not found."}), 404
            if str(transaction["from"]) != g.user_id:
                return jsonify({"error": "You are not authorized to approve this request."}), 403
            if transaction["status"] != "pending":
                return jsonify({"error": "This request is no longer pending."}), 400

            from_user = mongo.db.users.find_one({"_id": ObjectId(transaction["from"])}, session=session)
            to_user = mongo.db.users.find_one({"_id": ObjectId(transaction["to"])}, session=session)

            if from_user["balance"] < transaction["amount"]:
                return jsonify({"error": "Insufficient funds to approve request."}), 400

            mongo.db.users.update_one({"_id": from_user["_id"]}, {"$inc": {"balance": -transaction["amount"]}}, session=session)
            mongo.db.users.update_one({"_id": to_user["_id"]}, {"$inc": {"balance": transaction["amount"]}}, session=session)

            mongo.db.transactions.update_one({"_id": ObjectId(id)}, {"$set": {"status": "completed"}}, session=session)

            return jsonify({"message": "Request approved and transaction completed."})

# ❌ DECLINE REQUEST
@transaction_bp.route('/request/<id>/decline', methods=['POST'])
@token_required
def decline_request(id):
    if not ObjectId.is_valid(id):
        return jsonify({"error": "Invalid request ID format."}), 400

    transaction = mongo.db.transactions.find_one({"_id": ObjectId(id)})
    if not transaction:
        return jsonify({"error": "Request not found."}), 404
    if str(transaction["from"]) != g.user_id:
        return jsonify({"error": "You are not authorized to decline this request."}), 403
    if transaction["status"] != "pending":
        return jsonify({"error": "This request is no longer pending."}), 400

    mongo.db.transactions.update_one({"_id": ObjectId(id)}, {"$set": {"status": "declined"}})
    return jsonify({"message": "Request declined."})

# 📜 GET RECENT TRANSACTIONS
@transaction_bp.route('/recent', methods=['GET'])
@token_required
def recent_transactions():
    user_id = ObjectId(g.user_id)

    pipeline = [
        {"$match": {
            "$or": [{"from": user_id}, {"to": user_id}]
        }},
        {"$sort": {"timestamp": -1}},
        {"$limit": 20},
        {"$lookup": {
            "from": "users",
            "localField": "from",
            "foreignField": "_id",
            "as": "fromUser"
        }},
        {"$lookup": {
            "from": "users",
            "localField": "to",
            "foreignField": "_id",
            "as": "toUser"
        }},
        {"$unwind": "$fromUser"},
        {"$unwind": "$toUser"}
    ]

    transactions = list(mongo.db.transactions.aggregate(pipeline))

    formatted = []
    for tx in transactions:
        is_sender = str(tx["fromUser"]["_id"]) == g.user_id
        other_party = tx["toUser"] if is_sender else tx["fromUser"]
        desc = ""
        if tx["status"] == "completed":
            desc = f"{'Payment to' if is_sender else 'Payment from'} {other_party['firstName']}"
        elif tx["status"] == "pending":
            desc = f"{'You have a pending request to' if is_sender else 'Request from'} {other_party['firstName']}"
        elif tx["status"] == "declined":
            desc = f"{'Your request to' if is_sender else 'You declined a request from'} {other_party['firstName']}"

        formatted.append({
            "id": str(tx["_id"]),
            "description": desc,
            "date": tx["timestamp"],
            "amount": -tx["amount"] if is_sender else tx["amount"],
            "type": "credit" if is_sender else "debit",
            "status": tx["status"],
            "otherParty": {
                "firstName": other_party["firstName"],
                "lastName": other_party["lastName"]
            }
        })

    return jsonify(formatted)

# 🕗 GET PENDING REQUESTS
@transaction_bp.route('/pending', methods=['GET'])
@token_required
def pending_requests():
    pending = list(mongo.db.transactions.find({
        "from": ObjectId(g.user_id),
        "status": "pending"
    }).sort("timestamp", DESCENDING))

    for tx in pending:
        tx["_id"] = str(tx["_id"])
        tx["to"] = str(tx["to"])
        tx["from"] = str(tx["from"])

    return jsonify(pending)
