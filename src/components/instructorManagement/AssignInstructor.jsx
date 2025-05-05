import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { API_URL } from '../../config/url';

const AssignInstructor = ({ isOpen, onClose, instructors, onAssign }) => {
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const filtered = res.data.filter((course) => !course.instructor[0]);
      setCourses(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOpen) fetchCourses();
  }, [isOpen]);

  if (!isOpen) return null;

  const instructorOptions = instructors.map((inst) => ({
    value: inst,
    label: inst.email,
  }));

  const courseOptions = courses.map((course) => ({
    value: course,
    label: course.title,
  }));

  const handleAssign = async (selectedInstructor, selectedCourse) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/courses/instructor/${selectedCourse._id}`,
        { instructorId: selectedInstructor._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      onAssign(res.data);
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Assign Instructor</h2>

        <div className="mb-4">
          <p className="mb-1">instructor:</p>
          <Select
            options={instructorOptions}
            onChange={(option) => setSelectedInstructor(option?.value || null)}
            placeholder="Search by email..."
            isClearable
          />
        </div>

        <div className="mb-6">
          <p className="mb-1">course:</p>
          <Select
            options={courseOptions}
            onChange={(option) => setSelectedCourse(option?.value || null)}
            placeholder="Search by title..."
            isClearable
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              selectedInstructor && selectedCourse &&
              handleAssign(selectedInstructor, selectedCourse)
            }
            disabled={!selectedInstructor || !selectedCourse}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignInstructor;
