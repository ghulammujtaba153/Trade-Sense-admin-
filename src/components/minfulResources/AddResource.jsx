import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/url';
import { uploadMedia } from '../../utils/upload';
import Loading from '../Loading';

const AddResource = ({ onClose, onSuccess, resource =null }) => {
  const initialState = resource ? {
    title: resource.title || '',
    type: resource.type || 'audio',
    category: resource.category || 'meditation',
    tags: resource.tags || [],
    duration: resource.duration?.toString() || '',
    isPremium: resource.isPremium || false,
    url: resource.url || '',
  } : {
    title: '',
    type: 'audio',
    category: 'meditation',
    tags: [],
    duration: '',
    isPremium: false,
    url: '',
  };
  console.log("prop", resource)
  
  const [formData, setFormData] = useState(initialState);
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const tagOptions = [
    'relaxation', 'confidence', 'mindfulness', 'energy boost',
    'focus', 'calm', 'anxiety relief', 'daily ritual', 'positivity'
  ];

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!file) return alert('Please select an audio/video file');

    try {
      setUploading(true);

      let uploadedUrl = formData.url;
      if (file) {
        uploadedUrl = await uploadMedia(file, setUploadProgress);
      }

      const resourceData = {
        ...formData,
        url: uploadedUrl,
        duration: Number(formData.duration)
      };

      if (resource) {
        await axios.put(`${API_URL}/api/resources/${resource._id}`, resourceData);
      } else {
        await axios.post(`${API_URL}/api/resources`, resourceData);
      }
      setUploading(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">
        {resource ? 'Edit Mindful Resource' : 'Add Mindful Resource'}
      </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              name="title"
              placeholder="Enter title"
              required
              className="w-full p-2 border rounded"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select name="type" className="w-full p-2 border rounded" onChange={handleChange} value={formData.type}>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select name="category" className="w-full p-2 border rounded" onChange={handleChange} value={formData.category}>
              <option value="meditation">Meditation</option>
              <option value="motivation">Motivation</option>
              <option value="affirmation">Affirmation</option>
              <option value="breathing">Breathing</option>
              <option value="focus">Focus</option>
              <option value="stress-relief">Stress Relief</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full border ${
                    formData.tags.includes(tag)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Duration (seconds)</label>
            <input
              name="duration"
              type="number"
              placeholder="Duration in seconds"
              required
              className="w-full p-2 border rounded"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPremium"
              checked={formData.isPremium}
              onChange={handleChange}
            />
            Premium Content
          </label>

          

          <div>
            <label className="block mb-1 font-medium">Upload File</label>
            <input
              type="file"
              accept={formData.type === 'audio' ? 'audio/*' : 'video/*'}
              required={!resource} // Only required if adding
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
            />
          </div>

          {uploading && (
            <div className="w-full bg-gray-200 rounded h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs mt-1 text-right">{uploadProgress}%</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {uploading ? <Loading /> : resource ? 'Update Resource' : 'Add Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResource;
