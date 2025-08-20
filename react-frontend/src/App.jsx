import React, { useState, useEffect } from 'react';

const DJAgencyApp = () => {
  const [schedules, setSchedules] = useState([]);
  const [djs, setDjs] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [selectedDj, setSelectedDj] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    dj: ''
  });

  // Enhanced mock data with DJ specialties and images
  const mockDJs = [
    { name: 'DJ NEON', specialty: 'Electronic · House', experience: '8 Years', image: '🎧' },
    { name: 'DJ VIBE', specialty: 'Hip-Hop · R&B', experience: '6 Years', image: '🎤' },
    { name: 'DJ PULSE', specialty: 'Techno · Deep House', experience: '10 Years', image: '🎚️' },
    { name: 'DJ FLUX', specialty: 'Pop · Commercial', experience: '5 Years', image: '🎵' }
  ];

  const mockSchedules = [
    { id: 1, date: '2025-08-20', time: '20:00', location: 'Skybar Rooftop', dj: 'DJ NEON', type: 'Club Night' },
    { id: 2, date: '2025-08-22', time: '19:30', location: 'Corporate Headquarters', dj: 'DJ VIBE', type: 'Corporate Event' },
    { id: 3, date: '2025-08-25', time: '21:00', location: 'Grand Ballroom', dj: 'DJ PULSE', type: 'Wedding Reception' }
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
    if (!formData.date || !formData.time || !formData.location || !formData.dj) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newSchedule = {
        id: schedules.length + 1,
        ...formData,
        type: 'Custom Event'
      };
      
      setSchedules([...schedules, newSchedule]);
      showMessage('Event scheduled successfully! 🎉', 'success');
      setFormData({ date: '', time: '', location: '', dj: '' });
      setCurrentView('master-calendar');
      setLoading(false);
    }, 1000);
  };

  // Handle delete schedule
  const handleDeleteSchedule = (scheduleId) => {
    if (!window.confirm('Are you sure you want to cancel this event?')) {
      return;
    }
    setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
    showMessage('Event cancelled successfully', 'success');
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
    setIsMenuOpen(false);
  };

  // Sort schedules by date
  const sortedSchedules = [...schedules].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Filter schedules for specific DJ
  const djSchedules = selectedDj ? schedules.filter(schedule => schedule.dj === selectedDj) : [];
  const sortedDjSchedules = [...djSchedules].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Render message with modern styling
  const renderMessage = () => {
    if (!message) return null;
    
    return (
      <div className={`fixed top-20 right-4 p-4 rounded-xl shadow-2xl backdrop-blur-lg z-50 transform transition-all duration-500 ${
        messageType === 'error' ? 
        'bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white' : 
        'bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white'
      }`}>
        <div className="flex items-center space-x-2">
          <span>{messageType === 'error' ? '⚠️' : '✨'}</span>
          <span className="font-medium">{message}</span>
        </div>
      </div>
    );
  };

  // Modern navigation with glassmorphism
  const renderNavigation = () => (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-gray-800/50 z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-xl">🎧</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                VIBE COLLECTIVE
              </h1>
              <p className="text-xs text-gray-400 -mt-1">DJ AGENCY</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { key: 'home', label: 'HOME', icon: '🏠' },
              { key: 'master-calendar', label: 'EVENTS', icon: '📅' },
              { key: 'add-schedule', label: 'BOOK', icon: '✨' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => { setCurrentView(item.key); setIsMenuOpen(false); }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentView === item.key 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm tracking-wide">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ${isMenuOpen ? 'rotate-45 top-3' : 'top-1'}`}></span>
              <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 top-3 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ${isMenuOpen ? '-rotate-45 top-3' : 'top-5'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col space-y-2 pt-4">
              {[
                { key: 'home', label: 'HOME', icon: '🏠' },
                { key: 'master-calendar', label: 'EVENTS', icon: '📅' },
                { key: 'add-schedule', label: 'BOOK', icon: '✨' }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => { setCurrentView(item.key); setIsMenuOpen(false); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-left transition-all duration-300 ${
                    currentView === item.key 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="tracking-wide">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  // Hero section with video background effect
  const renderHome = () => (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900">
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              VIBE COLLECTIVE
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-2 tracking-widest">
              PREMIUM DJ AGENCY
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Elevate your events with world-class DJs who understand the pulse of the crowd. 
              From intimate gatherings to massive celebrations, we bring the energy.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => setCurrentView('add-schedule')}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg tracking-wide transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
            >
              <span className="flex items-center space-x-2">
                <span>BOOK NOW</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
            <button
              onClick={() => setCurrentView('master-calendar')}
              className="px-8 py-4 border-2 border-gray-600 rounded-full font-bold text-lg tracking-wide hover:border-purple-500 hover:text-purple-400 transition-all duration-300"
            >
              VIEW EVENTS
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">500+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">50+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Artists</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">5★</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Rating</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Featured DJs Section */}
      <div className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FEATURED ARTISTS
            </h2>
            <p className="text-xl text-gray-400">Meet the masters of the mix</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {djs.map((dj, index) => (
              <div
                key={dj.name}
                className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-500 cursor-pointer"
                onClick={() => handleViewDJCalendar(dj.name)}
              >
                {/* DJ Card */}
                <div className="p-6 relative z-10">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                      {dj.image}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{dj.name}</h3>
                    <p className="text-purple-400 text-sm font-medium">{dj.specialty}</p>
                    <p className="text-gray-500 text-xs">{dj.experience}</p>
                  </div>

                  <button className="w-full bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-medium transition-all duration-300">
                    View Calendar
                  </button>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 px-6 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
              OUR SERVICES
            </h2>
            <p className="text-xl text-gray-400">Complete entertainment solutions</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'CLUB NIGHTS',
                description: 'High-energy sets that keep the dancefloor packed',
                icon: '🎪',
                color: 'from-purple-600 to-blue-600'
              },
              {
                title: 'PRIVATE EVENTS',
                description: 'Customized music experiences for your special occasions',
                icon: '🎉',
                color: 'from-pink-600 to-purple-600'
              },
              {
                title: 'CORPORATE',
                description: 'Professional entertainment for business events',
                icon: '🏢',
                color: 'from-blue-600 to-cyan-600'
              }
            ].map((service, index) => (
              <div
                key={service.title}
                className="group bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  <button
                    onClick={() => setCurrentView('add-schedule')}
                    className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Modern schedule card
  const renderScheduleCard = (schedule, showDelete = false) => (
    <div key={schedule.id} className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-lg">
              📅
            </div>
            <div>
              <div className="text-white font-bold text-lg">
                {new Date(schedule.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-purple-400 text-sm font-medium">{schedule.type}</div>
            </div>
          </div>
          {showDelete && (
            <button
              onClick={() => handleDeleteSchedule(schedule.id)}
              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              title="Cancel event"
            >
              🗑️
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-300">
            <span className="w-5 text-purple-400">🎧</span>
            <span className="ml-3 font-medium">{schedule.dj}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <span className="w-5 text-blue-400">⏰</span>
            <span className="ml-3">{schedule.time}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <span className="w-5 text-pink-400">📍</span>
            <span className="ml-3">{schedule.location}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Master calendar with dark theme
  const renderMasterCalendar = () => (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              EVENT CALENDAR
            </h2>
            <p className="text-gray-400">Upcoming shows and events</p>
          </div>
          <button
            onClick={() => setCurrentView('add-schedule')}
            className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-xl"
          >
            <span className="flex items-center space-x-2">
              <span>✨</span>
              <span>BOOK EVENT</span>
            </span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading events...</p>
          </div>
        ) : sortedSchedules.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSchedules.map((schedule) => renderScheduleCard(schedule, true))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              📅
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Events Scheduled</h3>
            <p className="text-gray-400 mb-8">Ready to create something amazing?</p>
            <button
              onClick={() => setCurrentView('add-schedule')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center space-x-2">
                <span>✨</span>
                <span>BOOK FIRST EVENT</span>
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // DJ calendar with enhanced styling
  const renderDJCalendar = () => (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl">
              🎧
            </div>
            <div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {selectedDj}
              </h2>
              <p className="text-gray-400">Personal calendar</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('home')}
            className="mt-4 sm:mt-0 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300"
          >
            ← BACK HOME
          </button>
        </div>

        {sortedDjSchedules.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDjSchedules.map((schedule) => renderScheduleCard(schedule, false))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              📅
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Events for {selectedDj}</h3>
            <p className="text-gray-400 mb-8">This artist is available for bookings</p>
            <button
              onClick={() => setCurrentView('add-schedule')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300"
            >
              BOOK {selectedDj.split(' ')[1]}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Modern booking form
  const renderAddSchedule = () => (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                ✨
              </div>
              <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                BOOK AN EVENT
              </h2>
              <p className="text-gray-400">Let's create something unforgettable</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Event Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Start Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Venue Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter the event venue"
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Select DJ</label>
                <select
                  name="dj"
                  value={formData.dj}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Choose your artist</option>
                  {djs.map((dj) => (
                    <option key={dj.name} value={dj.name}>{dj.name} - {dj.specialty}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 pt-6">
                <button
                  onClick={handleAddSchedule}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>BOOKING...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>🚀</span>
                      <span>BOOK EVENT</span>
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setCurrentView('master-calendar')}
                  className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all duration-300"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
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