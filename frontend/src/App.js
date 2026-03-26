import { useEffect, useState } from "react";

const API = "https://youtube-video-manager.onrender.com/videos";

function App() {
  const [videos, setVideos] = useState([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  const loadVideos = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setVideos(data);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const addVideo = async () => {
    if (!name || !time) return alert("Fill all fields");

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, time }),
    });

    setName("");
    setTime("");
    loadVideos();
  };

  const deleteVideo = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadVideos();
  };

  const updateVideo = async (id) => {
    const newName = prompt("New name:");
    const newTime = prompt("New time:");

    if (!newName || !newTime) return;

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, time: newTime }),
    });

    loadVideos();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        padding: "30px",
        color: "white",
        fontFamily: "Poppins",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        🎬 Video Manager
      </h1>

      {/* INPUT SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          placeholder="Video name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <input
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <button
          onClick={addVideo}
          style={{
            background: "#00c896",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {/* VIDEO GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {videos.map((video) => (
          <div
            key={video.id}
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "20px",
              borderRadius: "15px",
              backdropFilter: "blur(10px)",
              transition: "0.3s",
            }}
          >
            <h3>{video.name}</h3>
            <p>{video.time}</p>

            <button
              onClick={() => deleteVideo(video.id)}
              style={{
                background: "#ff4d4d",
                border: "none",
                padding: "8px",
                borderRadius: "6px",
                color: "white",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>

            <button
              onClick={() => updateVideo(video.id)}
              style={{
                background: "#ffaa00",
                border: "none",
                padding: "8px",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;