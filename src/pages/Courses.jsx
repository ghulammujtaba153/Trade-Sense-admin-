import React, { useEffect, useState } from 'react';
import { API_URL } from '../config/url';
import axios from 'axios';
import { toast } from 'react-toastify';
import CourseModal from '../components/CourseModal';
import { FiEdit, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import EnrollmentGraph from '../components/EnrollmentGraph';
import Loading from '../components/Loading';
import PageLoader from '../components/PageLoader';
import CourseModuleModal from '../components/CourseModuleModal';
import AddCourseModule from '../components/AddCourseModule';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [viewModuleModal, setViewModuleModal] = useState(false);
    const [viewAddModuleModal, setViewAddModuleModal] = useState(false);
    


    const handleSuccess = () => {
        toast.success('Operation completed successfully');
        fetchData();
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/courses`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            console.log("fetch data from db",res.data);
            setCourses(res.data);
            setFilteredCourses(res.data);
        } catch (error) {
            console.log(error);
            setError(error);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };



    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            await axios.delete(`${API_URL}/api/courses/${id}`);
            toast.success('Course deleted');
            fetchData();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await axios.patch(`${API_URL}/api/courses/${id}/status`, { status });
            toast.success(`Status updated to ${status}`);
            fetchData();
        } catch (err) {
            toast.error('Status update failed');
            console.log(err);
        } finally {
            setActiveDropdown(null);
        }
    };

    const toggleDropdown = (courseId) => {
        setActiveDropdown(activeDropdown === courseId ? null : courseId);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let result = courses;


        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(course =>
                course.title.toLowerCase().includes(term) ||
                (course.creator?.name && course.creator.name.toLowerCase().includes(term))
            )
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(course => course.status === statusFilter);
        }

        setFilteredCourses(result);
    }, [searchTerm, statusFilter, courses]);

    if (loading) return <div className='flex justify-center items-center h-screen'>
        <PageLoader />
    </div>
    if (error) return <p className='text-center text-red-500'>Error loading courses</p>;

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <input
                        type="text"
                        placeholder="Search by title or creator"
                        className="p-2 border rounded-md flex-grow"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="p-2 border rounded-md"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <button
                    onClick={() => {
                        setSelectedCourse(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-primary hover:scale-105 transition-transform w-[200px] text-white px-4 py-2 rounded"
                >
                    Add Course
                </button>
            </div>

            <CourseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                courseData={selectedCourse}
                onSuccess={handleSuccess}
            />

            {viewModuleModal && selectedCourse && (
                <CourseModuleModal
                    isOpen={viewModuleModal}
                    onClose={() => setViewModuleModal(false)}
                    data={selectedCourse}
                    onSuccess={handleSuccess}
                />
            )}


            {viewAddModuleModal && selectedCourse && (
                <AddCourseModule
                    isOpen={viewAddModuleModal}
                    onClose={() => setViewAddModuleModal(false)}
                    data={selectedCourse}
                    onSuccess={handleSuccess}
                />
            )}



            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            {/* <th className="px-4 py-3 text-left">Creator</th> */}
                            <th className="px-4 py-3 text-left">Title</th>
                            <th className="px-4 py-3 text-left">Instructor</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <tr key={course._id} className="border-t hover:bg-gray-50">
                                    {/* <td className="px-4 py-3">
                                        <div className="font-medium">{course.creator?.name}</div>
                                        <div className="text-sm text-gray-500">{course.creator?.email}</div>
                                    </td> */}
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{course.title}</div>
                                        {/* <div className="text-sm text-gray-500 line-clamp-2">{course.description}</div> */}
                                    </td>
                                    <td className="px-4 py-3">{course.instructor ? course.instructor.email : 'N/A'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() =>{
                                                setSelectedCourse(course);
                                                setViewAddModuleModal(true);
                                            }}>
                                                <FiPlus />
                                            </button>

                                            <button onClick={() => {
                                                setSelectedCourse(course);
                                                setViewModuleModal(true);
                                            }}>
                                                <FiEye />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedCourse(course);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-primary hover:scale-105 transition-tranform"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FiTrash2 />
                                            </button>
                                            <div className="relative">
                                                <button
                                                    onClick={() => toggleDropdown(course._id)}
                                                    className="text-gray-600 hover:text-gray-800"
                                                >
                                                    ⋮
                                                </button>

                                                {activeDropdown === course._id && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => handleStatusChange(course._id, 'published')}
                                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                            >
                                                                Set to Published
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(course._id, 'archived')}
                                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                            >
                                                                Set to Archived
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                                    No courses found matching your criteria
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className='bg-white shadow-2xl rounded-lg p-6 mt-6'>
                <EnrollmentGraph />
            </div>
        </div>
    );
};

export default Courses;