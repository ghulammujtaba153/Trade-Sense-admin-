"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, Clock, Users, Check, XCircle } from "lucide-react"
import { toast } from 'react-toastify'
import axios from "axios"
import { API_URL } from "../../config/url"

// Mock data for users and roles
const mockUsers = [
  { id: "user1", name: "John Doe", email: "john@example.com" },
  { id: "user2", name: "Jane Smith", email: "jane@example.com" },
  { id: "user3", name: "Bob Johnson", email: "bob@example.com" },
  { id: "user4", name: "Alice Williams", email: "alice@example.com" },
  { id: "user5", name: "Charlie Brown", email: "charlie@example.com" },
]

const mockRoles = [
  { id: "admin", name: "Administrator" },
  { id: "user", name: "Regular User" },
  { id: "editor", name: "Content Editor" },
]

export default function CreateNotification() {
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetType: "all",
    sendType: "now",
    sendAt: new Date().toISOString().slice(0, 16),
  })
  const [users, setUsers] = useState([])

  const fetchUsers=async()=>{
    try {
        const res = await axios.get(`${API_URL}/api/auth/users`);
        setUsers(res.data.users);
        console.log(res.data.users);
    } catch (error) {
        console.log(error);
    }
  }


  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase()),
  )

  const validateForm = () => {
    if (!formData.title || formData.title.length < 2 || formData.title.length > 100) {
      return "Title must be between 2 and 100 characters."
    }
    if (!formData.message || formData.message.length < 5 || formData.message.length > 500) {
      return "Message must be between 5 and 500 characters."
    }
    if (formData.targetType === "specific" && selectedUsers.length === 0) {
      return "Please select at least one user."
    }
    if (formData.targetType === "roles" && selectedRoles.length === 0) {
      return "Please select at least one role."
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const error = validateForm()
    if (error) {
      toast.error(error)
      return
    }

    try {
      const notificationData = {
        ...formData,
        recipients: formData.targetType === "specific" ? selectedUsers.map((user) => user._id) : [],
        targetRoles: formData.targetType === "roles" ? selectedRoles : [],
        status: formData.sendType === "now" ? "sent" : "scheduled",
      }

      console.log(notificationData);
      
      const res = await axios.post(`${API_URL}/api/notifications/create`, notificationData)
      console.log(res.data)
      toast.success("Notification created successfully!")

      // Reset form
      setFormData({
        title: "",
        message: "",
        targetType: "all",
        sendType: "now",
        sendAt: new Date().toISOString().slice(0, 16),
      })
      setSelectedUsers([])
      setSelectedRoles([])
    } catch (error) {
      toast.error("There was an error creating your notification.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id) ? prev.filter((u) => u._id !== user._id) : [...prev, user]
    )
  }

  const handleSelectRole = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    )
  }

  const removeSelectedUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== userId))
  }

  const removeSelectedRole = (roleId) => {
    setSelectedRoles((prev) => prev.filter((id) => id !== roleId))
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Notification</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title and Message */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter notification title"
            className="mt-2 w-full p-3 border border-gray-300 rounded-md"
          />
          <p className="text-sm text-gray-500 mt-1">This will be displayed as the notification title.</p>
        </div>

        <div>
          <label htmlFor="message" className="block text-lg font-medium">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Enter notification message"
            rows="4"
            className="mt-2 w-full p-3 border border-gray-300 rounded-md"
          />
          <p className="text-sm text-gray-500 mt-1">The main content of your notification.</p>
        </div>

        {/* Target Recipients */}
        <div>
          <label htmlFor="targetType" className="block text-lg font-medium">Who should receive this notification?</label>
          <select
            id="targetType"
            name="targetType"
            value={formData.targetType}
            onChange={handleInputChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="all">All Users</option>
            <option value="specific">Specific Users</option>
            <option value="roles">By User Role</option>
          </select>
        </div>

        {formData.targetType === "specific" && (
          <div className="mt-4">
            <label className="block text-lg font-medium">Select Users</label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="p-3 border border-gray-300 rounded-md w-full"
                placeholder="Search users..."
              />
              <button
                type="button"
                className="p-2 bg-gray-300 rounded-md"
                onClick={() => setUserSearchQuery("")}
              >
                <Users className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedUsers.map(user => (
                  <div key={user.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                    {user.name}
                    <button 
                      type="button" 
                      onClick={() => removeSelectedUser(user._id)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 max-h-60 overflow-y-auto border rounded-md p-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user._id} onClick={() => handleSelectUser(user)} className="cursor-pointer flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <p
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedUsers.some(u => u._id === user._id) 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {selectedUsers.some(u => u._id === user._id) ? "Remove" : "Add"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500">No users found</p>
              )}
            </div>
          </div>
        )}

        {formData.targetType === "roles" && (
          <div className="mt-4">
            <label className="block text-lg font-medium">Select Roles</label>
            
            {/* Selected Roles */}
            {selectedRoles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedRoles.map(roleId => {
                  const role = mockRoles.find(r => r.id === roleId)
                  return (
                    <div key={roleId} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                      {role?.name || roleId}
                      <button 
                        type="button" 
                        onClick={() => removeSelectedRole(roleId)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="mt-4 space-y-2">
              {mockRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleSelectRole(role.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`role-${role.id}`} className="text-lg">{role.name}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Send Type */}
        <div>
          <label htmlFor="sendType" className="block text-lg font-medium">When to send?</label>
          <select
            id="sendType"
            name="sendType"
            value={formData.sendType}
            onChange={handleInputChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="now">Send Immediately</option>
            <option value="scheduled">Schedule for Later</option>
          </select>
        </div>

        {formData.sendType === "scheduled" && (
          <div className="mt-4">
            <label htmlFor="sendAt" className="block text-lg font-medium">Schedule Date and Time</label>
            <input
              type="datetime-local"
              id="sendAt"
              name="sendAt"
              value={formData.sendAt}
              onChange={handleInputChange}
              min={new Date().toISOString().slice(0, 16)}
              className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            />
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            {formData.sendType === "now" ? (
              <>
                <Check className="h-5 w-5" />
                Send Notification
              </>
            ) : (
              <>
                <Clock className="h-5 w-5" />
                Schedule Notification
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}