import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineWavingHand } from "react-icons/md";
import { Flex, Heading, Text, TextField } from "@radix-ui/themes";

export const Route = createFileRoute("/authenticated/HelloPage")({
  component: HelloPage,
});

// TODO:
// - language
// - sort code
// - choose voice
// - set doc lang

function HelloPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [hasSpoken, setHasSpoken] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const fetchMessage = useCallback(async () => {
    const query = name ? `?name=${encodeURIComponent(name)}` : "";
    const res = await fetch(`/api/hello${query}`);
    const data = await res.json();
    setMessage(data.message);
  }, [name]);

  useEffect(() => {
    if (message && videoRef.current) {
      videoRef.current.play();
    }
  }, [message]);

  const revealOverlay = useCallback(() => {
    wordRefs.current.forEach((w, index) => {
      setTimeout(() => {
        w.style.opacity = "1";
      }, index * 150);
    });
  }, [wordRefs]);

  const hideOverlay = useCallback(() => {
    wordRefs.current.forEach((w) => {
      w.style.opacity = "0";
    });
  }, [wordRefs]);

  const handleVideoEnd = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.style.opacity = "0";
      hideOverlay();
    }
  }, [videoRef, hideOverlay]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("ended", handleVideoEnd);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("ended", handleVideoEnd);
      }
    };
  }, [videoRef, handleVideoEnd]);

  useEffect(() => {
    const handleVideoStart = () => {
      if (videoRef.current) {
        videoRef.current.style.opacity = "1";
      }
      setHasSpoken(false);
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("play", handleVideoStart);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("play", handleVideoStart);
      }
    };
  }, []);

  const synth = window.speechSynthesis;

  const voices = synth.getVoices().filter((voice) => voice.lang === "de-DE");
  const voice = voices[1];
  const sayMyName = useCallback(async () => {
    if (!message || hasSpoken) return;
    revealOverlay();
    setHasSpoken(true);
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "de-DE";
    utterance.voice = voice;
    speechSynthesis.speak(utterance);
    await new Promise((resolve) => {
      utterance.onend = resolve;
    });
  }, [message, voice, hasSpoken]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      const videoElement = videoRef.current;
      if (videoElement) {
        if (videoElement.currentTime >= 0.9) {
          sayMyName();
        }
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [sayMyName]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (name) {
        fetchMessage();
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [name, fetchMessage]);

  useEffect(() => {
    const handleVideoStart = () => {
      if (formRef.current) {
        formRef.current.style.opacity = "0";
      }
      hideOverlay();
    };

    const handleVideoEnd = () => {
      if (formRef.current) {
        formRef.current.style.opacity = "1";
      }
      hideOverlay();
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("play", handleVideoStart);
      videoElement.addEventListener("ended", handleVideoEnd);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("play", handleVideoStart);
        videoElement.removeEventListener("ended", handleVideoEnd);
      }
    };
  }, []);

  return (
    <div>
      <Heading as="h1" size="8" mb="6">
        <MdOutlineWavingHand size="28" /> Hej!
      </Heading>

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          fetchMessage();
        }}
        style={{
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <Flex gap="5">
          <Text size="8">Whats Your Name?</Text>
          <TextField.Root
            size="3"
            style={{ width: "50%" }}
            variant="soft"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Flex>
      </form>

      <div style={{ position: "relative" }}>
        <div
          id="video-overlay"
          style={{
            position: "absolute",
            top: "15%",
            right: "5%",
            color: "white",
            fontSize: "64px",
            width: "30%",
            textAlign: "left",
          }}
        >
          {message.split(" ").map((word, i) => (
            <span
              key={word}
              ref={(el) => el && (wordRefs.current[i] = el)}
              style={{ opacity: "0", transition: "opacity 0.1s ease-in-out" }}
            >
              {" "}
              {word}
            </span>
          ))}
        </div>
        <video
          muted
          // autoPlay
          // loop
          ref={videoRef}
          src="/src/assets/hello-there.mp4"
          style={{
            transition: "opacity 0.5s ease-in-out",
            opacity: 0,
            width: "100%",
            height: "340px",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}
