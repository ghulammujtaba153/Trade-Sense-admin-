import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/url';
import { toast } from 'react-toastify';

const PlanModal = ({ isOpen, onClose, planData, onSuccess }) => {
    const [data, setData] = useState({
        name: '',
        price: 0,
        description: '',
        category: 'monthly'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Available plan categories
    const categories = [
        { value: 'monthly', label: 'Monthly Package' },
        { value: 'yearly', label: 'Yearly Package' },
        { value: 'lifetime', label: 'Lifetime Package' }
    ];

    useEffect(() => {
        if (planData) {
            setData({
                name: planData.name || '',
                price: planData.price || 0,
                description: planData.description || '',
                category: planData.category || 'monthly'
            });
            setIsEditMode(true);
        } else {
            resetForm();
        }
    }, [planData]);

    const resetForm = () => {
        setData({
            name: '',
            price: 0,
            description: '',
            category: 'monthly'
        });
        setIsEditMode(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (isEditMode) {
                await axios.put(`${API_URL}/api/plans/${planData._id}`, data);
                toast.success('Plan updated successfully');
            } else {
                await axios.post(`${API_URL}/api/plans`, data);
                toast.success('Plan created successfully');
            }
            onSuccess();
            onClose();
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'Operation failed');
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            {isEditMode ? 'Edit Plan' : 'Add New Plan'}
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
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-800">Plan Name*</label>
                            <input 
                                type="text" 
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                className="p-2 border rounded-md w-full"
                                required
                            />
                        </div>

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
                            <label className="text-sm text-gray-800">Category*</label>
                            <select 
                                name="category"
                                value={data.category}
                                onChange={handleChange}
                                className="p-2 border rounded-md w-full"
                                required
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-800">Description*</label>
                            <textarea
                                name="description"
                                value={data.description}
                                onChange={handleChange}
                                className="p-2 border rounded-md w-full h-24"
                                required
                            />
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
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : isEditMode ? 'Update Plan' : 'Create Plan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PlanModal;