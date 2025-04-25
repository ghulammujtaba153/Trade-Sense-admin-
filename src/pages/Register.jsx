import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/url';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [data, setData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        role: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);  // New success state
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setSuccess(false);  // Reset success state
        
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, data);
            console.log(res.data);
            
            // Only clear form if registration was successful
            setData({
                name: '',
                phone: '',
                email: '',
                password: '',
                role: ''
            });
            setSuccess(true);  // Set success state
            toast.success('User added successfully!');
            
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || 'Registration failed');
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-screen flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-[#dae2ee] flex flex-col gap-4 p-10 rounded-lg shadow-lg max-w-[600px]">

                {/* Error message */}
                {error && <p className='text-red-500'>{error}</p>}
                
                {/* Success message */}
                {success && (
                    <p className='text-green-500'>
                        Registration successful! 
                    </p>
                )}

                <div className='flex flex-col gap-1'>
                    <label className='text-sm text-gray-800'>Name</label>
                    <input 
                        type="text" 
                        value={data.name}
                        onChange={e => setData({ ...data, name: e.target.value })} 
                        placeholder="Enter your name" 
                        className='p-2 rounded-md'
                        required
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <label className='text-sm text-gray-800'>Phone</label>
                    <input 
                        type="tel"  // Changed from number to tel for better mobile support
                        value={data.phone}
                        onChange={e => setData({ ...data, phone: e.target.value })} 
                        placeholder="Enter your phone number"
                        minLength={10}
                        maxLength={15}
                        className='p-2 rounded-md'
                        required
                    />
                </div>
                
                <div className='flex flex-col gap-1'>
                    <label className='text-sm text-gray-800'>Email</label>
                    <input 
                        type="email"  // Changed to email type for better validation
                        value={data.email}
                        onChange={e => setData({ ...data, email: e.target.value })} 
                        placeholder="Enter your email" 
                        className='p-2 rounded-md'
                        required
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <label className='text-sm text-gray-800'>Password</label>
                    <input 
                        type="password" 
                        value={data.password}
                        onChange={e => setData({ ...data, password: e.target.value })} 
                        placeholder="Enter your password" 
                        className='p-2 rounded-md'
                        minLength={6}
                        required
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <label className='text-sm text-gray-800'>Role</label>
                    <select 
                        value={data.role}
                        onChange={e => setData({ ...data, role: e.target.value })} 
                        className='p-2 rounded-md'
                        required
                    >
                        <option value="">Select role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>



                <button 
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors" 
                    type='submit' 
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Register'}
                </button>
            </form>
        </div>
    )
}

export default Register;