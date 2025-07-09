# app.py
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})


# Register routes
from routes.auth_routes import auth_bp
from routes.qr_routes import qr_bp
from routes.transaction_routes import transaction_bp

app.register_blueprint(auth_bp)
app.register_blueprint(qr_bp)
app.register_blueprint(transaction_bp)

@app.route("/")
def home():
    return {"message": "💸 Payment App is Live"}

if __name__ == "__main__":
    app.run(debug=True)
