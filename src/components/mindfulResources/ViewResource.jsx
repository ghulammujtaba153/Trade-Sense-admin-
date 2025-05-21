import React, { useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AudioPlayer from '../player/AudioPlayer';

const ViewResourceModal = ({ open, onClose, resource }) => {
  const videoRef = useRef(null);

  if (!resource) return null;

  // Key for localStorage, unique per resource _id
  const storageKey = `video-progress-${resource._id}`;

  // Load saved time when metadata is loaded
  const handleLoadedMetadata = () => {
    const savedTime = localStorage.getItem(storageKey);
    if (videoRef.current && savedTime) {
      videoRef.current.currentTime = parseFloat(savedTime);
    }
  };

  // Save time periodically while video is playing
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      localStorage.setItem(storageKey, videoRef.current.currentTime);
      console.log(`Saved at: ${videoRef.current.currentTime}`);
    }
  };

 
  const handlePause = () => {
    if (videoRef.current) {
      localStorage.setItem(storageKey, videoRef.current.currentTime);
      console.log(`Paused at: ${videoRef.current.currentTime}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        {resource.title}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="space-y-4">
        <p><strong>Type:</strong> {resource.type}</p>
        <p><strong>Pillar:</strong> {resource.pillar}</p>
        <p><strong>Category:</strong> {resource.category}</p>
        <p><strong>Tags:</strong> {resource.tags.join(', ')}</p>
        <p><strong>Premium:</strong> {resource.isPremium ? 'Yes' : 'No'}</p>

        {resource.type === 'audio' ? (
          <AudioPlayer audio={resource.url} />
        ) : (
          <video
            controls
            ref={videoRef}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPause={handlePause}
            className="w-full mt-2 rounded-lg"
          >
            <source src={resource.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewResourceModal;
