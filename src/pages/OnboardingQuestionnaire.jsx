import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from './../config/url';
import { toast } from 'react-toastify';
import PageLoader from '../components/PageLoader';

const OnboardingQuestionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [questionInput, setQuestionInput] = useState('');
  const [optionsInput, setOptionsInput] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/onboarding/questionnaire`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setQuestions(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddQuestion = async () => {
    if (!questionInput.trim() || optionsInput.some(opt => !opt.trim())) {
      toast.error('Question and all options are required');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/onboarding/questionnaire`,
        { question: questionInput, options: optionsInput },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setQuestions(prev => [...prev, res.data]);
      resetForm();
      toast.success('Question added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditQuestion = async (q) => {
    if (!questionInput.trim() || optionsInput.some(opt => !opt.trim())) {
      toast.error('Question and all options are required');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/onboarding/questionnaire/${q._id}`,
        { question: questionInput, options: optionsInput },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setQuestions(prev =>
        prev.map(question =>
          question._id === q._id ? res.data : question
        )
      );
      resetForm();
      toast.success('Question updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/api/onboarding/questionnaire/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setQuestions(prev => prev.filter(q => q._id !== id));
      toast.success('Question deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete question');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setQuestionInput('');
    setOptionsInput(['']);
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleAddOrUpdate = () => {
    if (editingId !== null) {
      const questionToEdit = questions.find(q => q._id === editingId);
      if (questionToEdit) {
        handleEditQuestion(questionToEdit);
      }
    } else {
      handleAddQuestion();
    }
  };

  const startEditing = (question) => {
    setEditingId(question._id);
    setQuestionInput(question.question);
    setOptionsInput(question.options);
    setShowAddForm(false);
  };

  const showAddQuestionForm = () => {
    setShowAddForm(true);
    setEditingId(null);
    setQuestionInput('');
    setOptionsInput(['']);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...optionsInput];
    updatedOptions[index] = value;
    setOptionsInput(updatedOptions);
  };

  const addOptionField = () => {
    setOptionsInput([...optionsInput, '']);
  };

  const removeOptionField = (index) => {
    const updatedOptions = optionsInput.filter((_, i) => i !== index);
    setOptionsInput(updatedOptions);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Onboarding Questionnaire</h2>
        <button
          onClick={showAddQuestionForm}
          className="bg-primary text-white px-4 py-2 rounded hover:scale-105 transition-transform disabled:opacity-50"
          disabled={isLoading || showAddForm}
        >
          + Add Question
        </button>
      </div>

      {(showAddForm || editingId !== null) && (
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <input
            type="text"
            placeholder="Enter your question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            disabled={isLoading}
          />

          <div>
            <label className="block font-medium mb-2">Options:</label>
            {optionsInput.map((opt, index) => (
              <div key={index} className="flex mb-2 gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  disabled={isLoading}
                />
                {optionsInput.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOptionField(index)}
                    className="text-red-500 font-bold"
                    disabled={isLoading}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOptionField}
              className="text-blue-600 hover:underline text-sm"
              disabled={isLoading}
            >
              + Add Option
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddOrUpdate}
              className="bg-primary text-white px-4 py-2 rounded hover:scale-105 transition-transform disabled:opacity-50"
              disabled={isLoading}
            >
              {editingId !== null ? 'Update Question' : 'Add Question'}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading && !questions.length ? (
        <div className="text-center py-8"><PageLoader/></div>
      ) : (
        <ul className="space-y-4">
          {questions.map((q) => (
            <li key={q._id} className="border p-4 rounded shadow-sm">
              <p className="font-semibold">Q: {q.question}</p>
              <ul className="list-disc pl-6 text-sm text-gray-700 mt-2">
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => startEditing(q)}
                  className="text-blue-600 hover:underline disabled:opacity-50"
                  disabled={isLoading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuestion(q._id)}
                  className="text-red-600 hover:underline disabled:opacity-50"
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OnboardingQuestionnaire;
