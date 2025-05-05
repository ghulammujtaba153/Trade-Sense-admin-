// components/minfulResources/ViewResourceModal.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ViewResourceModal = ({ open, onClose, resource }) => {
  if (!resource) return null;

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
          <audio controls className="w-full mt-2">
            <source src={resource.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <video controls className="w-full mt-2 rounded-lg">
            <source src={resource.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewResourceModal;
