import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config/url';
import { toast } from 'react-toastify';
import upload from '../utils/upload';
import { AuthContext } from '../context/AuthContext';
import Loading from './Loading';

const CourseModal = ({ isOpen, onClose, courseData, onSuccess }) => {
    const [data, setData] = useState({
        title: '',
        thumbnail: '',
        description: '',
        duration: '',
        price: 0,
        modules: [{ title: '', content: '', videoUrl: '' }],
        isPremium: false,
        certificateAvailable: true,
        status: 'published'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const {user} =useContext(AuthContext);
    console.log(user);

    useEffect(() => {
        if (courseData) {
            setData({
                title: courseData.title || '',
                thumbnail: courseData.thumbnail || '',
                description: courseData.description || '',
                duration: courseData.duration || '',
                price: courseData.price || 0,
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
            price: 0,
            modules: [{ title: '', content: '', videoUrl: '' }],
            isPremium: false,
            certificateAvailable: false,
            status: 'published'
        });
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

    const handleModuleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedModules = [...data.modules];
        updatedModules[index][name] = value;
        setData(prev => ({ ...prev, modules: updatedModules }));
    };

    const addModule = () => {
        setData(prev => ({
            ...prev,
            modules: [...prev.modules, { title: '', content: '', videoUrl: '' }]
        }));
    };

    const removeModule = (index) => {
        if (data.modules.length <= 1) return;
        const updatedModules = [...data.modules];
        updatedModules.splice(index, 1);
        setData(prev => ({ ...prev, modules: updatedModules }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        try {
            let thumbnailUrl = '';
    
            // Upload image if it's a File
            if (data.thumbnail instanceof File) {
                thumbnailUrl = await upload(data.thumbnail); // Assuming upload() returns the image URL
            } else if (data.thumbnail) {
                thumbnailUrl = data.thumbnail; // Already a URL
            }
    
            const jsonPayload = {
                creator: user._id,
                title: data.title,
                description: data.description,
                duration: data.duration,
                price: data.price,
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-800">Duration*</label>
                                <input 
                                    type="text" 
                                    name="duration"
                                    value={data.duration}
                                    onChange={handleChange}
                                    className="p-2 border rounded-md w-full"
                                    placeholder="e.g., 4 weeks, 30 hours"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-800">Price*</label>
                                <input 
                                    type="number" 
                                    name="price"
                                    value={data.price}
                                    onChange={handleChange}
                                    className="p-2 border rounded-md w-full"
                                    min="0"
                                    step="0.01"
                                    required
                                />
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

                            {/* <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="certificateAvailable"
                                    name="certificateAvailable"
                                    checked={data.certificateAvailable}
                                    onChange={handleChange}
                                    className="h-4 w-4"
                                />
                                <label htmlFor="certificateAvailable" className="text-sm text-gray-800">
                                    Certificate Available
                                </label>
                            </div> */}
                        </div>

                        {/* <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium">Course Modules</h3>
                                <button
                                    type="button"
                                    onClick={addModule}
                                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Add Module
                                </button>
                            </div>

                            {data.modules.map((module, index) => (
                                <div key={index} className="mb-6 p-4 border rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium">Module {index + 1}</h4>
                                        {data.modules.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeModule(index)}
                                                className="text-sm text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm text-gray-800">Title*</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={module.title}
                                                onChange={(e) => handleModuleChange(index, e)}
                                                className="p-2 border rounded-md w-full"
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm text-gray-800">Content*</label>
                                            <textarea
                                                name="content"
                                                value={module.content}
                                                onChange={(e) => handleModuleChange(index, e)}
                                                className="p-2 border rounded-md w-full h-20"
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm text-gray-800">Audio URL*</label>
                                            <input
                                                type="text"
                                                name="videoUrl"
                                                value={module.videoUrl}
                                                onChange={(e) => handleModuleChange(index, e)}
                                                className="p-2 border rounded-md w-full"
                                                placeholder="https://example.com/video.mp4"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div> */}

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
                                    <Loading/>
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