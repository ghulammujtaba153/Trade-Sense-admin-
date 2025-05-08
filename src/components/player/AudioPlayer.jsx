import React from 'react';
import AudioPlayerLib from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AudioPlayer = ({ audio }) => {
  if (!audio) {
    return (
      <p className="text-red-500 text-sm">Audio source not found.</p>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 p-4 rounded-lg bg-white shadow-md">
      <AudioPlayerLib
        src={audio}
        autoPlay={false}
        showJumpControls={false}
        customAdditionalControls={[]}
        layout="horizontal"
        className="rounded"
      />
    </div>
  );
};

export default AudioPlayer;
