import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/url';
import { toast } from 'react-toastify';
import Loading from './Loading';

const UserModal = ({ isOpen, onClose, userData, onSuccess }) => {
    const [data, setData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        role: 'user',
        experienceLevel: 'beginner',
        status: 'active'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (userData) {
            setData({
                name: userData.name || '',
                phone: userData.phone || '',
                email: userData.email || '',
                password: '',
                role: userData.role || 'user',
                experienceLevel: userData.experienceLevel || 'beginner',
                status: userData.status || 'active'
            });
            setIsEditMode(true);
        } else {
            setData({
                name: '',
                phone: '',
                email: '',
                password: '',
                role: 'user',
                experienceLevel: 'beginner',
                status: 'active'
            });
            setIsEditMode(false);
        }
    }, [userData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (isEditMode) {
                await axios.put(`${API_URL}/api/auth/users/update/${userData._id}`, data);
                toast.success('User updated successfully');
            } else {
                await axios.post(`${API_URL}/api/auth/register`, data);
                toast.success('User created successfully');
            }
            onSuccess();
            onClose();
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
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            {isEditMode ? 'Edit User' : 'Add New User'}
                        </h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm text-gray-800'>Name*</label>
                            <input 
                                type="text" 
                                value={data.name}
                                onChange={e => setData({...data, name: e.target.value})} 
                                className='p-2 border rounded-md w-full'
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-sm text-gray-800'>Phone*</label>
                            <input 
                                type="tel" 
                                value={data.phone}
                                onChange={e => setData({...data, phone: e.target.value})} 
                                className='p-2 border rounded-md w-full'
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-sm text-gray-800'>Email*</label>
                            <input 
                                type="email" 
                                value={data.email}
                                onChange={e => setData({...data, email: e.target.value})} 
                                className='p-2 border rounded-md w-full'
                                required
                            />
                        </div>

                        {!isEditMode && (
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm text-gray-800'>Password*</label>
                                <input 
                                    type="password" 
                                    value={data.password}
                                    onChange={e => setData({...data, password: e.target.value})} 
                                    className='p-2 border rounded-md w-full'
                                    required
                                    minLength={6}
                                />
                            </div>
                        )}

                        <div className='flex flex-col gap-1'>
                            <label className='text-sm text-gray-800'>Role*</label>
                            <select 
                                value={data.role}
                                onChange={e => setData({...data, role: e.target.value})} 
                                className='p-2 border rounded-md w-full'
                                required
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='text-sm text-gray-800'>Experience Level*</label>
                            <select 
                                value={data.experienceLevel}
                                onChange={e => setData({...data, experienceLevel: e.target.value})} 
                                className='p-2 border rounded-md w-full'
                                required
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        {isEditMode && (
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm text-gray-800'>Status*</label>
                                <select 
                                    value={data.status}
                                    onChange={e => setData({...data, status: e.target.value})} 
                                    className='p-2 border rounded-md w-full'
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        )}

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
                                {loading ? <Loading/> : isEditMode ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserModal;