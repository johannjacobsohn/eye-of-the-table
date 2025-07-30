import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MdOutlineWavingHand } from "react-icons/md";
import { Heading } from "@radix-ui/themes";

export const Route = createFileRoute("/authenticated/HelloPage")({
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
    <div>
      <Heading as="h1" size="8">
        <MdOutlineWavingHand size="28" /> Hej!
      </Heading>

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
