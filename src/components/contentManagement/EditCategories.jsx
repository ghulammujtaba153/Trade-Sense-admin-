import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/url';
import { toast } from 'react-toastify';

const EditCategoriesModal = ({ isOpen, onClose, categories: propCategories, user, onSuccess }) => {
  const [localCategories, setLocalCategories] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLocalCategories(propCategories || []);
    }
  }, [isOpen, propCategories]);

  const handleRemove = (name) => {
    setLocalCategories(prev => prev.filter(cat => cat !== name));
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/category/update`, {
        userId: user._id,
        categories: localCategories,
      });
      toast.success('Categories updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error('Failed to update categories');
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Categories for {user.name}</h2>

        {localCategories.length > 0 ? (
          <ul className="mb-4">
            {localCategories.map((cat, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b py-2"
              >
                <span>{cat}</span>
                <button
                  onClick={() => handleRemove(cat)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-gray-600">No categories available.</p>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoriesModal;
