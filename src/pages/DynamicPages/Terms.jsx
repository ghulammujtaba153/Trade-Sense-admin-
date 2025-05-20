import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../config/url';
import { toast } from 'react-toastify';

const Terms = () => {
  const [data, setData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  const fetchTerms = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/terms`);
      setData(res.data ?? { title: '', content: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load terms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/terms`, data);
      toast.success(res.data.message || 'Terms updated successfully');
      fetchTerms();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Submission failed');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Terms & Conditions</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={data?.title || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            name="content"
            value={data?.content || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded h-60 resize-y"
            placeholder="Enter content"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 text-white rounded ${
            loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default Terms;
