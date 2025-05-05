import React from 'react';

const GoalViewModal = ({ isOpen, onClose, goal }) => {
  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        <h2 className="text-2xl font-semibold mb-4">Goal Details</h2>
        <div className="space-y-2">
          <p><strong>Title:</strong> {goal.title}</p>
          <p><strong>Description:</strong> {goal.description}</p>
          <p><strong>Frequency:</strong> {goal.frequency}</p>
          <p><strong>Status:</strong> {goal.status || 'N/A'}</p>
          <p><strong>Created At:</strong> {new Date(goal.createdAt).toLocaleString()}</p>
          <p><strong>Target Date:</strong> {new Date(goal.targetDate).toLocaleDateString()}</p>
          <hr className="my-2" />
          <h3 className="text-lg font-semibold">User Info</h3>
          <p><strong>Name:</strong> {goal.userId?.name}</p>
          <p><strong>Email:</strong> {goal.userId?.email}</p>
          <p><strong>Phone:</strong> {goal.userId?.phone}</p>
          <p><strong>Gender:</strong> {goal.userId?.gender}</p>
          <p><strong>Age Range:</strong> {goal.userId?.ageRange}</p>
          <p><strong>Experience Level:</strong> {goal.userId?.experienceLevel}</p>
        </div>
      </div>
    </div>
  );
};

export default GoalViewModal;
