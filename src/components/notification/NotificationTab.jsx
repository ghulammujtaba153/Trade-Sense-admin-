import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, Typography, TextField, Button } from '@mui/material';
import NotificationHistory from './NotificationHistory';
import NotificationAnalytics from './NotificationAnalytics';
import CreateNotification from './CreateNotification';
import { API_URL } from '../../config/url';

const Notification = () => {
  const [value, setValue] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationText, setNotificationText] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState({ total: 0, sent: 0, scheduled: 0 });

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/api/notifications/all`);
        const data = await response.json();
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  // Fetch notification history
  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/history`);
      const data = await response.json();
      setHistory(data.history);
    } catch (error) {
      console.error('Error fetching notification history:', error);
    }
  };

  // Fetch notification analytics
  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/notification/analytics');
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Error fetching notification analytics:', error);
    }
  };

  // Create a new notification
  const handleCreateNotification = async (e) => {
    e.preventDefault();
    const notification = { text: notificationText, scheduledAt: scheduledTime };
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });
      const data = await response.json();
      setNotifications([...notifications, data.notification]);
      setNotificationText('');
      setScheduledTime('');
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  // Handle schedule toggle
  const handleScheduleToggle = () => {
    setIsScheduled(!isScheduled);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      fetchHistory();
    } else if (newValue === 2) {
      fetchAnalytics();
    }
  };

  return (
    <div>
      

      {/* Tab Navigation */}
      <Tabs value={value} onChange={handleChange} aria-label="notification tabs">
        <Tab label="Create Notification" />
        <Tab label="Notification History" />
        <Tab label="Notification Analytics" />
      </Tabs>

      {/* Tab Contents */}
      <Box sx={{ padding: 2 }}>
        {value === 0 && (
          <CreateNotification/>
        )}

        {value === 1 && (
          <NotificationHistory/>
        )}

        {value === 2 && (
          <NotificationAnalytics/>
        )}
      </Box>
    </div>
  );
};

export default Notification;
