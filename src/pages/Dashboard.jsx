import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from './../config/url';
import axios from 'axios';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Loading from '../components/Loading';
import PageLoader from '../components/PageLoader';
import GoalAnalysisGraph from '../components/graphs/GoalAnalysisGraph';


const Dashboard = () => {
  const [data, setData] =useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCardInfo = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard`);
      setData(res.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchUserGrowth = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/user/growth`);
  
      // Group users by date (YYYY-MM-DD)
      const dateCounts = res.data.reduce((acc, item) => {
        const date = new Date(item.createdAt).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
  
      
      const formatted = Object.entries(dateCounts).map(([date, count]) => ({
        createdAt: date,
        count,
      }));
  
      setUserGrowth(formatted);
    } catch (error) {
      console.log(error);
    }
  };
  
  

  const fetchRatings = async () =>{
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/ratings`);
      setRatings(res.data.ratings);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchCardInfo();
    fetchUserGrowth();
    fetchRatings();
  },[])


  if (loading) return <div className='flex justify-center items-center h-screen'>
        <PageLoader/>
    </div>


  return (
    <div className='p-8 '>
      <h1 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Dashboard Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{data.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Active Enrollment</h3>
          <p className="text-3xl font-bold">{data.activeEnrollments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Total Enrollments</h3>
          <p className="text-3xl font-bold">{data.totalEnrollments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Courses Published</h3>
          <p className="text-3xl font-bold">{data.coursePublished}</p>
        </div>
        
        <div className="bg-white flex flex-col gap-2 p-6 rounded-lg shadow">
          <Link to="/register" className='bg-primary text-white p-2 rounded-md'>Create User</Link>
          <Link to="/plans" className='bg-primary text-white p-2 rounded-md'>Add plan</Link>
          <Link to="/courses" className='bg-primary text-white p-2 rounded-md'>Add Course</Link>
        </div>
      </div>


      <div className='flex flex-wrap gap-4 mt-4'>
        
          {/* Ratings Section */}
          <div className="bg-white p-6 rounded-lg shadow w-full md:w-[48%]">
            <h2 className="text-lg font-bold mb-4">Course Ratings</h2>
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="mb-2">
                <div className="flex justify-between mb-1 text-sm text-gray-600">
                  <span>{star} Star</span>
                  <span>{ratings[star] || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full"
                    style={{
                      width: `${
                        ratings[star]
                          ? (ratings[star] / Math.max(...Object.values(ratings))) * 100
                          : 0
                      }%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>


          {/* User Growth Graph */}
          <div className="bg-white p-6 rounded-lg shadow w-full md:w-[48%]">
            <h2 className="text-lg font-bold mb-4">User Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userGrowth}>
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                <CartesianGrid stroke="#ccc" />
                <XAxis
                  dataKey="createdAt"
                  tickFormatter={(tick) =>
                    new Date(tick).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        

      </div>


      <div className='bg-white p-6 rounded-lg shadow w-full mt-4'>
        <GoalAnalysisGraph/>
      </div>


    </div>
  );
};

export default Dashboard;