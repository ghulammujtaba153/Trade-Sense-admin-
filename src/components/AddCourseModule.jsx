import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { API_URL } from '../config/url';
import { AuthContext } from '../context/AuthContext';
import { uploadMedia } from '../utils/upload';
import Loading from './Loading';
import Select from 'react-select';

const AddCourseModule = ({ isOpen, onClose, data, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [modules, setModules] = useState(data?.modules || []);
  const [newModule, setNewModule] = useState({
    title: '',
    content: '',
    videoUrl: ''
  });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  
  

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'videoUrl' && files.length > 0) {
      setFile(files[0]);
    } else {
      setNewModule((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!newModule.title || !newModule.content || !file) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setUploading(true);
      const uploadedUrl = await uploadMedia(file, setUploadProgress);
      const updatedModules = [...modules, { ...newModule, videoUrl: uploadedUrl }];

      const jsonPayload = {
        creator: user._id,
        title: data.title,
        description: data.description,
        duration: data.duration,
        price: data.price,
        isPremium: data.isPremium,
        certificateAvailable: data.certificateAvailable,
        status: data.status,
        modules: updatedModules,
        thumbnail: data.thumbnail,
      };

      await axios.put(`${API_URL}/api/courses/${data._id}`, jsonPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUploading(false);
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error adding module');
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Add New Module</h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="title"
            value={newModule.title}
            onChange={handleInputChange}
            placeholder="Module Title"
            className="border rounded p-2"
          />
          <textarea
            name="content"
            value={newModule.content}
            onChange={handleInputChange}
            placeholder="Module Content"
            className="border rounded p-2"
            rows="4"
          />
          <input
            type="file"
            name="videoUrl"
            accept="video/*,audio/*"
            onChange={handleInputChange}
            className="border rounded p-2"
          />
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="bg-blue-600 h-2 rounded"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1 text-right">{uploadProgress.toFixed(0)}%</p>
          </div>
        )}

        <div className="flex justify-end mt-8 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading}
            className="px-4 py-2 bg-primary text-white rounded hover:scale-105 transition-transform"
          >
            {uploading ? <Loading/> : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourseModule;
