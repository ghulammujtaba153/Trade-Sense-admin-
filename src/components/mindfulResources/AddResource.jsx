import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/url';
import { uploadMedia } from '../../utils/upload';
import Loading from '../Loading';

const AddResource = ({ onClose, onSuccess, resource = null }) => {
  const [pillars, setPillars] = useState([]);
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    type: resource?.type || 'audio',
    category: resource?.category || '',
    tags: resource?.tags || [],
    pillar: resource?.pillar || '',
    isPremium: resource?.isPremium || false,
    url: resource?.url || '',
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const tagOptions = [
    'relaxation', 'confidence', 'mindfulness', 'energy boost',
    'focus', 'calm', 'anxiety relief', 'daily ritual', 'positivity'
  ];

  const fetchPillars = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/pillars/categories`);
      setPillars(res.data);
    } catch (error) {
      console.error("Failed to fetch pillars:", error);
    }
  };

  useEffect(() => {
    fetchPillars();
  }, []);

  const getCategoriesForPillar = (pillarName) => {
    const pillar = pillars.find(p => p.name === pillarName);
    return pillar ? pillar.categories : [];
  };

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
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'pillar' && { category: '' }) // reset category on pillar change
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      let uploadedUrl = formData.url;
      if (file) {
        uploadedUrl = await uploadMedia(file, setUploadProgress);
      }

      const resourceData = {
        ...formData,
        url: uploadedUrl,
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
              required
              placeholder="Enter title"
              className="w-full p-2 border rounded"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select name="type" className="w-full p-2 border rounded" value={formData.type} onChange={handleChange}>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Pillar</label>
            <select name="pillar" className="w-full p-2 border rounded" value={formData.pillar} onChange={handleChange}>
              <option value="">Select Pillar</option>
              {pillars.map(p => (
                <option key={p._id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              name="category"
              className="w-full p-2 border rounded"
              value={formData.category}
              onChange={handleChange}
              disabled={!formData.pillar}
            >
              <option value="">Select Category</option>
              {getCategoriesForPillar(formData.pillar).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
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
              required={!resource}
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
            />
          </div>

          {uploading && (
            <div className="w-full bg-gray-200 rounded h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${uploadProgress}%` }}
              />
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
