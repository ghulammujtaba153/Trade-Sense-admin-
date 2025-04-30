import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { API_URL } from '../config/url';
import { AuthContext } from '../context/AuthContext';

const CourseModuleModal = ({ isOpen, onClose, data, onSuccess }) => {
    const { user } = useContext(AuthContext);

    const [modules, setModules] = useState(data?.modules || []);
    console.log("modules", data)

    const handleDeleteModule = (index) => {
        const updatedModules = modules.filter((_, i) => i !== index);
        setModules(updatedModules);
    };

    const updateModule = async () => {
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
                modules: modules, // updated modules here
                thumbnail: data.thumbnail,
            };

            await axios.put(`${API_URL}/api/courses/${data._id}`, jsonPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success('Course updated successfully');
            onSuccess && onSuccess(); // optional: call onSuccess if passed
            onClose(); // close modal
        } catch (error) {
            console.error(error);
            toast.error('Error updating course');
        }
    };

    if (!isOpen) return null;

    
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-4">Modules</h2>

                {
                    modules.length === 0 &&
                    <p className="text-gray-600">No modules found.</p>
                }

                
                {/* List all modules */}
                <div className="space-y-4">
                    {modules.map((module, index) => (
                        <div key={module._id || index} className="border p-4 rounded-md flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-lg">{module.title}</h3>
                                <p className="text-gray-600">{module.content}</p>
                                <audio controls className="w-full mt-2">
                                    <source src={module.videoUrl} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                            <button
                                onClick={() => handleDeleteModule(index)}
                                className="text-red-500 hover:text-red-700 font-semibold"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* Update button */}
                <div className="flex justify-end mt-6 space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={updateModule}
                        className="px-4 py-2 bg-primary text-white rounded hover:scale-105 transition duration-300 ease-in-out"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CourseModuleModal;
