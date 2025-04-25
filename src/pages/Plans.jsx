import React, { useEffect, useState } from 'react';
import PlanModal from "../components/PlanModal";
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../config/url';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const categories = [
    { value: 'monthly', label: 'Monthly Package' },
    { value: 'yearly', label: 'Yearly Package' },
    { value: 'lifetime', label: 'Lifetime Package' }
];

const Plans = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [data, setData] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState(''); // default is show all

    const fetchPlans = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/plans`);
            setData(res.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
            toast.error('Failed to load plans');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this plan?")) return;
        try {
            await axios.delete(`${API_URL}/api/plans/${id}`);
            handleSuccess();
        } catch (error) {
            console.error('Error deleting plan:', error);
            toast.error('Failed to delete plan');
        }
    };

    const handleSuccess = () => {
        toast.success('Operation completed successfully');
        fetchPlans();
    };

    const filteredData = categoryFilter
        ? data.filter(plan => plan.category === categoryFilter)
        : data;

    useEffect(() => {
        fetchPlans();
    }, []);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <button 
                    onClick={() => {
                        setSelectedPlan(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-[#5A67BA] text-white px-4 py-2 rounded"
                >
                    Add New Plan
                </button>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            <PlanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                planData={selectedPlan}
                onSuccess={handleSuccess}
            />

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(plan => (
                            <tr key={plan._id} className="border-t">
                                <td className="px-4 py-2">{plan.name}</td>
                                <td className="px-4 py-2">{plan.price}</td>
                                <td className="px-4 py-2">{plan.category}</td>
                                <td className="px-4 py-2">{plan.description}</td>
                                <td className="px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedPlan(plan);
                                            setIsModalOpen(true);
                                        }}
                                        className="text-[#5A67BA] hover:underline"
                                    >
                                        <FiEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan._id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    No plans found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Plans;
