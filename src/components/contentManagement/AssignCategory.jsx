import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/url';
import { toast } from 'react-toastify';

const AssignCategoryModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  // Fetch tags from the API and transform into an array of objects
  const fetchTags = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/pillars/categories/all`);
      // Map categories array into objects with _id and name
      const tagObjects = res.data.categories.map((tag, idx) => ({
        _id: idx.toString(), // Using index as _id (or could be another unique value)
        name: tag
      }));
      setTags(tagObjects);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch tags');
    }
  };

  // Handle assigning the selected tag to the user
  const handleAssign = async () => {
    try {
      // Find the tag object based on the selected _id
      const selectedTagObject = tags.find(tag => tag._id === selectedTag);
      // Send the selected tag name to the backend
      await axios.post(`${API_URL}/api/auth/category`, {
        userId: user._id,
        tagName: selectedTagObject?.name || ''
      });
      toast.success('Tag assigned successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error('Failed to assign tag');
    }
  };

  // Return null if modal is not open or if user is not passed
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Assign Tag to {user.name}</h2>

        <select
          className="w-full border p-2 rounded mb-4"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">Select Tag</option>
          {/* Render options from the tags array */}
          {tags.map(tag => (
            <option key={tag._id} value={tag._id}>{tag.name}</option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleAssign} className="bg-blue-600 text-white px-4 py-2 rounded">Assign</button>
        </div>
      </div>
    </div>
  );
};

export default AssignCategoryModal;
