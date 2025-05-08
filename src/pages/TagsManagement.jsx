import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../config/url';
import PageLoader from '../components/PageLoader';
import AddTagModal from '../components/tags/AddTagModal';
import { Trash } from 'lucide-react';

const TagsManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTag = async (tagName) => {
        try {
            await axios.post(`${API_URL}/api/tags`, { name: tagName });
            fetchTags(); // refresh tag list
        } catch (error) {
            console.error(error);
        }
    };


    const handleDeleteTag = async (tagId) => {
        try {
            await axios.delete(`${API_URL}/api/tags/${tagId}`);
            fetchTags(); 
        } catch (error) {
            console.error(error);
        }
    }

    const fetchTags = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/tags`);
            setData(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const filteredTags = data.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-6 px-6 flex justify-between items-center shadow">
                <h1 className="text-2xl font-bold">Tags Management</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-blue-600 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 transition">
                    + Add Tag
                </button>
            </div>

            
            <div className="bg-white p-4 shadow-sm mt-4 mx-6 rounded-md">
                <input
                    type="text"
                    placeholder="Search tags..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            
            <div className="mt-6 mx-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredTags.length > 0 ? (
                    filteredTags.map(tag => (
                        <div
                            key={tag._id}
                            className="bg-white p-4 flex items-center justify-between rounded-md shadow hover:shadow-md transition"
                        >
                            <p className="text-lg font-medium">{tag.name}</p>

                            <Trash
                                size={24}
                                className="text-red-500 float-right cursor-pointer"
                                onClick={() => handleDeleteTag(tag._id)}
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center">No tags found.</p>
                )}
            </div>

            <AddTagModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddTag}
            />
        </div>
    );
};

export default TagsManagement;
