# app/routes/qr_routes.py

from flask import Blueprint, request, Response, jsonify, g
from db import db as mongo
from middleware.middleware import token_required
import qrcode
import io
from bson import ObjectId

qr_bp = Blueprint("qr", __name__, url_prefix="/api/qr")

@qr_bp.route('/generate', methods=['GET'])
@token_required
def generate_qr():
    try:
        user = mongo.db.users.find_one({"_id": ObjectId(g.user_id)}, {"email": 1})
        if not user:
            return jsonify({"error": "User not found"}), 404

        payload = {
            "email": user["email"]
        }

        json_payload = str(payload).replace("'", '"')  # clean JSON-like string
        print("Generating QR Code with this exact data:", json_payload)

        # Generate QR image using qrcode
        qr_img = qrcode.make(json_payload)

        # Stream the image as PNG
        img_io = io.BytesIO()
        qr_img.save(img_io, 'PNG')
        img_io.seek(0)

        return Response(img_io.getvalue(), mimetype='image/png')

    except Exception as e:
        print("QR Generation Error:", str(e))
        return jsonify({"error": "Error generating QR code"}), 500
