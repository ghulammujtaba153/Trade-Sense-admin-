import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/url';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock, FaPhone, FaUser, FaEnvelope } from 'react-icons/fa';
import Loading from '../components/Loading';

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
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, data);
      console.log(res.data);
      setData({
        name: '',
        phone: '',
        email: '',
        password: '',
        role: ''
      });
      setSuccess(true);
      toast.success('User added successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 rounded-2xl bg-white shadow-lg w-full max-w-[700px]"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Register</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">Registration successful!</p>}

        {/* Name */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-sm text-gray-800">Name</label>
          <div className="relative">
            <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Enter your name"
              className="p-2 pl-10 bg-gray-100 rounded-md w-full"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-sm text-gray-800">Phone</label>
          <div className="relative">
            <FaPhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              placeholder="Enter your phone number"
              minLength={10}
              maxLength={15}
              className="p-2 pl-10 bg-gray-100 rounded-md w-full"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-sm text-gray-800">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="Enter your email"
              className="p-2 pl-10 bg-gray-100 rounded-md w-full"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-sm text-gray-800">Password</label>
          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder="Enter your password"
              minLength={6}
              className="p-2 pl-10 bg-gray-100 rounded-md w-full"
              required
            />
          </div>
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-800">Role</label>
          <select
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
            className="p-2 text-sm bg-gray-100 rounded-md w-full"
            required
          >
            <option value="">Select role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </div>

        {/* Register Button */}
        <button
          className="bg-primary text-white text-sm p-2 rounded-md hover:scale-105 transition-transform hover:scale-105 transition-transform w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? <Loading/> : 'Register'}
        </button>

        
      </form>
    </div>
  );
};

export default Register;
