"use client";

import { useEffect, useRef, useState } from "react";
export function HeroVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start with opacity 0, fade in once playing starts
    const handlePlaying = () => {
      setOpacity(1);
    };

    const handleTimeUpdate = () => {
      // 0.8 seconds before the video ends, fade to 0
      const fadeOutTime = 0.8;
      if (video.duration && video.currentTime > video.duration - fadeOutTime) {
        setOpacity(0);
      } else if (opacity === 0 && video.currentTime > 0) {
        // Fade back in quickly when it loops
        setOpacity(1);
      }
    };

    video.addEventListener("playing", handlePlaying);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [opacity]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={{ opacity, transition: "opacity 0.8s ease-in-out" }}
      autoPlay
      loop
      muted
      playsInline
    >
      <source src="/videos/hero-bg.mp4" type="video/mp4" />
    </video>
  );
}
