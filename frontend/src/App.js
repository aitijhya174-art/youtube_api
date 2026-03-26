import { useEffect, useState } from "react";

const API = "https://youtube-video-manager.onrender.com/videos";

function App() {
  const [videos, setVideos] = useState([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  const loadVideos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Error loading videos:", err);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const addVideo = async () => {
    if (!name || !time) return alert("Fill all fields");

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, time }),
    });

    setName("");
    setTime("");
    loadVideos();
  };

  const deleteVideo = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    loadVideos();
  };

  const updateVideo = async (id) => {
    const newName = prompt("Enter new name:");
    const newTime = prompt("Enter new time:");

    if (!newName || !newTime) return;

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName, time: newTime }),
    });

    loadVideos();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🎬 Video Manager</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Video name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: 10, padding: 8 }}
        />

        <input
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ marginRight: 10, padding: 8 }}
        />

        <button onClick={addVideo}>Add</button>
      </div>

      {videos.length === 0 ? (
        <p>No videos found</p>
      ) : (
        videos.map((video) => (
          <div
            key={video.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <b>{video.name}</b> ({video.time})
            <br />

            <button onClick={() => deleteVideo(video.id)}>
              Delete
            </button>

            <button
              onClick={() => updateVideo(video.id)}
              style={{ marginLeft: 10 }}
            >
              Edit
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;