import React from 'react';
import AudioPlayer from '../player/AudioPlayer';

const ModuleModal = ({ modules, isOpen, onClose }) => {
  if (!isOpen) return null;
  console.log(modules);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Modules</h2>

        <div className="space-y-4">
          {modules?.length > 0 ? (
            modules.map((module, index) => (
              <div key={index} className="border p-4 rounded shadow">
                <h3 className="text-lg font-medium mb-2">{module.title}</h3>
                <AudioPlayer audio={module.videoUrl} />
              </div>
            ))
          ) : (
            <p>No modules available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleModal;
