import React, { useRef, useState, useEffect } from 'react';
import { Howl, Howler } from 'howler';

const EnhancedAudioPlayer = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [bass, setBass] = useState(1);
  const [treble, setTreble] = useState(1);
  const soundRef = useRef(null);

  useEffect(() => {
    const sound = new Howl({
      src: [audioSrc],
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        setDuration(sound.duration());
      },
      onend: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onseek: () => {
        setCurrentTime(sound.seek());
      }
    });
    soundRef.current = sound;

    const updateProgress = () => {
      if (sound.playing()) {
        setCurrentTime(sound.seek());
        requestAnimationFrame(updateProgress);
      }
    };

    if (isPlaying) {
      requestAnimationFrame(updateProgress);
    }

    return () => {
      sound.unload();
    };
  }, [audioSrc, isPlaying, volume, bass, treble]);

  const handlePlayPause = () => {
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const handleSeek = (e) => {
    const seekTime = (duration * e.target.value) / 100;
    soundRef.current.seek(seekTime);
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="audio-player">
      <button onClick={handlePlayPause} className="bg-blue-500 text-white p-2 rounded-full">
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <div className="progress">
        <input
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100}
          onChange={handleSeek}
        />
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
      <div className="volume">
        <label>Volume</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </div>
      <div className="equalizer">
        <div>
          <label>Bass</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={bass}
            onChange={(e) => setBass(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Treble</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={treble}
            onChange={(e) => setTreble(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedAudioPlayer;
