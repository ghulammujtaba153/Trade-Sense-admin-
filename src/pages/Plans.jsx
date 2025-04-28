import React, { useEffect, useState } from 'react';
import PlanModal from "../components/PlanModal";
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../config/url';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Loading from '../components/Loading';
import PageLoader from '../components/PageLoader';

// Correct categories based on your schema
const categories = [
    { value: 'membership', label: 'Membership' },
    { value: 'plans', label: 'Plans' },
    { value: 'coupon', label: 'Coupon' }
];

// Correct subCategories
const subCategories = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
];

const Plans = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [data, setData] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [subCategoryFilter, setSubCategoryFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPlans = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/plans`);
            setData(res.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
            toast.error('Failed to load plans');
        } finally {
            setLoading(false);
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

    const filteredData = data.filter(plan => {
        let matchesCategory = categoryFilter ? plan.category === categoryFilter : true;
        let matchesSubCategory = subCategoryFilter ? plan.subCategory === subCategoryFilter : true;
        return matchesCategory && matchesSubCategory;
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    if (loading) return (
        <div className='flex justify-center items-center h-screen'>
            <PageLoader />
        </div>
    );

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <button 
                    onClick={() => {
                        setSelectedPlan(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-primary text-white px-4 py-2 rounded"
                >
                    Add New Plan
                </button>

                <div className="flex gap-3">
                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setSubCategoryFilter(''); // Reset subCategory when category changes
                        }}
                        className="border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>

                    {/* Show subCategory filter only for membership or plans */}
                    {(categoryFilter === 'membership' || categoryFilter === 'plans') && (
                        <select
                            value={subCategoryFilter}
                            onChange={(e) => setSubCategoryFilter(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">All SubCategories</option>
                            {subCategories.map(sub => (
                                <option key={sub.value} value={sub.value}>
                                    {sub.label}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
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
                            <th className="px-4 py-2">SubCategory</th>
                            <th className="px-4 py-2">Coupon Code</th>
                            <th className="px-4 py-2">Discount %</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(plan => (
                            <tr key={plan._id} className="border-t">
                                <td className="px-4 py-2">{plan.name}</td>
                                <td className="px-4 py-2">{plan.price}</td>
                                <td className="px-4 py-2 capitalize">{plan.category}</td>
                                <td className="px-4 py-2 capitalize">{plan.subCategory || '-'}</td>
                                <td className="px-4 py-2">{plan.couponCode || '-'}</td>
                                <td className="px-4 py-2">{plan.discountPercentage != null ? `${plan.discountPercentage}%` : '-'}</td>
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
                                <td colSpan="8" className="text-center py-4 text-gray-500">
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
