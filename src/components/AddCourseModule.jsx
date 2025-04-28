import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { API_URL } from '../config/url';
import { AuthContext } from '../context/AuthContext';

const AddCourseModule = ({ isOpen, onClose, data, onSuccess }) => {
    const { user } = useContext(AuthContext);

    const [modules, setModules] = useState(data?.modules || []);

    const [newModule, setNewModule] = useState({
        title: '',
        content: '',
        videoUrl: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewModule((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!newModule.title || !newModule.content || !newModule.videoUrl) {
            toast.error('Please fill all fields');
            return;
        }

        const updatedModules = [...modules, newModule];

        try {
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

            // toast.success('Module added successfully');
            onSuccess && onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Error adding module');
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
                        type="text"
                        name="videoUrl"
                        value={newModule.videoUrl}
                        onChange={handleInputChange}
                        placeholder="Audio URL"
                        className="border rounded p-2"
                    />
                </div>

                {/* Save/Cancel buttons */}
                <div className="flex justify-end mt-8 space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCourseModule;
