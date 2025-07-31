import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineWavingHand } from "react-icons/md";
import { Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import video from "@/assets/hello-there.mp4";

export const Route = createFileRoute("/authenticated/HelloPage")({
  component: HelloPage,
});

function HelloPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [hasSpoken, setHasSpoken] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const fetchMessage = useCallback(async () => {
    const query = name
      ? `?name=${encodeURIComponent(name)}&lang=${encodeURIComponent(lang)}`
      : `?lang=${encodeURIComponent(lang)}`;
    const res = await fetch(`/api/hello${query}`);
    const data = await res.json();
    setMessage(data.message);
  }, [name, lang]);

  useEffect(() => {
    if (message && videoRef.current) {
      videoRef.current.play();
    }
  }, [message]);

  // manage overlay
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

  // manage speech
  const sayMyName = useCallback(async () => {
    if (!message || hasSpoken) return;
    revealOverlay();
    setHasSpoken(true);
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = lang === "de" ? "de-DE" : "en-US";

    const voices = window.speechSynthesis
      .getVoices()
      .filter((v) => v.lang === lang);
    utterance.voice = voices[Math.floor(Math.random() * voices.length)]; // Use random voice

    speechSynthesis.speak(utterance);
    await new Promise((resolve) => {
      utterance.onend = resolve;
    });
  }, [message, hasSpoken, revealOverlay, lang]);

  // manage video
  const handleVideoEnd = useCallback(() => {
    if (videoRef.current) videoRef.current.style.opacity = "0";
    if (formRef.current) formRef.current.style.opacity = "1";
    hideOverlay();
  }, [videoRef, formRef, hideOverlay]);

  const handleVideoStart = useCallback(() => {
    if (videoRef.current) videoRef.current.style.opacity = "1";
    if (formRef.current) formRef.current.style.opacity = "0";

    setHasSpoken(false);
    hideOverlay();
  }, [formRef, hideOverlay]);

  const handleTimeUpdate = useCallback(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.currentTime >= 0.9) {
        sayMyName();
      }
    }
  }, [sayMyName]);

  // manage video event listeners
  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.addEventListener("ended", handleVideoEnd);
      videoEl.addEventListener("play", handleVideoStart);
      videoEl.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoEl) {
        videoEl.removeEventListener("ended", handleVideoEnd);
        videoEl.removeEventListener("play", handleVideoStart);
        videoEl.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [handleTimeUpdate, handleVideoEnd, handleVideoStart]);

  // manage form, autosubmit
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (name) {
        fetchMessage();
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [name, fetchMessage]);

  return (
    <div>
      <Heading as="h1" size="8" mb="6">
        <MdOutlineWavingHand size="28" /> {t("Hej!")}
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
        <Flex gap="5" justify="center">
          <Text size="8">{t("Whats Your Name?")}</Text>
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
          src={video}
          style={{
            transition: "opacity 0.5s ease-in-out",
            opacity: 0,
            width: "100%",
            objectFit: "cover",
            aspectRatio: "16/6.8", // remove black bars around video. Alternative: get better at video editing.
          }}
        />
      </div>
    </div>
  );
}
