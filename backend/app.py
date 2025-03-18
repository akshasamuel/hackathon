from flask import Flask, jsonify
from routes.auth import auth_bp
from routes.tts import tts_bp
from config import DEBUG, HOST, PORT

app = Flask(__name__)

# Register Blueprints (Routes)
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(tts_bp, url_prefix="/tts")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "🎤 TTS API is running! 🚀"})

if __name__ == "__main__":
    app.run(debug=DEBUG, host=HOST, port=PORT)
