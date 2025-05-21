import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../../config/url'
import { toast } from 'react-toastify'
import { Eye, Edit2, Trash2, Plus } from 'lucide-react'
import FAQModal from '../../components/faq/FAQModal'

const FAQs = () => {
  const [faq, setFaq] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFaq, setSelectedFaq] = useState(null)
  const [modalType, setModalType] = useState('')
  const [showModal, setShowModal] = useState(false)

  const fetch = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/faq`)
      setFaq(res.data)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return
    try {
      await axios.delete(`${API_URL}/api/faq/${id}`)
      toast.success('FAQ deleted')
      fetch()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const openModal = (type, data = null) => {
    setModalType(type)
    setSelectedFaq(data)
    setShowModal(true)
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">FAQs</h2>
        <button
          onClick={() => openModal('add')}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Question</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {faq.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="p-2">{item.question}</td>
              <td className="p-2 flex gap-2">
                <Eye className="cursor-pointer h-6 w-6 text-blue-600" onClick={() => openModal('view', item)} />
                <Edit2 className="cursor-pointer h-6 w-6 text-green-600" onClick={() => openModal('edit', item)} />
                <Trash2 className="cursor-pointer h-6 w-6 text-red-600" onClick={() => handleDelete(item._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <FAQModal
          type={modalType}
          data={selectedFaq}
          onClose={() => setShowModal(false)}
          onRefresh={fetch}
        />
      )}
    </div>
  )
}

export default FAQs
