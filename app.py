from flask import Flask, request, jsonify, render_template

from flask_cors import CORS
import sqlite3

app = Flask(__name__) # ✅ FIRST define app
CORS(app, origins="*") 
DB_NAME = "yt_vid.db"


# 🏠 Home route
@app.route("/")
def home():
    return render_template("index.html")


# 🔌 Database connection
def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


# 🛠️ Initialize DB
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS videos(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            time TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()


# 📥 GET videos
@app.route("/videos", methods=["GET"])
def get_videos():
    conn = get_db_connection()
    videos = conn.execute("SELECT * FROM videos").fetchall()
    conn.close()

    return jsonify([dict(video) for video in videos])


# ➕ POST video
@app.route("/videos", methods=["POST"])
def add_video():
    data = request.get_json()

    name = data.get("name")
    time = data.get("time")

    if not name or not time:
        return jsonify({"error": "Name and time required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO videos (name, time) VALUES (?, ?)",
        (name, time)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return jsonify({"message": "Video added", "id": new_id}), 201


# 🔄 PUT video
@app.route("/videos/<int:video_id>", methods=["PUT"])
def update_video(video_id):
    data = request.get_json()

    name = data.get("name")
    time = data.get("time")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE videos SET name=?, time=? WHERE id=?",
        (name, time, video_id)
    )
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Video not found"}), 404

    conn.close()
    return jsonify({"message": "Video updated"})


# ❌ DELETE video
@app.route("/videos/<int:video_id>", methods=["DELETE"])
def delete_video(video_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM videos WHERE id=?", (video_id,))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Video not found"}), 404

    conn.close()
    return jsonify({"message": "Video deleted"})


# ▶️ Run
if __name__ == "__main__":
    init_db()
    app.run(debug=True)