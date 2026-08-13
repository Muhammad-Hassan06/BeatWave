import React, { createContext, useState, useEffect, useRef, useContext } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const audio = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize Audio
  useEffect(() => {
    audio.current = new Audio();
    audio.current.volume = volume;

    const onTimeUpdate = () => {
      setCurrentTime(audio.current.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.current.duration || 0);
    };

    const onEnded = () => {
      handleNext();
    };

    audio.current.addEventListener("timeupdate", onTimeUpdate);
    audio.current.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.current.addEventListener("ended", onEnded);

    return () => {
      if (audio.current) {
        audio.current.pause();
        audio.current.removeEventListener("timeupdate", onTimeUpdate);
        audio.current.removeEventListener("loadedmetadata", onLoadedMetadata);
        audio.current.removeEventListener("ended", onEnded);
      }
    };
  }, []);

  // Handle source changes when track is updated
  useEffect(() => {
    if (!audio.current || !currentTrack) return;

    audio.current.src = currentTrack.uri;
    audio.current.load();
    
    if (isPlaying) {
      audio.current.play().catch((err) => console.log("Audio play error:", err));
    }
  }, [currentTrack]);

  // Handle play/pause toggle
  useEffect(() => {
    if (!audio.current || !currentTrack) return;

    if (isPlaying) {
      audio.current.play().catch((err) => console.log("Audio play error:", err));
    } else {
      audio.current.pause();
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (!audio.current) return;
    audio.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const playTrack = (track, newQueue = []) => {
    if (newQueue.length > 0) {
      setQueue(newQueue);
      const index = newQueue.findIndex((t) => t._id === track._id);
      setCurrentIndex(index >= 0 ? index : 0);
    } else {
      setQueue([track]);
      setCurrentIndex(0);
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!currentTrack && queue.length > 0) {
      // If queue exists but no current track, start with first item
      playTrack(queue[0], queue);
    } else if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (queue.length === 0 || currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (queue.length === 0 || currentIndex === -1) return;
    // If song is past 3 seconds, restart the song first
    if (audio.current && audio.current.currentTime > 3) {
      audio.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(true);
  };

  const seek = (time) => {
    if (!audio.current) return;
    audio.current.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        queue,
        currentIndex,
        currentTime,
        duration,
        volume,
        isMuted,
        setVolume,
        setIsMuted,
        playTrack,
        togglePlay,
        nextTrack: handleNext,
        previousTrack: handlePrevious,
        seek,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
