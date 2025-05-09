import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config/url';
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import PageLoader from './../components/PageLoader';
import UserDetailSection from '../components/user/UserDetailSection';


const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);


  useEffect(() => {
  const fetchData = async () => {
    try {
      const [userRes, enrollmentsRes] = await Promise.all([
        axios.get(`${API_URL}/api/auth/users/${id}`),
        axios.get(`${API_URL}/api/enrollments/${id}`)
      ]);

      setUser(userRes.data.user);
      setEnrollments(enrollmentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, [id]);


  if (!user) {
    return <div className="flex justify-center items-center h-screen"><PageLoader/></div>;
  }

  return (
    <div className='flex flex-col min-h-screen'>
    <div>
        <ArrowLeftIcon className="w-8 h-8 text-gray-400 hover:bg-gray-300 p-1 rounded-full cursor-pointer" onClick={() => window.history.back()}/>
      </div>

    <div className="flex flex-col lg:flex-row gap-6 p-6">

      
      

      {/* Left Panel - Analytics */}
      <div className="lg:w-2/3 w-full bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">User Details</h2>
        <UserDetailSection enrollments={enrollments}/>
      </div>


      {/* Right Panel - User Profile */}
      <div className="lg:w-1/3 w-full bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center text-center mb-6">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
          ) : (
            <UserCircleIcon className="w-32 h-32 text-gray-400" />
          )}
          <h2 className="text-xl font-bold mt-4">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-gray-500">{user.phone || 'No phone provided'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Age Range</h4>
            <p className="text-gray-600">{user.ageRange}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Gender</h4>
            <p className="text-gray-600">{user.gender}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Experience Level</h4>
            <p className="text-gray-600 capitalize">{user.experienceLevel}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Status</h4>
            <p className={`font-medium ${user.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
              {user.status}
            </p>
          </div>
        </div>

        {/* Goals */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Goals</h4>
          <div className="flex flex-wrap gap-2">
            {user.goals?.map((goal, i) => (
              <span key={i} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                {goal}
              </span>
            ))}
          </div>
        </div>

        {/* Choosen Area */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Choosen Areas</h4>
          <div className="flex flex-wrap gap-2">
            {user.choosenArea?.map((area, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Questionnaire Answers */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Onboarding</h4>
          <div className="flex flex-wrap gap-2">
            {user.questionnaireAnswers &&
              Object.entries(user.questionnaireAnswers).map(([questionId, answers], i) => (
                <p key={i} className="text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">{answers.join(', ')}</span> 
                </p>
              ))}
          </div>
        </div>
      </div>

    </div>
    </div>
  );
};

export default UserDetail;
