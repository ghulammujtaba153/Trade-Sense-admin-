import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../config/url'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import Loading from './Loading'
import PageLoader from './PageLoader'

const EnrollmentGraph = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/enrollments/growth`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Group by date (YYYY-MM-DD)
      const grouped = res.data.reduce((acc, curr) => {
        const date = new Date(curr.enrolledAt).toISOString().split("T")[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {})

      // Format for Recharts
      const formatted = Object.entries(grouped).map(([date, count]) => ({
        date,
        count
      }))

      setData(formatted)

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  if (loading) return <div className='flex justify-center items-center h-screen'>
        <PageLoader/>
    </div>

  return (
    <div className='mt-8'>
      <h2 className='text-xl font-semibold mb-4'>Enrollment Growth</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EnrollmentGraph
