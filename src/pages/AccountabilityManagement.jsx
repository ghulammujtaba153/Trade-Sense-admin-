import React, { useEffect, useState } from "react";
import { API_URL } from "../config/url";
import axios from "axios";
import { FiEdit, FiEye, FiTrash2, FiRefreshCw } from "react-icons/fi";
import GoalViewModal from "../components/accountManagement/GoalViewModal";
import GoalEditModal from "../components/accountManagement/GoalEditModal";
import PageLoader from "../components/PageLoader";
import { toast } from "react-toastify";

const AccountabilityManagement = () => {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter states
  const [searchTitle, setSearchTitle] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/goals`);
      if (response.data && Array.isArray(response.data)) {
        setGoals(response.data);
        setFilteredGoals(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setGoals([]);
        setFilteredGoals([]);
      }
    } catch (error) {
      console.error("Failed to fetch goals:", error);
      toast.error("Failed to load goals");
      setGoals([]);
      setFilteredGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    const filtered = goals.filter((goal) => {
      const titleMatch = goal.title
        ?.toLowerCase()
        .includes(searchTitle.toLowerCase());
      const statusMatch = goal.status
        ?.toLowerCase()
        .includes(searchStatus.toLowerCase());

      return titleMatch && statusMatch;
    });
    setFilteredGoals(filtered);
  }, [searchTitle, searchStatus, goals]);

  const handleView = (goal) => {
    setSelectedGoal(goal);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setSelectedGoal(null);
    setIsViewModalOpen(false);
  };

  const handleEdit = (goal) => {
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedGoal(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (goalId) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await axios.delete(`${API_URL}/api/goals/${goalId}`);
        toast.success("Goal deleted successfully");
        fetchGoals();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete goal");
      }
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Goals Management</h2>
        <button
          onClick={fetchGoals}
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          <FiRefreshCw className="text-sm" />
          Refresh
        </button>
      </div>

      {/* Filter Inputs */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
        />
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="dropped">Dropped</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-2 px-4">Goal Title</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Frequency</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Created At</th>
              <th className="py-2 px-4">Target Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGoals.length > 0 ? (
              filteredGoals.map((goal) => (
                <tr key={goal._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{goal.title || "Untitled Goal"}</td>
                  <td className="py-2 px-4">
                    {goal.description || "No description"}
                  </td>
                  <td className="py-2 px-4 capitalize">
                    {goal.frequency || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        goal.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : goal.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {goal.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {new Date(goal.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleView(goal)}
                      className="text-blue-500 hover:text-blue-700"
                      title="View"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => handleEdit(goal)}
                      className="text-green-500 hover:text-green-700"
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No goals found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <GoalViewModal
          isOpen={isViewModalOpen}
          onClose={closeModal}
          goal={selectedGoal}
        />

        <GoalEditModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          goal={selectedGoal}
          onSave={fetchGoals}
        />
      </div>
    </div>
  );
};

export default AccountabilityManagement;