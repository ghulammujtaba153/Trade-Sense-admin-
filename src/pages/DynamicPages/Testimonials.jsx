// src/pages/Testimonials.jsx
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../../config/url'
import { toast } from 'react-toastify'
import { FiUploadCloud, FiPlus, FiTrash2, FiEdit } from 'react-icons/fi'
import upload from './../../utils/upload'

const Testimonials = () => {
  const [data, setData] = useState({
    title: '',
    description: '',
    image: '',
  })

  const [testimonials, setTestimonials] = useState([])
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    designation: '',
    image: '',
    rating: 5,
    description: ''
  })

  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingId, setExistingId] = useState(null)
  const [editIndex, setEditIndex] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
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
    } catch (err) {
      toast.error('Failed to fetch data')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleTestimonialChange = (e) => {
    const { name, value } = e.target
    setTestimonialForm(prev => ({ ...prev, [name]: value }))
  }

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const imageUrl = await upload(file)
      setData(prev => ({ ...prev, image: imageUrl }))
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleTestimonialImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const imageUrl = await upload(file)
      setTestimonialForm(prev => ({ ...prev, image: imageUrl }))
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const addOrUpdateTestimonial = () => {
    const { name, designation, image, rating, description } = testimonialForm
    if (!name || !designation || !image || !rating || !description) {
      return toast.error('Fill out all testimonial fields')
    }

    if (editIndex !== null) {
      const updated = [...testimonials]
      updated[editIndex] = { ...testimonialForm }
      setTestimonials(updated)
      setEditIndex(null)
    } else {
      setTestimonials(prev => [...prev, { ...testimonialForm, createdAt: new Date() }])
    }

    setTestimonialForm({ name: '', designation: '', image: '', rating: 5, description: '' })
    setShowTestimonialForm(false)
  }

  const editTestimonial = (index) => {
    const selected = testimonials[index]
    setTestimonialForm({ ...selected })
    setEditIndex(index)
    setShowTestimonialForm(true)
  }

  const removeTestimonial = (index) => {
    setTestimonials(prev => prev.filter((_, i) => i !== index))
    if (editIndex === index) {
      setEditIndex(null)
      setTestimonialForm({ name: '', designation: '', image: '', rating: 5, description: '' })
      setShowTestimonialForm(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = {
        ...data,
        testimonials
      }

      const url = `${API_URL}/api/testimonials`
      await axios.post(url, { ...payload, _id: existingId })
      toast.success('Saved successfully')
      fetchData()
    } catch (error) {
      toast.error('Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Testimonials Section</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={3}
            required
          />
        </div>

        {/* Main Image */}
        <div>
          <label className="block font-medium mb-1">Main Image</label>
          <div className="relative border border-dashed border-gray-400 rounded-md p-4 flex items-center justify-center hover:border-blue-500 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleMainImageUpload}
              disabled={uploadingImage}
            />
            <div className="text-center text-gray-600">
              <FiUploadCloud size={32} className="mx-auto" />
              <p>{uploadingImage ? 'Uploading...' : 'Click to upload'}</p>
            </div>
          </div>
          {data.image && <img src={data.image} alt="main" className="h-24 mt-2 rounded" />}
        </div>

        {/* Add/Edit Testimonial Button */}
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-blue-600 font-medium"
          onClick={() => {
            setTestimonialForm({ name: '', designation: '', image: '', rating: 5, description: '' })
            setEditIndex(null)
            setShowTestimonialForm(prev => !prev)
          }}
        >
          <FiPlus />
          {showTestimonialForm ? 'Cancel' : 'Add Testimonial'}
        </button>

        {/* Testimonial Form */}
        {showTestimonialForm && (
          <div className="bg-gray-100 p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-sm">Name</label>
              <input
                type="text"
                name="name"
                value={testimonialForm.name}
                onChange={handleTestimonialChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Designation</label>
              <input
                type="text"
                name="designation"
                value={testimonialForm.designation}
                onChange={handleTestimonialChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Rating</label>
              <input
                type="number"
                name="rating"
                value={testimonialForm.rating}
                min={1}
                max={5}
                onChange={handleTestimonialChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Description</label>
              <textarea
                name="description"
                value={testimonialForm.description}
                onChange={handleTestimonialChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm">Image</label>
              <div className="relative border border-dashed border-gray-400 rounded-md p-4 flex items-center justify-center hover:border-blue-500 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleTestimonialImageUpload}
                  disabled={uploadingImage}
                />
                <div className="text-center text-gray-600">
                  <FiUploadCloud size={32} className="mx-auto" />
                  <p>{uploadingImage ? 'Uploading...' : 'Upload image'}</p>
                </div>
              </div>
              {testimonialForm.image && <img src={testimonialForm.image} alt="person" className="h-20 mt-2 rounded" />}
            </div>
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={addOrUpdateTestimonial}
            >
              {editIndex !== null ? 'Update Testimonial' : 'Add to List'}
            </button>
          </div>
        )}

        {/* Testimonials List */}
        {testimonials.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-md font-semibold">Added Testimonials:</h3>
            {testimonials.map((t, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-gray-600">{t.designation}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => editTestimonial(i)}
                    className="text-blue-600 hover:underline"
                  >
                    <FiEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(i)}
                    className="text-red-600 hover:underline"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4"
        >
          {isSubmitting ? 'Submitting...' : existingId ? 'Update Section' : 'Create Section'}
        </button>
      </form>
    </div>
  )
}

export default Testimonials
