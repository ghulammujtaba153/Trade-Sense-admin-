import React, { useEffect, useState } from 'react';

const VideoPlayer = ({ videoUrl, width = '100%', height = 'auto' }) => {
  const [MP4VideoPlayer, setMP4VideoPlayer] = useState(null);

  useEffect(() => {
    import('@thuoe/mp4-video-player').then((mod) => {
      // Try to get default or named export
      setMP4VideoPlayer(() => mod.default || mod.MP4VideoPlayer || Object.values(mod)[0]);
    });
  }, []);

  if (!videoUrl) return <p className="text-red-500 text-sm">Video source not found.</p>;
  if (!MP4VideoPlayer) return <p>Loading player...</p>;

  return (
    <div style={{ width, height }}>
      <MP4VideoPlayer
        src={videoUrl}
        autoPlay={false}
        controls={true}
        width={width}
        height={height}
      />
    </div>
  );
};

export default VideoPlayer;
