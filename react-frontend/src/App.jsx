import React, { useState, useEffect } from 'react';

const DJAgencyApp = () => {
  const [schedules, setSchedules] = useState([]);
  const [djs, setDjs] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [selectedDj, setSelectedDj] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    dj: ''
  });

  // Mock data for demo purposes
  const mockDJs = ['DJ Alex', 'DJ Sarah', 'DJ Mike', 'DJ Lisa'];
  const mockSchedules = [
    { id: 1, date: '2025-08-20', time: '20:00', location: 'Wedding Hall A', dj: 'DJ Alex' },
    { id: 2, date: '2025-08-22', time: '19:30', location: 'Corporate Event Center', dj: 'DJ Sarah' },
    { id: 3, date: '2025-08-25', time: '21:00', location: 'Birthday Party Venue', dj: 'DJ Mike' }
  ];

  // Initialize with mock data
  useEffect(() => {
    setDjs(mockDJs);
    setSchedules(mockSchedules);
  }, []);

  // Show message to user
  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  // Handle form submission
  const handleAddSchedule = () => {
    // Basic validation
    if (!formData.date || !formData.time || !formData.location || !formData.dj) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newSchedule = {
        id: schedules.length + 1,
        ...formData
      };
      
      setSchedules([...schedules, newSchedule]);
      showMessage('Schedule added successfully!', 'success');
      setFormData({ date: '', time: '', location: '', dj: '' });
      setCurrentView('master-calendar');
      setLoading(false);
    }, 1000);
  };

  // Handle delete schedule
  const handleDeleteSchedule = (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
    showMessage('Schedule deleted successfully!', 'success');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Navigation handlers
  const handleViewDJCalendar = (djName) => {
    setSelectedDj(djName);
    setCurrentView('dj-calendar');
  };

  // Sort schedules by date
  const sortedSchedules = [...schedules].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Filter schedules for specific DJ
  const djSchedules = selectedDj ? schedules.filter(schedule => schedule.dj === selectedDj) : [];
  const sortedDjSchedules = [...djSchedules].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Render message
  const renderMessage = () => {
    if (!message) return null;
    
    return (
      <div className={`p-4 mb-4 rounded-lg ${
        messageType === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 
        'bg-green-100 text-green-700 border border-green-300'
      }`}>
        {message}
      </div>
    );
  };

  // Simple icon components
  const Icon = ({ name, className = "w-6 h-6" }) => {
    const icons = {
      music: "🎵",
      calendar: "📅", 
      users: "👥",
      plus: "➕",
      clock: "🕐",
      location: "📍",
      trash: "🗑️"
    };
    return <span className={`inline-block ${className}`}>{icons[name] || "📄"}</span>;
  };

  // Render navigation
  const renderNavigation = () => (
    <nav className="bg-blue-600 text-white p-4 mb-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="music" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">DJ Agency</h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-4 py-2 rounded ${currentView === 'home' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('master-calendar')}
            className={`px-4 py-2 rounded ${currentView === 'master-calendar' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
          >
            Master Calendar
          </button>
          <button
            onClick={() => setCurrentView('add-schedule')}
            className={`px-4 py-2 rounded ${currentView === 'add-schedule' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
          >
            Add Schedule
          </button>
        </div>
      </div>
    </nav>
  );

  // Render home view
  const renderHome = () => (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
          <h2 className="text-4xl font-bold mb-4">Welcome to DJ Agency</h2>
          <p className="text-xl mb-4">Professional DJ services for all your events</p>
          <p className="mb-6">Manage schedules, view calendars, and coordinate your DJ team all in one place.</p>
          <button
            onClick={() => setCurrentView('master-calendar')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Icon name="calendar" className="w-5 h-5 inline mr-2" />
            View Master Calendar
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <Icon name="users" className="w-6 h-6 mr-2" />
            Our DJs
          </h3>
          <div className="space-y-3">
            {djs.map((dj) => (
              <div key={dj} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium">{dj}</span>
                <button
                  onClick={() => handleViewDJCalendar(dj)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  View Calendar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Icon name="plus" className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Add Schedules</h3>
          <p className="text-gray-600 mb-4">Schedule your DJs for upcoming events</p>
          <button
            onClick={() => setCurrentView('add-schedule')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add Schedule
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Icon name="calendar" className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Master Calendar</h3>
          <p className="text-gray-600 mb-4">View all scheduled events in one place</p>
          <button
            onClick={() => setCurrentView('master-calendar')}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
          >
            View Calendar
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Icon name="users" className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">DJ Calendars</h3>
          <p className="text-gray-600 mb-4">Individual schedules for each DJ</p>
          <select
            onChange={(e) => e.target.value && handleViewDJCalendar(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue=""
          >
            <option value="">Select a DJ</option>
            {djs.map((dj) => (
              <option key={dj} value={dj}>{dj}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  // Render schedule card
  const renderScheduleCard = (schedule, showDelete = false) => (
    <div key={schedule.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div className="text-lg font-bold text-gray-800">
          {new Date(schedule.date).toLocaleDateString()}
        </div>
        {showDelete && (
          <button
            onClick={() => handleDeleteSchedule(schedule.id)}
            className="text-red-600 hover:text-red-800 p-2"
            title="Delete schedule"
          >
            <Icon name="trash" className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <Icon name="users" className="w-4 h-4 mr-2" />
          <span className="font-medium">{schedule.dj}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Icon name="clock" className="w-4 h-4 mr-2" />
          <span>{schedule.time}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Icon name="location" className="w-4 h-4 mr-2" />
          <span>{schedule.location}</span>
        </div>
      </div>
    </div>
  );

  // Render master calendar
  const renderMasterCalendar = () => (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Master Calendar</h2>
        <button
          onClick={() => setCurrentView('add-schedule')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center"
        >
          <Icon name="plus" className="w-4 h-4 mr-2" />
          Add Schedule
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schedules...</p>
        </div>
      ) : sortedSchedules.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSchedules.map((schedule) => renderScheduleCard(schedule, true))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="calendar" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No schedules yet</h3>
          <p className="text-gray-500 mb-4">Start by adding your first schedule.</p>
          <button
            onClick={() => setCurrentView('add-schedule')}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            <Icon name="plus" className="w-4 h-4 inline mr-2" />
            Add First Schedule
          </button>
        </div>
      )}
    </div>
  );

  // Render DJ calendar
  const renderDJCalendar = () => (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          <Icon name="users" className="inline w-8 h-8 mr-2" />
          {selectedDj} Calendar
        </h2>
        <button
          onClick={() => setCurrentView('home')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Back to Home
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schedules...</p>
        </div>
      ) : sortedDjSchedules.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDjSchedules.map((schedule) => renderScheduleCard(schedule, false))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="calendar" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No schedules for {selectedDj}</h3>
          <p className="text-gray-500 mb-4">This DJ doesn't have any scheduled events yet.</p>
          <button
            onClick={() => setCurrentView('add-schedule')}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            <Icon name="plus" className="w-4 h-4 inline mr-2" />
            Add Schedule
          </button>
        </div>
      )}
    </div>
  );

  // Render add schedule view
  const renderAddSchedule = () => (
    <div className="container mx-auto px-4 max-w-lg">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Icon name="plus" className="w-6 h-6 mr-2" />
          Add New Schedule
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter event location"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DJ</label>
            <select
              name="dj"
              value={formData.dj}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a DJ</option>
              {djs.map((dj) => (
                <option key={dj} value={dj}>{dj}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={handleAddSchedule}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Schedule'}
            </button>
            <button
              onClick={() => setCurrentView('master-calendar')}
              className="w-full bg-gray-600 text-white py-3 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {renderNavigation()}
      {renderMessage()}
      
      {currentView === 'home' && renderHome()}
      {currentView === 'master-calendar' && renderMasterCalendar()}
      {currentView === 'dj-calendar' && renderDJCalendar()}
      {currentView === 'add-schedule' && renderAddSchedule()}
    </div>
  );
};

export default DJAgencyApp;