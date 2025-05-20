import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../../config/url'
import { toast } from 'react-toastify'
import upload from './../../utils/upload'
import Loading from '../../components/Loading'
import ImageUploader from '../../components/ImageUploader'
import PageLoader from '../../components/PageLoader'

const About = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    primaryImage: '',
    secondaryImage: ''
  })
  const [loading, setLoading] = useState(false)
  const [existingId, setExistingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchAbout = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/about`)
      if (res.data) {
        setFormData({
          title: res.data.title || '',
          description: res.data.description || '',
          primaryImage: res.data.primaryImage || '',
          secondaryImage: res.data.secondaryImage || ''
        })
        setExistingId(res.data._id)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to load about data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAbout()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const url = await upload(file)
      setFormData((prev) => ({
        ...prev,
        [fieldName]: url
      }))
      toast.success(`${fieldName} uploaded`)
    } catch (err) {
      console.log(err)
      toast.error(`Upload failed for ${fieldName}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await axios.post(`${API_URL}/api/about`, {
        ...formData,
        _id: existingId // Optional: Server can use _id to determine update vs create
      })
      toast.success('About section saved successfully!')
      fetchAbout() // Refresh data after submit
    } catch (error) {
      console.log(error)
      toast.error('Error saving About section')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-screen"><PageLoader /></div>

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">About Section</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <ImageUploader
          label="Primary Image"
          fieldName="primaryImage"
          value={formData.primaryImage}
          onChange={handleImageUpload}
        />

        <ImageUploader
          label="Secondary Image"
          fieldName="secondaryImage"
          value={formData.secondaryImage}
          onChange={handleImageUpload}
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
        >
          {submitting ? <Loading /> : (existingId ? 'Update' : 'Submit')}
        </button>
      </form>
    </div>
  )
}

export default About
