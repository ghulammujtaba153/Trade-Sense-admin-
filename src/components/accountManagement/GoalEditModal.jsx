import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { API_URL } from '../../config/url';

const GoalEditModal = ({ isOpen, onClose, goal, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily',
    targetDate: '',
    reminders: { enabled: false },
    status: 'active',
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || '',
        description: goal.description || '',
        frequency: goal.frequency || 'daily',
        targetDate: goal.targetDate?.split('T')[0] || '',
        reminders: { enabled: goal.reminders?.enabled || false },
        status: goal.status || 'active',
      });
    }
  }, [goal]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'reminders.enabled') {
      setFormData((prev) => ({
        ...prev,
        reminders: {
          ...prev.reminders,
          enabled: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/goals/${goal._id}`, formData);
      onSave(); // to refetch or update list
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error updating goal');
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div
        className="bg-white rounded p-6 max-w-xl w-full mx-auto mt-20 shadow-lg"
        style={{ outline: 'none' }}
      >
        <h2 className="text-xl font-semibold mb-4">Edit Goal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Frequency</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Target Date</label>
            <input
              type="date"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="reminders.enabled"
              checked={formData.reminders.enabled}
              onChange={handleChange}
            />
            <label>Enable Reminders</label>
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 rounded bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default GoalEditModal;
