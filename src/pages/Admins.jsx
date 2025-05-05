import React, { useEffect, useState } from 'react';
import { API_URL } from '../config/url';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import UserModal from '../components/UserModal';
import { IoMdPersonAdd } from "react-icons/io";
import PageLoader from '../components/PageLoader';


const Admins = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [expFilter, setExpFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/auth/admins`);
            setUsers(res.data.users);
            setFilteredUsers(res.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.patch(`${API_URL}/api/auth/users/${id}`);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeleteConfirm(null);
        }
    };

    const updateStatus = async (userId, newStatus) => {
        try {
            await axios.patch(`${API_URL}/api/auth/users/${userId}/status`, { status: newStatus });
            toast.success(`User status updated to ${newStatus}`);
            fetchUsers();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setActiveDropdown(null);
        }
    };

    const confirmDelete = (userId, userName) => {
        setDeleteConfirm({ userId, userName });
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };


    const toggleDropdown = (userId) => {
        setActiveDropdown(activeDropdown === userId ? null : userId);
    };

    const openAddModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleModalSuccess = () => {
        fetchUsers();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;

        if (searchTerm) {
            result = result.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (roleFilter !== 'all') {
            result = result.filter(user => user.role === roleFilter);
        }

        if (expFilter !== 'all') {
            result = result.filter(user => user.experienceLevel === expFilter);
        }

        if (statusFilter !== 'all') {
            result = result.filter(user => user.status === statusFilter);
        }

        setFilteredUsers(result);
    }, [searchTerm, roleFilter, expFilter, statusFilter, users]);


    if (loading) return <div className='flex justify-center items-center h-screen'>
        <PageLoader />
    </div>

    return (
        <div className="container mx-auto px-4 py-8">
            

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
                        <p className="mb-4">
                            Are you sure you want to delete user: <strong>{deleteConfirm.userName}</strong>?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm.userId)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Modal */}
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userData={selectedUser}
                onSuccess={handleModalSuccess}
            />


            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        className="border border-gray-300 p-2 rounded-md flex-grow"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Link
                        to="/register"
                        className="bg-primary flex items-center gap-2 text-white px-4 py-2 rounded-md hover:scale-105 transition-transform transition-colors w-full md:w-auto text-center"
                    >
                        <IoMdPersonAdd />
                        Add New User
                    </Link>
                    {/* <button onClick={openAddModal} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors w-full md:w-auto text-center" >
                        Add New User
                    </button> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* <select
                        className="border border-gray-300 p-2 rounded-md"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select> */}

                    <select
                        className="border border-gray-300 p-2 rounded-md"
                        value={expFilter}
                        onChange={(e) => setExpFilter(e.target.value)}
                    >
                        <option value="all">All Experience Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>

                    <select
                        className="border border-gray-300 p-2 rounded-md"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th> */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.role}
                                        </span>
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                        {user.experienceLevel}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="relative inline-block text-left">
                                            <div className='flex'>
                                                <button
                                                    onClick={() => toggleDropdown(user._id)}
                                                    className="inline-flex justify-center w-full rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                                                >
                                                    ⋮
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="block px-4 py-2 text-sm rounded-full text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    <MdEdit className='w-[20px] h-[20px]' />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(user._id, user.name)}
                                                    className="block px-4 py-2 text-sm rounded-full text-red-600 hover:bg-gray-100 w-full text-left"
                                                >
                                                    <MdOutlineDelete className='w-[20px] h-[20px]' />
                                                </button>
                                            </div>


                                            {activeDropdown === user._id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() => updateStatus(user._id, 'active')}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                        >
                                                            Set as Active
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(user._id, 'suspended')}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                        >
                                                            Suspend User
                                                        </button>

                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No users found matching your criteria
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admins;