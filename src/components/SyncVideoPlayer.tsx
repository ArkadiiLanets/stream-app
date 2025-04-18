import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "../firebase/config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export default function SyncVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [syncData, setSyncData] = useState({
    currentTime: 0,
    isPlaying: false,
  });

  const docRef = doc(db, "sync", "videoRoom1");

  // Listen to Firestore changes
  useEffect(() => {
    const unsub = onSnapshot(docRef, (docSnap) => {
      const data = docSnap.data();
      if (data && videoRef.current) {
        const video = videoRef.current;

        if (Math.abs(video.currentTime - data.currentTime) > 1) {
          video.currentTime = data.currentTime;
        }

        if (data.isPlaying && video.paused) {
          video.play();
        } else if (!data.isPlaying && !video.paused) {
          video.pause();
        }
      }
    });
    return () => unsub();
  }, []);

  // Update Firestore when local video is controlled
  const updateSync = (isPlaying: boolean) => {
    if (videoRef.current) {
      setDoc(docRef, {
        currentTime: videoRef.current.currentTime,
        isPlaying,
      });
    }
  };

  return (
    <div className="container py-4">
      <h4>Синхронизированный плеер</h4>
      <video
        ref={videoRef}
        width="100%"
        controls
        onPlay={() => updateSync(true)}
        onPause={() => updateSync(false)}
        onSeeked={() => updateSync(!videoRef.current?.paused)}
      >
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
    </div>
  );
}
