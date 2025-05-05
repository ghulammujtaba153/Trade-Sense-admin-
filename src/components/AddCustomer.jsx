import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config/url";
import { toast } from "react-toastify";
import { FaLock, FaPhone, FaUser, FaEnvelope, FaTimes } from "react-icons/fa";
import Loading from "./Loading";

const goalOption = [
  "be productive",
  "be healthy",
  "be creative",
  "make more money",
];

const areasOption = [
  "health",
  "nutrition",
  "fitness",
  "mindfulness",
  "self-improvement",
];
const AddCustomerModal = ({ isOpen, onClose, user, onCustomerAdded }) => {
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "user",
    ageRange: "18-24",
    gender: "male",
    goals: [],
    choosenArea: [],
    questionnaireAnswers: {}
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionnaire, setQuestionnaire] = useState([]);
  const [activeTab, setActiveTab] = useState("basic"); // 'basic', 'goals', 'areas'
  

  React.useEffect(() => {
    if (isOpen) {
      fetchQuestionnaire();
      setActiveTab("basic");
  
      if (user) {
        setData({
          name: user.name || "",
          phone: user.phone || "",
          email: user.email || "",
          password: "", // Optional: you may want to disable or hide this field in edit mode
          role: user.role || "user",
          ageRange: user.ageRange || "18-24",
          gender: user.gender || "male",
          goals: user.goals || [],
          choosenArea: user.choosenArea || [],
          questionnaireAnswers: user.questionnaireAnswers || {},
        });
      } else {
        // Clear form for new entry
        setData({
          name: "",
          phone: "",
          email: "",
          password: "",
          role: "user",
          ageRange: "18-24",
          gender: "male",
          goals: [],
          choosenArea: [],
          questionnaireAnswers: {}
        });
      }
    }
  }, [isOpen, user]);
  

  const fetchQuestionnaire = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/onboarding/questionnaire`);
      setQuestionnaire(res.data);
    } catch (error) {
      console.error("Failed to fetch questionnaire:", error);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchQuestionnaire();
      setActiveTab("basic"); // Reset tab when modal opens
    }
  }, [isOpen]);

  const handleCheckboxChange = (field, value) => {
    setData((prev) => {
      const currentValues = [...prev[field]];
      const index = currentValues.indexOf(value);

      if (index === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(index, 1);
      }

      return {
        ...prev,
        [field]: currentValues,
      };
    });
  };

  const handleQuestionnaire = (questionId, option) => {
    setData(prev => {
      // Get current answers for this question or initialize empty array
      const currentAnswers = prev.questionnaireAnswers[questionId] || [];
      const index = currentAnswers.indexOf(option);
  
      // Toggle the option selection
      const updatedAnswers = [...currentAnswers];
      if (index === -1) {
        updatedAnswers.push(option);
      } else {
        updatedAnswers.splice(index, 1);
      }
  
      return {
        ...prev,
        questionnaireAnswers: {
          ...prev.questionnaireAnswers,
          [questionId]: updatedAnswers
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      let res;
      if (user) {
        // Edit existing user
        res = await axios.put(`${API_URL}/api/auth/users/update/${user._id}`, data);
        toast.success("Customer updated successfully!");
      } else {
        // Create new user
        res = await axios.post(`${API_URL}/api/auth/register`, data);
        toast.success("Customer added successfully!");
      }
  
      onCustomerAdded(res.data);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "Operation failed");
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold text-gray-800">
  {user ? "Edit Customer" : "Add New Customer"}
</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("basic")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "basic"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab("goals")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "goals"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Goals
            </button>
            <button
              onClick={() => setActiveTab("areas")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "areas"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Areas
            </button>
            <button
              onClick={() => setActiveTab("questionnaire")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "questionnaire"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Questionnaire
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-800">Name</label>
                <div className="relative">
                  <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    placeholder="Enter name"
                    className="p-2 pl-10 bg-gray-100 rounded-md w-full"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-800">Phone</label>
                <div className="relative">
                  <FaPhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) =>
                      setData({ ...data, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                    minLength={10}
                    maxLength={15}
                    className="p-2 pl-10 bg-gray-100 rounded-md w-full"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-800">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    placeholder="Enter email"
                    className="p-2 pl-10 bg-gray-100 rounded-md w-full"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-800">Password</label>
                <div className="relative">
                  <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    placeholder="Enter password"
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
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>

              {/* Age Range */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-800">Age Range</label>
                <select
                  value={data.ageRange}
                  onChange={(e) =>
                    setData({ ...data, ageRange: e.target.value })
                  }
                  className="p-2 text-sm bg-gray-100 rounded-md w-full"
                  required
                >
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55+">55+</option>
                </select>
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-800">Gender</label>
                <select
                  value={data.gender}
                  onChange={(e) => setData({ ...data, gender: e.target.value })}
                  className="p-2 text-sm bg-gray-100 rounded-md w-full"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          )}

          {/* Areas Tab */}
          {activeTab === "areas" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Select Areas of Interest
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {areasOption.map((option) => (
                  <div
                    key={option}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      id={`area-${option}`}
                      checked={data.choosenArea.includes(option)}
                      onChange={() =>
                        handleCheckboxChange("choosenArea", option)
                      }
                      className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`area-${option}`}
                      className="ml-3 text-sm text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === "goals" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Select Goals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {goalOption.map((option) => (
                  <div
                    key={option}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      id={`area-${option}`}
                      checked={data.goals.includes(option)}
                      onChange={() =>
                        handleCheckboxChange("goals", option)
                      }
                      className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`area-${option}`}
                      className="ml-3 text-sm text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questionnaire Tab */}
          {activeTab === "questionnaire" && (
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-gray-800">Questionnaire</h3>
    <div className="space-y-6">
      {questionnaire.map((question) => (
        <div key={question._id} className="space-y-3">
          <h4 className="text-md font-medium text-gray-800">
            {question.question}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option) => (
              <div
                key={option}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  id={`${question._id}-${option}`}
                  checked={
                    data.questionnaireAnswers[question._id]?.includes(option) || false
                  }
                  onChange={() => handleQuestionnaire(question._id, option)}
                  className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor={`${question._id}-${option}`}
                  className="ml-3 text-sm text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

          <div className="flex justify-between pt-6">
            <div>
              {activeTab !== "basic" && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === "goals" ? "basic" : "goals")
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {activeTab === "basic" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("goals")}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Next
                </button>
              )}

              {activeTab === "goals" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("areas")}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Next
                </button>
              )}

              {activeTab === "areas" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("questionnaire")}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Next
                </button>
              )}

              {activeTab === "questionnaire" && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Saving..." : user ? "Update Customer" : "Add Customer"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
