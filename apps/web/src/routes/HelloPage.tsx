import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/HelloPage")({
  component: HelloPage,
});

function HelloPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const fetchMessage = async () => {
    const query = name ? `?name=${encodeURIComponent(name)}` : "";
    const res = await fetch(`/api/hello${query}`);
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hello Page</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <button onClick={fetchMessage}>Get Message</button>
      <p>{message}</p>
    </div>
  );
}
