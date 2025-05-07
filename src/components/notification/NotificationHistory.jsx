import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../../config/url'
import { Check, Clock, AlertCircle, User, Mail, Calendar, Eye, Trash } from 'lucide-react'
import { toast } from 'react-toastify'
import PageLoader from '../PageLoader'

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')


  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/history`)
      setNotifications(response.data.notifications)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      toast.error('Failed to load notification history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])
  

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter
    
    const matchesDate = !dateFilter || 
                       new Date(notification.sendAt).toDateString() === new Date(dateFilter).toDateString()
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check className="h-4 w-4 text-green-500" />
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification)
    setIsDetailModalOpen(true)
  }


  const handleDeleteNotification =async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/api/notifications/${id}`)
      toast.success(res.data.message)
      fetchNotifications()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Notification History</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>
        
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
      </div>

      {/* Notification Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Message</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Sent At</th>
              <th className="py-3 px-4 text-left">Recipients</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <tr key={notification._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{notification.title}</td>
                  <td className="py-3 px-4 max-w-xs truncate">{notification.message}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(notification.status)}
                      <span className="capitalize">{notification.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(notification.sendAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{notification.recipients?.length || 0}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(notification)}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteNotification(notification._id)}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Trash className="h-4 w-4" />
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No notifications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Notification Detail Modal */}
      {isDetailModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedNotification.title}</h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Message</h3>
                  <p className="mt-1">{selectedNotification.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="mt-1 flex items-center gap-2">
                      {getStatusIcon(selectedNotification.status)}
                      <span className="capitalize">{selectedNotification.status}</span>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Sent At</h3>
                    <p className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {new Date(selectedNotification.sendAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Recipients</h3>
                    <p className="mt-1 flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {selectedNotification.recipients?.length || 0} users
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Target Roles</h3>
                    <p className="mt-1">
                      {selectedNotification.targetRoles?.join(', ') || selectedNotification.targetType	}
                    </p>
                  </div>
                </div>

                {selectedNotification.logs?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Logs</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-2 px-4 text-left">User</th>
                            <th className="py-2 px-4 text-left">Delivered</th>
                            <th className="py-2 px-4 text-left">Seen</th>
                            <th className="py-2 px-4 text-left">Seen At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedNotification.logs.map((log, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2 px-4">{log.userId?.name || 'Unknown user'}</td>
                              <td className="py-2 px-4">
                                {log.delivered ? '✓' : '✗'}
                              </td>
                              <td className="py-2 px-4">
                                {log.seen ? '✓' : '✗'}
                              </td>
                              <td className="py-2 px-4">
                                {log.seenAt ? new Date(log.seenAt).toLocaleString() : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationHistory