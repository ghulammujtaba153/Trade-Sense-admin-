import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config/url";
import { toast } from "react-toastify";
import PageLoader from "../PageLoader";

const FAQModal = ({ type, data, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    question: data?.question || "",
    answer: data?.answer || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (type === "edit") {
        await axios.put(`${API_URL}/api/faq/${data._id}`, formData);
        toast.success("FAQ updated");
      } else if (type === "add") {
        await axios.post(`${API_URL}/api/faq`, formData);
        toast.success("FAQ added");
      }
      onRefresh();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full w-full">
        <PageLoader />
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>

        <h3 className="text-xl font-semibold mb-4 capitalize">{type} FAQ</h3>

        {type === "view" ? (
          <div>
            <p>
              <strong>Question:</strong> {data.question}
            </p>
            <p className="mt-2">
              <strong>Answer:</strong> {data.answer}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block mb-1">Question</label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1">Answer</label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                className="w-full p-2 border rounded h-32"
                required
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                {loading ? "Saving..." : type === "edit" ? "Update" : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FAQModal;
