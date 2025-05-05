import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config/url';
import { toast } from 'react-toastify';
import upload from '../utils/upload';
import { AuthContext } from '../context/AuthContext';
import Loading from './Loading';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  Chip
} from '@mui/material';

const CourseModal = ({ isOpen, onClose, courseData, onSuccess }) => {
  console.log("course data",courseData);
  const [data, setData] = useState({
    title: '',
    thumbnail: '',
    description: '',
    duration: '',
    plan: [],
    modules: [{ title: '', content: '', videoUrl: '' }],
    isPremium: false,
    certificateAvailable: true,
    status: 'published'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const { user } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/plans/membership`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPlans(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (courseData) {
      setData({
        title: courseData.title || '',
        thumbnail: courseData.thumbnail || '',
        description: courseData.description || '',
        duration: courseData.duration || '',
        plan: courseData.plan || [],
        modules: courseData.modules?.length ?
          courseData.modules.map(m => ({
            title: m.title || '',
            content: m.content || '',
            videoUrl: m.videoUrl || ''
          })) : [{ title: '', content: '', videoUrl: '' }],
        isPremium: courseData.isPremium || false,
        certificateAvailable: courseData.certificateAvailable || false,
        status: courseData.status || 'published'
      });
      setSelectedPlans(courseData.plan || []);
      if (courseData.thumbnail) setThumbnailPreview(courseData.thumbnail);
      setIsEditMode(true);
    } else {
      resetForm();
    }
  }, [courseData]);

  const resetForm = () => {
    setData({
      title: '',
      thumbnail: '',
      description: '',
      duration: '',
      plan: [],
      modules: [{ title: '', content: '', videoUrl: '' }],
      isPremium: false,
      certificateAvailable: false,
      status: 'published'
    });
    setSelectedPlans([]);
    setThumbnailPreview('');
    setIsEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setData(prev => ({ ...prev, thumbnail: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlanChange = (event) => {
    const {
      target: { value },
    } = event;
    
    // On autofill we get a stringified value.
    const selectedPlanIds = typeof value === 'string' ? value.split(',') : value;
    
    setSelectedPlans(selectedPlanIds);
    setData(prev => ({
      ...prev,
      plan: selectedPlanIds
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let thumbnailUrl = '';

      if (data.thumbnail instanceof File) {
        thumbnailUrl = await upload(data.thumbnail);
      } else if (data.thumbnail) {
        thumbnailUrl = data.thumbnail;
      }

      const jsonPayload = {
        creator: user._id,
        title: data.title,
        description: data.description,
        duration: data.duration,
        plan: data.plan,
        isPremium: data.isPremium,
        certificateAvailable: data.certificateAvailable,
        status: data.status,
        modules: data.modules,
        thumbnail: thumbnailUrl
      };

      if (isEditMode) {
        await axios.put(`${API_URL}/api/courses/${courseData._id}`, jsonPayload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Course updated successfully');
      } else {
        await axios.post(`${API_URL}/api/courses`, jsonPayload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Course created successfully');
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isEditMode ? 'Edit Course' : 'Add New Course'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-800">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={data.title}
                  onChange={handleChange}
                  className="p-2 border rounded-md w-full"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <FormControl fullWidth>
                  <InputLabel id="plans-select-label">Select Plans</InputLabel>
                  <Select
                    labelId="plans-select-label"
                    id="plans-select"
                    multiple
                    value={selectedPlans}
                    onChange={handlePlanChange}
                    label="Select Plans"
                    renderValue={(selected) => (
                      <div className="flex flex-wrap gap-1">
                        {selected.map((planId) => {
                          const plan = plans.find(p => p._id === planId);
                          return plan ? (
                            <Chip 
                              key={planId} 
                              label={`${plan.name} ($${plan.price})`} 
                              className="m-1"
                            />
                          ) : null;
                        })}
                      </div>
                    )}
                  >
                    {plans.map((plan) => (
                      <MenuItem key={plan._id} value={plan._id}>
                        <Checkbox checked={selectedPlans.indexOf(plan._id) > -1} />
                        <ListItemText primary={`${plan.name} ($${plan.price})`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-800">Status*</label>
                <select
                  name="status"
                  value={data.status}
                  onChange={handleChange}
                  className="p-2 border rounded-md w-full"
                  required
                >
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-800">Description*</label>
              <textarea
                name="description"
                value={data.description}
                onChange={handleChange}
                className="p-2 border rounded-md w-full h-32"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-800">Thumbnail*</label>
              {thumbnailPreview && (
                <div className="mb-2">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="h-32 object-cover rounded-md"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="p-2 border rounded-md w-full"
                required={!isEditMode}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPremium"
                  name="isPremium"
                  checked={data.isPremium}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <label htmlFor="isPremium" className="text-sm text-gray-800">
                  Premium Course
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-scale-105 transition-transform disabled:opacity-50"
              >
                {loading ? (
                  <Loading />
                ) : isEditMode ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;