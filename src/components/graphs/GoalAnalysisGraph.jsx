import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../config/url';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

const GoalAnalysisGraph = () => {
  const [chartData, setChartData] = useState([]);

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/goals/analysis/win`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const completedCount = res.data.completedGoals.length;
      const activeCount = res.data.activeGoals.length;

      const transformedData = [
        { name: 'Completed Goals', count: completedCount },
        { name: 'Active Goals', count: activeCount }
      ];

      setChartData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>Goal Analysis</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" barSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GoalAnalysisGraph;
