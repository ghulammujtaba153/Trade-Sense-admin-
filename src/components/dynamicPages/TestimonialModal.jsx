// src/pages/Testimonials.jsx
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../../config/url'
import { toast } from 'react-toastify'
import PageLoader from '../../components/PageLoader'
import ImageUploader from '../../components/ImageUploader'
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'

const Testimonials = () => {
  const [data, setData] = useState({
    title: '',
    description: '',
    image: '',
  })
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingId, setExistingId] = useState(null)
  
  // Form for adding/editing individual testimonials
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    designation: '',
    image: '',
    rating: 5,
    description: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/testimonials`)
      if (res.data) {
        setData({
          title: res.data.title || '',
          description: res.data.description || '',
          image: res.data.image || '',
        })
        setTestimonials(res.data.testimonials || [])
        setExistingId(res.data._id)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTestimonialChange = (e) => {
    const { name, value } = e.target
    setTestimonialForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (url) => {
    setData((prev) => ({ ...prev, image: url }))
  }

  const handleTestimonialImageUpload = (url) => {
    setTestimonialForm((prev) => ({ ...prev, image: url }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await axios.post(`${API_URL}/api/testimonials`, {
        ...data,
        _id: existingId,
        testimonials
      })
      toast.success('Testimonial section saved!')
      fetchTestimonials()
    } catch (error) {
      toast.error(error.message || 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTestimonial = () => {
    setTestimonialForm({
      name: '',
      designation: '',
      image: '',
      rating: 5,
      description: ''
    })
    setEditingId(null)
    setShowTestimonialForm(true)
  }

  const handleEditTestimonial = (testimonial) => {
    setTestimonialForm({
      name: testimonial.name,
      designation: testimonial.designation,
      image: testimonial.image,
      rating: testimonial.rating,
      description: testimonial.description
    })
    setEditingId(testimonial._id)
    setShowTestimonialForm(true)
  }

  const handleSaveTestimonial = async (e) => {
    e.preventDefault()
    
    try {
      let updatedTestimonials = [...testimonials]
      
      if (editingId) {
        // Update existing testimonial
        const index = updatedTestimonials.findIndex(t => t._id === editingId)
        if (index !== -1) {
          updatedTestimonials[index] = {
            ...updatedTestimonials[index],
            ...testimonialForm
          }
        }
      } else {
        // Add new testimonial
        updatedTestimonials.push({
          ...testimonialForm,
          createdAt: new Date()
        })
      }
      
      setTestimonials(updatedTestimonials)
      setShowTestimonialForm(false)
      toast.success(`Testimonial ${editingId ? 'updated' : 'added'} successfully!`)
    } catch (error) {
      toast.error(error.message || 'Operation failed')
    }
  }

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const updatedTestimonials = testimonials.filter(t => t._id !== id)
        setTestimonials(updatedTestimonials)
        toast.success('Testimonial deleted successfully!')
      } catch (error) {
        toast.error(error.message || 'Deletion failed')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PageLoader />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Testimonials Section</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            name="title"
            value={data.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            rows={4}
            value={data.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Image</label>
          <ImageUploader
            imageUrl={data.image}
            onUpload={handleImageUpload}
            label="Upload Main Image"
          />
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Individual Testimonials</h3>
            <button
              type="button"
              onClick={handleAddTestimonial}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
            >
              <FiPlus /> Add Testimonial
            </button>
          </div>

          {showTestimonialForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium mb-3">
                {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h4>
              <form onSubmit={handleSaveTestimonial} className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm">Name</label>
                    <input
                      name="name"
                      value={testimonialForm.name}
                      onChange={handleTestimonialChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">Designation</label>
                    <input
                      name="designation"
                      value={testimonialForm.designation}
                      onChange={handleTestimonialChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm">Rating (1-5)</label>
                  <select
                    name="rating"
                    value={testimonialForm.rating}
                    onChange={handleTestimonialChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    required
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm">Image</label>
                  <ImageUploader
                    imageUrl={testimonialForm.image}
                    onUpload={handleTestimonialImageUpload}
                    label="Upload Person Image"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={testimonialForm.description}
                    onChange={handleTestimonialChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTestimonialForm(false)}
                    className="px-3 py-1.5 text-sm border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {editingId ? 'Update' : 'Save'} Testimonial
                  </button>
                </div>
              </form>
            </div>
          )}

          {testimonials.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Designation</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Rating</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((testimonial) => (
                    <tr key={testimonial._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm border-b">{testimonial.name}</td>
                      <td className="px-4 py-2 text-sm border-b">{testimonial.designation}</td>
                      <td className="px-4 py-2 text-sm border-b">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm border-b">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditTestimonial(testimonial)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTestimonial(testimonial._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No testimonials added yet
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : existingId ? 'Update All' : 'Save All'}
        </button>
      </form>
    </div>
  )
}

export default Testimonials